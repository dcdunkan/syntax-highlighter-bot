function getFonts(directory: string) {
  const fonts: string[] = [];
  for (const { name } of Deno.readDirSync(directory)) {
    fonts.push(`${directory}/${name}`);
  }
  return fonts;
}

export function loadFonts(directory: string) {
  const fonts = getFonts(directory);
  return Promise.all(fonts.map((fontPath) => Deno.readFile(fontPath)));
}

export function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const fonts = [
  "Fira Code",
  "JetBrains Mono NL",
  "Source Code Pro",
];

export function isSupportedFont(name: string) {
  return fonts.includes(name);
}
