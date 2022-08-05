import { I18n } from "../../deps.ts";

export const i18n = new I18n({
  defaultLocale: "en",
});

await i18n.loadLocalesDir("locales");
