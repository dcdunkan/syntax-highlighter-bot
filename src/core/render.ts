import { highlight } from "./highlight.ts";
import { render } from "./engine.ts";
import { getTheme } from "./themes.ts";

export interface ImageOptions {
  wrap?: boolean;
}

export function getImageBuffer(
  code: string,
  theme = "github-dark",
  font = "JetBrains Mono NL",
  fontSize = 12,
  language = "",
  options?: ImageOptions, // unused for now
) {
  return render(highlight(code, language), {
    css: getTheme(theme),
    font: font,
    fontSize: fontSize,
    scale: 2,
    ...options,
  });
}
