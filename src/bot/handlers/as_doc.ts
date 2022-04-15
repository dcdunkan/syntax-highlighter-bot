import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const asDocument = new Composer<Context>();

asDocument.command(["as_doc", "as_document"], async (ctx) => {
  ctx.session.as_document = !ctx.session.as_document;
  await ctx.reply(
    ctx.t(`as-doc.${ctx.session.as_document ? "enabled" : "disabled"}`),
  );
});
