import { bot } from "./src/bot/bot.ts";
import { run } from "https://deno.land/x/grammy_runner@v1.0.3/mod.ts";

await bot.init();
run(bot);
console.log(`${bot.botInfo.username} started`);
