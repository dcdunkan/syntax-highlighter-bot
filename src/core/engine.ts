import { createSvg2png, initialize, resolve } from "../deps.ts";
import { getDeclarations, makeSVG } from "./generate_svg.ts";
import { isSupportedFont, loadFonts } from "./helpers.ts";

await initialize(Deno.readFile("./assets/svg2png.wasm"));

const FONT_DIR = resolve("assets/fonts");
const fonts = await loadFonts(FONT_DIR);
const svg2png = createSvg2png({
  fonts,
  defaultFontFamily: {
    monospaceFamily: "JetBrains Mono NL", // non-ligatured is better for this usecase.
  },
});

export function render(
  htmlString: string,
  config: {
    css: string;
    font?: string;
    fontPath?: string; // TODO
    fontSize?: number;
    backgroundColor?: string;
    scale?: number;

    // bot options
    wrap?: boolean;
  },
) {
  const props = getDeclarations(config.css);
  const svg = makeSVG(
    htmlString,
    props,
    config.fontSize ?? 12,
    config.wrap ?? true,
    config.font && isSupportedFont(config.font)
      ? config.font
      : "JetBrains Mono NL",
  );
  return svg2png(svg, {
    backgroundColor: config.backgroundColor ?? props.get(".hljs")!.background,
    scale: config.scale ?? 2,
  });
}
