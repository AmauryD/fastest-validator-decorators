import "reflect-metadata";
import type { ValidationError, ValidatorConstructorOptions } from "fastest-validator";
import FastestValidator from "fastest-validator";

export const SCHEMA_KEY = Symbol("propertyMetadata");
export const COMPILE_KEY = Symbol("compileKey");

type StrictMode = boolean | "remove";

export interface SchemaOptions  {
  async?: boolean,
  strict?: StrictMode
}

/**
 * Validates an instance of a @Schema().
 */
export const validate = (obj: { constructor: any }): true | ValidationError[] | Promise<true | ValidationError[]> => {
  const validate = Reflect.getMetadata(COMPILE_KEY, obj.constructor);
  if (!validate) {
    throw new Error("Obj is missing complied validation method");
  }
  return validate(obj);
};

/**
 * Validates an instance of a @Schema().
 * Throws the validation errors if errored.
 */
export const validateOrReject = async (obj: { constructor: any }): Promise<true | ValidationError[]> => {
  const result = await validate(obj);
  if (result !== true) {
    throw result;
  }
  return true;
};

export function getSchema (target: { prototype: any }): any {
  return Reflect.getMetadata(SCHEMA_KEY, target.prototype);
}

const updateSchema = (target: any, key: string | symbol, options: any): void => {
  const s = Reflect.getMetadata(SCHEMA_KEY, target) ?? {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
};

/**
 * Creates a Schema for fastest-validator
 * @param schemaOptions The options (prefixed with $$)
 * @param fastestValidatorOptions Fastest validator options
 * @returns 
 */
export function Schema (schemaOptions?: StrictMode | SchemaOptions, fastestValidatorOptions: ValidatorConstructorOptions = {}): any {
  return function _Schema<T extends {new (): any}>(target: T): T {
    /**
     * Support old way of assign schema options
     */
    schemaOptions = typeof schemaOptions === "boolean" ||  typeof schemaOptions === "string" ? {
      strict : schemaOptions
    }: schemaOptions;

    updateSchema(target.prototype, "$$strict", schemaOptions?.strict ?? false);
    if (schemaOptions?.async !== undefined) {
      updateSchema(target.prototype, "$$async", schemaOptions.async);
    }
  
    const s = getSchema(target) || {};
    const v = new FastestValidator({ useNewCustomCheckerFunction: true, ...fastestValidatorOptions });

    /**
     * Make a copy of the schema, in order to keep the original from being overriden or deleted by fastest-validator
     */
    Reflect.defineMetadata(COMPILE_KEY, v.compile({...s}), target);
    return target;
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
export const Custom = decoratorFactory({ type: "custom" }, { check (){/**/} });

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
  public constructor ();
  public constructor (obj: Record<string, unknown>);
  public constructor (obj?: Record<string, unknown>) {
    Object.assign(this, obj);
  }

  public validate (): true | ValidationError[] | Promise<true | ValidationError[]> {
    return validate(this);
  }
}
