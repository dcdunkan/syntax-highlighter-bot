import { Migrations } from "../../deps.ts";
import { isSupportedFont } from "../../core/helpers.ts";

// From v0.3.0 to ...
interface SessionData1 {
  font: string;
  theme: string;
  as_document: boolean;
  count: number;
  auto_highlighting: boolean;
}

export const migrations: Migrations = {
  1: fixFontName,
};

// We restricted fonts in v0.5.0 (Deno Deploy edition).
// And also changed "JetBrains Mono" to "JetBrains Mono NL".
function fixFontName(old: SessionData1): SessionData1 {
  if (!isSupportedFont(old.font)) {
    old.font = "JetBrains Mono NL";
  }
  return old;
}
