import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";
import { supportedFonts } from "../../core/helpers.ts";

export const font = new Composer<Context>();

const fontsList = supportedFonts
  .map((font) => `- <code>${font}</code>`)
  .join("\n");

font.command("font", async (ctx) => {
  const arg = ctx.match as string;

  if (!arg) {
    return await ctx.reply(ctx.t("font.info", {
      fonts: fontsList,
      font: ctx.session.font,
    }));
  }

  if (!supportedFonts.includes(arg)) {
    return await ctx.reply(ctx.t("font.invalid"));
  }

  if (arg === ctx.session.font) {
    return await ctx.reply(ctx.t("font.already", { font: arg }));
  }

  ctx.session.font = arg;
  await ctx.reply(ctx.t("font.set", { font: ctx.session.font }));
});
