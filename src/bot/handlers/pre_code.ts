import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";
import { MessageEntity } from "../../deps.ts";
import { sendImages } from "../helpers/send_images.ts";

export const preCode = new Composer<Context>();

preCode.filter((ctx) => {
  // For backward compatibility:
  if (ctx.session.auto_highlighting === undefined) {
    ctx.session.auto_highlighting = true;
    return true;
  }
  return ctx.session.auto_highlighting;
})
  .on(["msg::code", "msg::pre"], async (ctx) => {
    let text: string;
    if (ctx.msg.text) text = ctx.msg.text;
    else if (ctx.msg.caption) text = ctx.msg.caption;
    else return;

    let entities: MessageEntity[];
    if (ctx.msg.entities) entities = ctx.msg.entities;
    else if (ctx.msg.caption_entities) entities = ctx.msg.caption_entities;
    else return;

    const codeEntities = entities.filter((entity) => {
      if (entity.type === "pre") return true;
      if (entity.type !== "code") return;
      // If it's the only code entity. Finally, a solution for
      // @darvesh's test snippet: `console.log("grammY");`
      if (entity.offset === 0 && entity.length === text.length) return true;
      const code = text.slice(entity.offset, entity.offset + entity.length);
      return code.trim().includes("\n");
    });

    if (!codeEntities.length) return;

    await sendImages(ctx, text, codeEntities);
  });
