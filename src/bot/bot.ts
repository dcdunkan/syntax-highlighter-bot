import env from "./env.ts";
import { Context } from "./helpers/context.ts";
import { initial, storage } from "./helpers/session.ts";
import { fluent } from "./helpers/fluent.ts";
import { Bot, GrammyError, HttpError, session, useFluent } from "../deps.ts";
import { handlers } from "./handlers/mod.ts";
import { commands, groupAdminCommands } from "./helpers/constants.ts";
export const bot = new Bot<Context>(env.BOT_TOKEN);

bot.use(session({ initial, storage }));

bot.api.config.use((prev, method, payload) =>
  prev(method, { parse_mode: "HTML", ...payload })
);

bot.use(useFluent({ fluent }));

bot.use(handlers);

bot.catch(async ({ ctx, error }) => {
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  if (error instanceof GrammyError) {
    console.error("Error in request:", error.description);
  } else if (error instanceof HttpError) {
    console.error("Could not contact Telegram:", error);
  } else {
    console.error("Unknown error:", error);
  }
});

await bot.api.setMyCommands(commands, { scope: { type: "all_private_chats" } });
await bot.api.setMyCommands(groupAdminCommands, {
  scope: { type: "all_chat_administrators" },
});
