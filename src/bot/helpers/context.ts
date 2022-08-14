import { SessionData } from "./session.ts";
import { BaseContext, I18nFlavor, SessionFlavor } from "../../deps.ts";

export type Context =
  & BaseContext
  & SessionFlavor<SessionData>
  & I18nFlavor;
