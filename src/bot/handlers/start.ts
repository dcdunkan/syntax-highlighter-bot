import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const start = new Composer<Context>();

start.command("start", async (ctx) => {
  await ctx.reply(ctx.t("start"));
});
