import { Fluent } from "../../deps.ts";

const LOCALES_PATH = `${Deno.cwd()}/locales/`;
export const fluent = new Fluent();

await fluent.addTranslation({
  locales: "en",
  filePath: LOCALES_PATH + "en.ftl",
});
