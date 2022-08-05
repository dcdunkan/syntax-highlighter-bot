// src/core
import { PublicApi } from "./types.ts";
import hljs from "https://unpkg.com/@highlightjs/cdn-assets@11.5.1/es/highlight.min.js";
export default hljs as PublicApi;
export { parse as parseCSS } from "https://deno.land/x/css@0.3.0/mod.ts";
export {
  DOMParser,
  HTMLElement,
  HTMLTableCellElement,
} from "https://esm.sh/linkedom@0.14.12";
export { createSvg2png, initialize } from "https://esm.sh/svg2png-wasm@1.3.4";

// src/bot
export { cleanEnv, str } from "https://deno.land/x/envalid@v0.0.3/mod.ts";
export { config } from "https://deno.land/std@0.151.0/dotenv/mod.ts";
export { resolve } from "https://deno.land/std@0.151.0/path/mod.ts";

export {
  Bot,
  Composer,
  Context as BaseContext,
  GrammyError,
  HttpError,
  InlineKeyboard,
  InputFile,
  session,
  type SessionFlavor,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.10.1/mod.ts";
export {
  type InputFileProxy,
  type Message,
  type MessageEntity,
} from "https://deno.land/x/grammy@v1.10.1/types.ts";

export { DetaAdapter } from "https://deno.land/x/grammy_storages@v2.0.0/deta/src/mod.ts";

export {
  I18n,
  type I18nFlavor,
} from "https://ghc.deno.dev/dcdunkan/i18n-2.0@2.0/src/mod.ts";

export { prettyBytes as bytes } from "https://deno.land/std@0.151.0/fmt/bytes.ts";
export { serve } from "https://deno.land/std@0.151.0/http/server.ts";
