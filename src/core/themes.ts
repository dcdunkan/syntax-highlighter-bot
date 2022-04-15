const STYLES_PATH = `${Deno.cwd()}/src/styles`;

export const { themes, base16Themes } = getThemes();
export const allThemes = themes.concat(base16Themes);

function getThemes() {
  const themes: string[] = [];
  for (const file of Deno.readDirSync(STYLES_PATH)) {
    if (file.isDirectory) continue;
    themes.push(file.name.replace(".min.css", ""));
  }

  const base16Themes: string[] = [];
  for (const file of Deno.readDirSync(`${STYLES_PATH}/base16`)) {
    base16Themes.push("base16/" + file.name.replace(".min.css", ""));
  }

  return { themes: themes.sort(), base16Themes: base16Themes.sort() };
}

export function getTheme(theme: string) {
  const fileName = `${STYLES_PATH}/${theme}.min.css`;
  return Deno.readTextFileSync(fileName);
}

export function themeName(slug: string): string {
  return slug
    .split("-")
    .map((str) => str[0].toUpperCase() + str.slice(1))
    .join(" ");
}
