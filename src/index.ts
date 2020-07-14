import "reflect-metadata";
import FastestValidator, { ValidationError } from "fastest-validator";

const SCHEMA_KEY = Symbol("propertyMetadata");

export const validate = (obj: any): true | ValidationError[] => {
  if (!obj._validate) {
    throw new Error("Obj is missing complied validation method");
  }
  const { _validate, _schema, ...data } = obj;
  return _validate(data);
};

export const validateOrReject = async (obj: any): Promise<true | ValidationError[]> => {
  const result = validate(obj);
  if (result !== true) {
    throw result;
  }
  return true;
};

export function getSchema (target: any): any {
  return Reflect.getMetadata(SCHEMA_KEY, target.prototype);
}

const updateSchema = (target: any, key: string | symbol, options: any): void => {
  const s = Reflect.getMetadata(SCHEMA_KEY, target) || {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
};

export function Schema (strict = false, messages = {}): any {
  return function _Schema<T extends {new (...args: any[]): {}}>(target: T): any  {
    updateSchema(target.prototype, "$$strict", strict);
    return class extends target {
      _validate: (obj: object) => true | ValidationError[];
      constructor (...args: any[]) {
        super(...args);
        const s = Reflect.getMetadata(SCHEMA_KEY, this) || {};
        const v = new FastestValidator({ messages });
        this._validate = v.compile(s);
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

export const Field = decoratorFactory({}, {});
export const String = decoratorFactory({ type: "string" }, { empty: false });
export const Boolean = decoratorFactory({ type: "boolean" });
export const Number = decoratorFactory({ type: "number" }, { convert: true });
export const UUID = decoratorFactory({ type: "uuid" });
export const ObjectId = decoratorFactory({ type: "string" }, { pattern: /^[a-f\d]{24}$/i });
export const Email = decoratorFactory({ type: "email" });
export const Date = decoratorFactory({ type: "date" });
export const Enum = decoratorFactory({ type: "enum" });
export const Array = decoratorFactory({ type: "array" });
export const Any = decoratorFactory({ type: "any" });

export function Nested (options: any | any[] = {}): any {
  return (target: any, key: string): any => {
    const t = Reflect.getMetadata("design:type", target, key);
    const props = Object.assign({}, getSchema(t));
    const strict = props.$$strict || false;
    delete props.$$strict;
    updateSchema(target, key, { ...options, props, strict, type: "object" });
  };
}
