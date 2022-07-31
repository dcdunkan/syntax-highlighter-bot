import { Context } from "../helpers/context.ts";
import { supportsLanguage } from "../../core/highlight.ts";
import { getImageBuffer, ImageOptions } from "../../core/render.ts";
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

export async function sendImages(
  ctx: Context,
  text: string,
  entities: MessageEntity[],
  options?: ImageOptions,
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

    const image = await getImageBuffer(
      code,
      ctx.session.theme,
      ctx.session.font,
      12,
      language,
      options,
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
