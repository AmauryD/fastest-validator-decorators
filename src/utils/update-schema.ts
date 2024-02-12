import type { Class } from "type-fest";
import { SCHEMA_KEY } from "../constants.js";
import type { RuleMulti } from "fastest-validator";

export function updateSchema (target: Class<any>, key: string | symbol, options: any): void {
  const s = Reflect.getOwnMetadata(SCHEMA_KEY, target) ?? {};

  const alreadyHasDecorator = s[key] !== undefined;

  if (alreadyHasDecorator) {
    const isAlreadyMulti = s[key].type === "multi";
    if (isAlreadyMulti) {
      s[key].rules.push(options);
      return Reflect.defineMetadata(SCHEMA_KEY, s, target);
    }

    s[key] = {
      type: "multi",
      rules: [s[key], options],
    } satisfies RuleMulti;
    
    return Reflect.defineMetadata(SCHEMA_KEY, s, target);
  }


  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
}