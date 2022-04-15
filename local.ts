import { bot } from "./src/bot/bot.ts";

bot.start({
  onStart: ({ username }) => console.log(`${username} started`),
});
