import "reflect-metadata";
import type { RuleAny, RuleArray, RuleBoolean, RuleClass, RuleCurrency, RuleCustom, RuleDate, RuleEmail, RuleEnum, RuleEqual, RuleFunction, RuleLuhn, RuleMac, RuleNumber, RuleObject, RuleObjectID, RuleString, RuleURL, RuleUUID, ValidationError, ValidationSchema, ValidatorConstructorOptions } from "fastest-validator";
import FastestValidator from "fastest-validator";

export const SCHEMA_KEY = Symbol("propertyMetadata");
export const COMPILE_KEY = Symbol("compileKey");


export interface SchemaOptions  {
  async?: ValidationSchema["$$async"],
  strict?: ValidationSchema["$$strict"]
}

/**
 * Walks the prototype chain of an object
 * Used for schema inheritance detection
 * Maybe find a way to do the same thing with reflect metadata ?
 */
function getPrototypeChain (object: any): any[] {
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

/**
 * Validates an instance of a @Schema().
 */
export const validate = (obj: { constructor: any }): true | ValidationError[] | Promise<true | ValidationError[]> => {
  const validate = Reflect.getOwnMetadata(COMPILE_KEY, obj.constructor);
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
  const chain = getPrototypeChain(target.prototype);
  const schema = {};
  Object.assign(schema, ...chain.map(c => Reflect.getOwnMetadata(SCHEMA_KEY, c)));
  return schema;
}

const updateSchema = (target: any, key: string | symbol, options: any): void => {
  const s = Reflect.getOwnMetadata(SCHEMA_KEY, target) ?? {};
  s[key] = options;
  Reflect.defineMetadata(SCHEMA_KEY, s, target);
};

/**
 * Creates a Schema for fastest-validator
 * @param schemaOptions The options (async, strict)
 * @param messages
 * @returns 
 */
export function Schema (schemaOptions?: SchemaOptions, options : ValidatorConstructorOptions = {}): any {
  return function _Schema<T extends { new (...args: any[]) }>(target: T): T {
    updateSchema(target.prototype, "$$strict", schemaOptions?.strict ?? false);
    if (schemaOptions?.async !== undefined) {
      updateSchema(target.prototype, "$$async", schemaOptions.async);
    }
  
    const s = getSchema(target);
    // enforce useNewCustomCheckerFunction to true
    const v = new FastestValidator({ ...options, useNewCustomCheckerFunction: true });

    /**
     * Make a copy of the schema, in order to keep the original from being overriden or deleted by fastest-validator
     * $$async key is removed from schema object at compile()
     * https://github.com/icebob/fastest-validator/blob/a746f9311d3ebeda986e4896d39619bfc925ce65/lib/validator.js#L176
     */
    Reflect.defineMetadata(COMPILE_KEY, v.compile({...s}), target);
    

    return target;
  };
}

export const decoratorFactory = <T extends RuleCustom>(mandatory: Partial<T> = {}, defaults: Partial<T> = {}) => {
  return function (options: Partial<T> = {}): any {
    return (target: any, key: string | symbol): any => {
      updateSchema(target, key, { ...defaults, ...options, ...mandatory });
    };
  };
};

export const Field = decoratorFactory<RuleCustom>({},{ type : "any" });
export const String = decoratorFactory<RuleString>({ type: "string" }, { empty: false });
export const Boolean = decoratorFactory<RuleBoolean>({ type: "boolean" });
export const Number = decoratorFactory<RuleNumber>({ type: "number" }, { convert: true });
export const UUID = decoratorFactory<RuleUUID>({ type: "uuid" });
export const ObjectId = decoratorFactory<RuleObjectID>({ type: "objectID" });
export const Email = decoratorFactory<RuleEmail>({ type: "email" });
export const Date = decoratorFactory<RuleDate>({ type: "date" });
export const Enum = decoratorFactory<RuleEnum>({ type: "enum" }, { values: [] });
export const Array = decoratorFactory<RuleArray>({ type: "array" });
export const Any = decoratorFactory<RuleAny>({ type: "any" });
export const Equal = decoratorFactory<RuleEqual>({ type: "equal" });
export const Instance = decoratorFactory<RuleClass>({ type: "class" }, { });
export const Currency = decoratorFactory<RuleCurrency>({ type: "currency" }, { currencySymbol: "$" });
export const Func = decoratorFactory<RuleFunction>({ type: "function" });
export const Luhn = decoratorFactory<RuleLuhn>({ type: "luhn" });
export const Mac = decoratorFactory<RuleMac>({ type: "mac" });
export const Url = decoratorFactory<RuleURL>({ type: "url" });
export const Custom = decoratorFactory<RuleCustom>({ type: "custom" }, { check (){/**/} });

export function Nested (options: Partial<RuleCustom> = {}): any {
  return (target: any, key: string): any => {
    const t = Reflect.getMetadata("design:type", target, key);
    const props = Object.assign({}, getSchema(t));
    const strict = props.$$strict || false;
    delete props.$$strict;
    // never $$async in nested
    delete props.$$async;
    updateSchema(target, key, { ...options, props, strict, type: "object" });
  };
}
