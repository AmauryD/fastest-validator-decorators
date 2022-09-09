import { SCHEMA_KEY } from "../constants";

export function updateSchema (target: any, key: string | symbol, options: any): void {
  const s = Reflect.getOwnMetadata(SCHEMA_KEY, target) ?? {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
}