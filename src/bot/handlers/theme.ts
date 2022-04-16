import { allThemes } from "../../core/themes.ts";
import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const theme = new Composer<Context>();

theme.command("theme", async (ctx) => {
  const arg = (ctx.match as string).toLowerCase();

  if (!arg) {
    return await ctx.reply(ctx.t("theme.info", { theme: ctx.session.theme }));
  }

  if (!allThemes.includes(arg)) {
    return await ctx.reply(ctx.t("theme.invalid"));
  }

  if (arg === ctx.session.theme) {
    return await ctx.reply(ctx.t("theme.already", { theme: arg }));
  }

  ctx.session.theme = arg;
  await ctx.reply(ctx.t("theme.set", { theme: ctx.session.theme }));
});
