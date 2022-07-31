import { initialize, resolve, svg2png } from "../deps.ts";
import { getDeclarations, makeSVG } from "./generate_svg.ts";
import { loadFonts } from "./helpers.ts";

const FONT_DIR = resolve("assets/fonts");
const fonts = loadFonts(FONT_DIR);

await initialize(Deno.readFile("./assets/svg2png_wasm_bg.wasm"));

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
  );
  return svg2png(svg, {
    fonts: fonts,
    backgroundColor: config.backgroundColor ?? props.get(".hljs")!.background,
    scale: config.scale ?? 2,
    defaultFontFamily: {
      monospaceFamily: config.font ?? "JetBrains Mono NL", // non-ligatured is better for this usecase.
    },
  });
}
