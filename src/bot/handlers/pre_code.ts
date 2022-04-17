import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";
import { supportsLanguage } from "../../core/highlight.ts";
import { getScreenshotBuffer } from "../../core/puppeteer.ts";
import {
  bytes,
  InlineKeyboard,
  InputFile,
  InputFileProxy,
  MessageEntity,
} from "../../deps.ts";

type GrammyTypes = InputFileProxy<InputFile>;
type InputMediaPhoto = GrammyTypes["InputMediaPhoto"];
type InputMediaDocument = GrammyTypes["InputMediaDocument"];

export const preCode = new Composer<Context>();

preCode.on(["msg::code", "msg::pre"], async (ctx) => {
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
    // If it's the only code entity.
    // Solution for @darvesh's test snippet: `console.log("grammY");`
    if (entity.offset === 0 && entity.length === text.length) return true;
    const code = text.slice(entity.offset, entity.offset + entity.length);
    return code.trim().includes("\n");
  });

  if (!codeEntities.length) return;

  await sendImages(ctx, text, codeEntities);
});

export async function sendImages(
  ctx: Context,
  text: string,
  entities: MessageEntity[],
) {
  const images: Array<InputMediaPhoto | InputMediaDocument> = [];
  const doc = ctx.session.as_document;
  let totalSize = 0;

  for (const entity of entities) {
    let expecting: string;

    const lastText = text
      .substring(0, entity.offset).trim().split(/[.,\s]+/).pop();

    if ("language" in entity && entity.language) expecting = entity.language;
    else if (lastText) expecting = lastText;
    else expecting = "";

    const language = supportsLanguage(expecting) ? expecting : undefined;

    const code = text.slice(entity.offset, entity.offset + entity.length);

    const image = await getScreenshotBuffer(
      code,
      ctx.session.theme,
      ctx.session.font,
      language,
    );

    if (!image) continue;
    totalSize += image.length;
    images.push({
      type: doc ? "document" : "photo",
      media: new InputFile(image, `hl-${Date.now()}-${ctx.chat?.id}.png`),
    });
  }

  if (!images.length) return;

  // Single
  if (images.length === 1) {
    ctx.session.count++;
    return await ctx[
      doc ? "replyWithDocument" : "replyWithPhoto"
    ](images[0].media, {
      reply_to_message_id: ctx.message?.message_id,
      reply_markup: new InlineKeyboard().text(
        `Remove (only ${ctx.from?.first_name} can)`,
        `remove_${ctx.from?.id}`,
      ),
    });
  }

  // Single Media group (upto 10 images)
  if (images.length <= 10) {
    await ctx.replyWithChatAction(doc ? "upload_document" : "upload_photo");

    const imageGroup = await ctx.replyWithMediaGroup(images, {
      reply_to_message_id: ctx.message?.message_id,
    });

    ctx.session.count += images.length;

    const messageIds = imageGroup.map((image) => image.message_id).join(".");

    return await ctx.reply(
      `<code>${images.length} photos${
        doc ? `, ${bytes(totalSize)}` : ""
      }</code>`,
      {
        reply_markup: new InlineKeyboard().text(
          `Remove (only ${ctx.from?.first_name} can)`,
          `remove_${ctx.from?.id}_${messageIds}`,
        ),
      },
    );
  }

  // Split and send media groups.
  const PER_CHUNK = 5;
  const totalAlbums = Math.ceil(images.length / PER_CHUNK);
  for (let i = 0; i < totalAlbums; i++) {
    const chunk = images.slice(i * PER_CHUNK, (i + 1) * PER_CHUNK);

    await ctx.replyWithChatAction(doc ? "upload_document" : "upload_photo");

    const imageGroup = await ctx.replyWithMediaGroup(chunk, {
      reply_to_message_id: ctx.message?.message_id,
    });

    ctx.session.count += chunk.length;

    const messageIds = imageGroup.map((image) => image.message_id).join(".");

    await ctx.reply(
      i + 1 === totalAlbums
        ? `<code>${images.length} photos${
          doc ? `, ${bytes(totalSize)}` : ""
        }</code>`
        : "====================",
      {
        reply_markup: new InlineKeyboard().text(
          `Remove (only ${ctx.from?.first_name} can)`,
          `remove_${ctx.from?.id}_${messageIds}`,
        ),
      },
    );
  }
}
