import { cleanEnv, config, str } from "../deps.ts";

export default cleanEnv(await config(), {
  BOT_TOKEN: str(),
  DETA_KEY: str(),
});
