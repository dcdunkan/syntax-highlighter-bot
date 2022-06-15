import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const autoHighlight = new Composer<Context>();

autoHighlight.command(["noautohl", "toggle_auto_hl"], async (ctx) => {
  ctx.session.auto_highlighting = !ctx.session.auto_highlighting;
  await ctx.reply(
    ctx.t(
      `auto-highlighting.${
        ctx.session.auto_highlighting ? "enabled" : "disabled"
      }`,
    ),
  );
});
