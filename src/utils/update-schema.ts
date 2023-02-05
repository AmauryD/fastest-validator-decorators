import type { Class } from "type-fest";
import { SCHEMA_KEY } from "../constants.js";

export function updateSchema (target: Class<any>, key: string | symbol, options: any): void {
  const s = Reflect.getOwnMetadata(SCHEMA_KEY, target) ?? {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
}