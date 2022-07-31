export function loadFonts(directory: string) {
  const fonts: Uint8Array[] = [];
  for (const { name } of Deno.readDirSync(directory)) {
    fonts.push(Deno.readFileSync(`${directory}/${name}`));
  }
  return fonts;
}

export function escape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
