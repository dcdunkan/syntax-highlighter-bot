import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const stats = new Composer<Context>();

stats.command("stats", async (ctx) => {
  await ctx.reply(ctx.t("stats", { count: ctx.session.count }));
});
