import env from "../env.ts";
import { DetaAdapter, enhanceStorage } from "../../deps.ts";
import { migrations } from "./migrations.ts";

export interface SessionData {
  font: string;
  theme: string;
  as_document: boolean;
  count: number;
  auto_highlighting: boolean;
}

export function initial(): SessionData {
  return {
    font: "JetBrains Mono NL",
    theme: "atom-one-dark",
    as_document: false,
    count: 0,
    auto_highlighting: true,
  };
}

const storage = new DetaAdapter({
  baseName: "session",
  projectKey: env.DETA_KEY,
});

export const enhanced = enhanceStorage({ storage, migrations });
