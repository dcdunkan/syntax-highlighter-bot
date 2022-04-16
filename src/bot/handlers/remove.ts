import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const remove = new Composer<Context>();

remove.callbackQuery(/^remove_(\d+)(?:_([\d.]+))?$/, async (ctx) => {
  if (!ctx.match) return;

  const authorId = parseInt(ctx.match[1]);
  const havePermission = await checkPermission(ctx, authorId);

  if (!havePermission) {
    return await ctx.answerCallbackQuery({
      text: ctx.t("remove.no-permission"),
      show_alert: true,
    });
  }

  // Single image message.
  if (!ctx.match[2]) {
    await ctx.answerCallbackQuery(ctx.t("remove.photo-removed"));
    return await ctx.deleteMessage();
  }

  // Media group messages.
  const messageIds = ctx.match[2].split(".");
  for (const messageId of messageIds) {
    await ctx.api.deleteMessage(ctx.chat?.id!, parseInt(messageId));
  }

  await ctx.answerCallbackQuery(ctx.t("remove.photos-removed"));
  await ctx.deleteMessage();
});

async function checkPermission(ctx: Context, authorId: number) {
  if (ctx.chat?.type === "private") return true;
  const requestedBy = ctx.callbackQuery?.from.id!;

  // GROUPS: Original author
  if (requestedBy === authorId) return true;

  // GROUPS: Admins
  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    const admins = await ctx.getChatAdministrators();
    const adminIds = admins.map((admin) => admin.user.id);
    if (adminIds.includes(requestedBy)) return true;
  }

  return false;
}
