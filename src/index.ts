import "reflect-metadata";
import FastestValidator, { ValidationError } from "fastest-validator";

export const SCHEMA_KEY = Symbol("propertyMetadata");
export const COMPILE_KEY = Symbol("compileKey");

export const validate = (obj: unknown): true | ValidationError[] => {
  const validate = Reflect.getMetadata(COMPILE_KEY, obj.constructor);
  if (!validate) {
    throw new Error("Obj is missing complied validation method");
  }
  return validate(obj);
};

export const validateOrReject = async (obj: unknown): Promise<true | ValidationError[]> => {
  const result = validate(obj);
  if (result !== true) {
    throw result;
  }
  return true;
};

export function getSchema (target: { prototype: unknown }): any {
  return Reflect.getMetadata(SCHEMA_KEY, target.prototype);
}

const updateSchema = (target: any, key: string | symbol, options: any): void => {
  const s = Reflect.getMetadata(SCHEMA_KEY, target) || {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
};

export function Schema (strict = false, messages = {}): any {
  return function _Schema<T extends {new (...args: any[]): Record<string, unknown>}>(target: T): any  {
    updateSchema(target.prototype, "$$strict", strict);
    const s = Reflect.getMetadata(SCHEMA_KEY, target.prototype) || {};
    const v = new FastestValidator({ messages });
    Reflect.defineMetadata(COMPILE_KEY, v.compile(s), target);
    return class extends target {
      constructor (...args: any[]) {
        super(...args);
        return this;
      }
    };
  };
}

export const decoratorFactory = (mandatory = {}, defaults = {}) => {
  return function (options: any | any[] = {}): any {
    return (target: any, key: string | symbol): any => {
      updateSchema(target, key, { ...defaults, ...options, ...mandatory });
    };
  };
};

export const Field = decoratorFactory({}, { type: "any" });
export const String = decoratorFactory({ type: "string" }, { empty: false });
export const Boolean = decoratorFactory({ type: "boolean" });
export const Number = decoratorFactory({ type: "number" }, { convert: true });
export const UUID = decoratorFactory({ type: "uuid" });
export const ObjectId = decoratorFactory({ type: "objectID" });
export const Email = decoratorFactory({ type: "email" });
export const Date = decoratorFactory({ type: "date" });
export const Enum = decoratorFactory({ type: "enum" }, { values: [] });
export const Array = decoratorFactory({ type: "array" });
export const Any = decoratorFactory({ type: "any" });
export const Equal = decoratorFactory({ type: "equal" });
export const Instance = decoratorFactory({ type: "class" }, { instanceOf: Object });
export const Currency = decoratorFactory({ type: "currency" }, { currencySymbol: "$" });
export const Func = decoratorFactory({ type: "function" });
export const Luhn = decoratorFactory({ type: "luhn" });
export const Mac = decoratorFactory({ type: "mac" });
export const Url = decoratorFactory({ type: "url" });

export function Nested (options: any | any[] = {}): any {
  return (target: any, key: string): any => {
    const t = Reflect.getMetadata("design:type", target, key);
    const props = Object.assign({}, getSchema(t));
    const strict = props.$$strict || false;
    delete props.$$strict;
    updateSchema(target, key, { ...options, props, strict, type: "object" });
  };
}

export class SchemaBase {
  public constructor (obj: Record<string, unknown>) {
    Object.assign(this, obj);
  }

  public validate (): true | ValidationError[] {
    return validate(this);
  }
}
