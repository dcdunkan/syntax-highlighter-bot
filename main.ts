import { serve, webhookCallback } from "./src/deps.ts";
import { bot } from "./src/bot/bot.ts";

const handleUpdate = webhookCallback(bot, "std/http");

await bot.init();

serve(async (req) => {
  const path = new URL(req.url).pathname.slice(1);

  if (req.method === "POST" && path === bot.token) {
    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error(err);
    }
  }

  return Response.redirect(`https://telegram.me/${bot.botInfo.username}`);
});
