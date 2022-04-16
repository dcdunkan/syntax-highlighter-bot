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

preCode.on("msg::pre", async (ctx) => {
  const text = ctx.message?.text ?? ctx.message?.caption;
  const entities = ctx.message?.entities ?? ctx.message?.caption_entities;

  if (!entities || !text) return;

  const images: Array<InputMediaPhoto | InputMediaDocument> = [];
  const preEntities = entities.filter((preEntity) =>
    preEntity.type === "pre"
  ) as MessageEntity.PreMessageEntity[];
  const doc = ctx.session.as_document;
  let totalSize = 0;

  for (const entity of preEntities) {
    // Expecting any of the template text message:
    // (...blah blah) {language *code* || filename *code* || *code*} (blah blah continues...)
    const expectingLanguage = entity.language ?? text
      .substring(0, entity.offset) // Get the text till the beginning of the code.
      .trim()
      .split(/[.,\s]+/) // Split on dots, commas, and white spaces.
      .pop() ??
      ""; // Get the last one -- it can be a filename, like 'index.ts' or a language (maybe extension?) like 'ts' | 'typescript'.

    const language = supportsLanguage(expectingLanguage)
      ? expectingLanguage
      : undefined;

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

  if (images.length === 0) return;

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
});
