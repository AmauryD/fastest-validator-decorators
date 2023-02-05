import type { Class } from "type-fest";

/**
 * Walks the prototype chain of an object
 * Used for schema inheritance detection
 * Maybe find a way to do the same thing with reflect metadata ?
 */
export function getPrototypeChain (object: Class<any>): Class<any>[] {
  let proto = object;
  const protos: Class<any>[] = [object];
  
  while (proto) {
    proto = Object.getPrototypeOf(proto);
    if (proto) {
      protos.push(proto);
    }
  }  
  
  return protos;
}