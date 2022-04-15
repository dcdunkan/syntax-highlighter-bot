import { Composer } from "../../deps.ts";
import { Context } from "../helpers/context.ts";

export const font = new Composer<Context>();

const fontsList = `- <code>Anonymous Pro</code>
- <code>Azeret Mono</code>
- <code>B612 Mono</code>
- <code>Courier Prime</code>
- <code>Cousine</code>
- <code>Cutive Mono</code>
- <code>DM Mono</code>
- <code>Fira Code</code>
- <code>Fira Mono</code>
- <code>IBM Plex Mono</code>
- <code>Inconsolata</code>
- <code>JetBrains Mono</code>
- <code>Nanum Gothic</code>
- <code>Noto Sans Mono</code>
- <code>Nova Mono</code>
- <code>Overpass Mono</code>
- <code>Oxygen Mono</code>
- <code>PT Mono</code>
- <code>Red Hat Mono</code>
- <code>Roboto Mono</code>
- <code>Share Tech Mono</code>
- <code>Source Code Pro</code>
- <code>Space Mono</code>
- <code>Syne Mono</code>
- <code>Ubuntu Mono</code>
- <code>VT323</code>
- <code>Xanh Mono</code>`;

const fonts = [
  "Anonymous Pro",
  "Azeret Mono",
  "B612 Mono",
  "Courier Prime",
  "Cousine",
  "Cutive Mono",
  "DM Mono",
  "Fira Code",
  "Fira Mono",
  "IBM Plex Mono",
  "Inconsolata",
  "JetBrains Mono",
  "Nanum Gothic",
  "Noto Sans Mono",
  "Nova Mono",
  "Overpass Mono",
  "Oxygen Mono",
  "PT Mono",
  "Red Hat Mono",
  "Roboto Mono",
  "Share Tech Mono",
  "Source Code Pro",
  "Space Mono",
  "Syne Mono",
  "Ubuntu Mono",
  "VT323",
  "Xanh Mono",
];

font.command("font", async (ctx) => {
  const arg = ctx.match as string;

  if (!arg) {
    return await ctx.reply(ctx.t("font.info", {
      fonts: fontsList,
      font: ctx.session.font,
    }));
  }

  if (!fonts.includes(arg)) {
    return await ctx.reply(ctx.t("font.invalid"));
  }

  if (arg === ctx.session.font) {
    return await ctx.reply(ctx.t("font.already", { font: arg }));
  }

  ctx.session.font = arg;
  await ctx.reply(ctx.t("font.set", { font: ctx.session.font }));
});
