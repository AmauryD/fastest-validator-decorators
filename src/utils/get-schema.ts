import { SCHEMA_KEY } from "../constants";
import { getPrototypeChain } from "./get-prototype-chain";

export function getSchema (target: { prototype: any }): any {
  const chain = getPrototypeChain(target.prototype);
  const schema = {};
  Object.assign(schema, ...chain.map(c => Reflect.getOwnMetadata(SCHEMA_KEY, c)));
  return schema;
}