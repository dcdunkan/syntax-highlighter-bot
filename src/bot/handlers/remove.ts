import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const remove = new Composer<Context>();

remove.callbackQuery(/^remove_(\d+)(?:_([\d.]+))?$/, async (ctx) => {
  if (!ctx.match) return;

  // Single image message.
  if (!ctx.match[2]) {
    await ctx.answerCallbackQuery("🗑 Photo removed.");
    return await ctx.deleteMessage();
  }

  const authorId = parseInt(ctx.match[1]);
  const havePermission = await checkPermission(ctx, authorId);
  if (!havePermission) {
    return await ctx.answerCallbackQuery({
      text:
        "⚒ Sorry, only the original author and administrators of this chat are allowed to remove messages!",
      show_alert: true,
    });
  }

  // Media group messages.
  ctx.match[2].split(".").forEach(async (messageId) => {
    await ctx.api.deleteMessage(ctx.chat?.id!, parseInt(messageId));
  });

  await ctx.answerCallbackQuery("🗑 Photos removed.");
  await ctx.deleteMessage();
});

async function checkPermission(ctx: Context, authorId: number) {
  if (ctx.chat?.type === "private") return true;
  const requestedBy = ctx.callbackQuery?.from.id!;

  if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    const admins = await ctx.getChatAdministrators();
    const adminIds = admins.map((admin) => admin.user.id);
    // If the removal was requested by the original author or admins.
    if (requestedBy === authorId || adminIds.includes(requestedBy)) {
      return true;
    }
  }

  return false;
}
