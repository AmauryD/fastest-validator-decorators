/**
 * Walks the prototype chain of an object
 * Used for schema inheritance detection
 * Maybe find a way to do the same thing with reflect metadata ?
 */
export function getPrototypeChain (object: any): any[] {
  let proto = object;
  const protos: unknown[] = [object];
  
  while (proto) {
    proto = Object.getPrototypeOf(proto);
    if (proto) {
      protos.push(proto);
    }
  }
  
  return protos;
}