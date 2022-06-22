import { css, puppeteer } from "../deps.ts";
import { getTheme } from "./themes.ts";
import { highlight } from "./highlight.ts";

export interface ImageOptions {
  wrap?: boolean;
}

export const browser = await puppeteer.launch({
  executablePath: "google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

function html(
  code: string,
  themeStyles: string,
  fontName: string,
  color: string,
  bgColor: string,
  language: string,
  options: ImageOptions,
) {
  return `
<html lang="en"><head>
<link href="https://fonts.googleapis.com/css2?family=${
    encodeURIComponent(fontName)
  }&display=swap" rel="stylesheet">
<style>${themeStyles}
#code {
  white-space: pre-wrap;
  font-family: '${fontName}', monospace;
  font-size: 14pt;
  padding: 5px;
}.line-number {
  text-align: right;
  vertical-align: top;
  color: ${color}80;
  padding-right: 10px;
  border-right: 1px dashed ${color}40;
}.code-line {
  padding-left: 10px;
  font-family: '${fontName}', monospace;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${color};
  background: ${bgColor};
}
::-webkit-scrollbar {
  display: none;
}
</style></head>
<body style="display: inline-block;"><pre  style="${
    options.wrap ? "max-width: 1400px;" : "width: max-content;"
  }"><code class="hljs ${language}" id="code">${code}</code></pre></body></html>`;
}

function getHtml(
  content: string,
  theme: string,
  fontName: string,
  language: string,
  options: ImageOptions,
) {
  const themeCss = getTheme(theme);

  const parsedCss = css
    .parse(themeCss)
    .stylesheet.rules.find((rule) => rule.selectors.includes(".hljs"))!;

  const declarations = parsedCss.declarations as css.Decl[];

  const styles = declarations.map(({ name, value }: css.Decl) => {
    if (value?.length === 4) value += value.substring(1);
    return { name, value };
  }) as { name: string; value: string }[];

  const { value: color } = styles.find((style) => style.name === "color")!;
  const { value: bgColor } = styles.find(
    ({ name }) => name === "background",
  )!;

  return html(
    highlight(content, language),
    themeCss,
    fontName,
    color,
    bgColor,
    language,
    options,
  );
}

export async function getScreenshotBuffer(
  code: string,
  theme = "atom-one-dark",
  fontName = "Fira Code",
  language = "",
  options?: ImageOptions,
): Promise<string | void | Uint8Array> {
  options = {
    wrap: true,
    ...options,
  };
  const html = getHtml(code, theme, fontName, language, options);
  const page = await browser.newPage();

  await page.setContent(html, {
    waitUntil: "networkidle2",
  });

  const highlightedCode = await page.$("#code");
  if (!highlightedCode) return;

  const image = await highlightedCode.screenshot();
  await page.close();
  return image;
}

// console.log(await getScreenshotBuffer("console.log('Hello mom!');"));
// console.log(await getScreenshotBuffer("print('gg')"));
