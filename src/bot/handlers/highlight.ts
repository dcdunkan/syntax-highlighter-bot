import { Composer, MessageEntity } from "../../deps.ts";
import { Context } from "../helpers/context.ts";
import { sendImages } from "./pre_code.ts";

export const highlight = new Composer<Context>();

highlight.command(["highlight", "hl"], async (ctx) => {
  if (!ctx.msg.reply_to_message) {
    return await ctx.reply(ctx.t("highlight.reply-to-message"));
  }

  const text = ctx.msg.reply_to_message.text;
  if (!text) return await ctx.reply(ctx.t("highlight.reply-to-message"));

  let entities: MessageEntity[];
  if (ctx.msg.reply_to_message.entities) {
    entities = ctx.msg.reply_to_message.entities;
  } else if (ctx.msg.reply_to_message.caption_entities) {
    entities = ctx.msg.reply_to_message.caption_entities;
  } else entities = [];

  entities = entities.filter((entity) => {
    if (entity.type === "pre" || entity.type === "code") return true;
  });

  const args = ctx.match.split(/,\s+/g);

  if (ctx.match) {
    if (args[0] === "0" || args[0] === "f" || args[0] === "full") {
      entities = [{ type: "pre", offset: 0, length: text.length }];
    }
    const entities_: MessageEntity[] = [];
    for (const arg of args) {
      if (isNaN(parseInt(arg))) continue;
      const index = parseInt(arg) - 1;
      const entity = entities.at(index);
      if (entity) entities_.push(entity);
    }
    if (entities_.length) return await sendImages(ctx, text, entities_);
  }

  entities = entities.filter((entity) => {
    if (entity.type === "pre") return true;
    const code = text.slice(entity.offset, entity.offset + entity.length);
    return code.trim().includes("\n");
  });

  await sendImages(
    ctx,
    text,
    entities.length
      ? entities
      : [{ type: "pre", offset: 0, length: text.length }],
  );
});
