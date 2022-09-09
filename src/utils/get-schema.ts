import type { ValidationSchema } from "fastest-validator";
import type { Class } from "type-fest";
import { SCHEMA_KEY } from "../constants";
import { getPrototypeChain } from "./get-prototype-chain";

export function getSchema (klass: Class<any>): ValidationSchema {
  const chain = getPrototypeChain(klass.prototype);
  const schema = {};
  Object.assign(schema, ...chain.map(c => Reflect.getOwnMetadata(SCHEMA_KEY, c)));
  return schema;
}