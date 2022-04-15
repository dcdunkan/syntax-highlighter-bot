import { SessionData } from "./session.ts";
import { BaseContext, FluentContextFlavor, SessionFlavor } from "../../deps.ts";

export type Context =
  & BaseContext
  & SessionFlavor<SessionData>
  & FluentContextFlavor;
