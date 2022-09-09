import type { ValidationSchema, ValidatorConstructorOptions } from "fastest-validator";
import { getSchema } from "./utils/get-schema";
import { updateSchema } from "./utils/update-schema";
import FastestValidator from "fastest-validator";
import { COMPILE_KEY } from "./constants";

export interface SchemaOptions  {
  async?: ValidationSchema["$$async"],
  strict?: ValidationSchema["$$strict"]
}

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