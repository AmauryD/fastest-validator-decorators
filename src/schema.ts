import type { ValidationRule, ValidationSchema, ValidatorConstructorOptions } from "fastest-validator";
import { getSchema } from "./utils/get-schema.js";
import { updateSchema } from "./utils/update-schema.js";
import FastestValidator from "fastest-validator";
import { COMPILE_KEY } from "./constants.js";
import type { Constructor } from "type-fest";

export type SchemaOptions<T> = {
  async?: ValidationSchema<T>["$$async"],
  strict?: ValidationSchema<T>["$$strict"],
  [key: string]: ValidationRule | undefined | any
};

export function Schema<T> (schemaOptions?: SchemaOptions<T>, validatorOptions : ValidatorConstructorOptions = {}): any {
  return function _Schema<T extends Constructor<any>> (target: T): T {
    updateSchema(target.prototype, "$$strict", schemaOptions?.strict ?? false);
    if (schemaOptions?.async !== undefined) {
      updateSchema(target.prototype, "$$async", schemaOptions.async);
    }

    if (schemaOptions) {
      for (const element of Object.keys(schemaOptions).filter((key) => key !== "async" && key !== "strict")) {
        updateSchema(target.prototype, element, schemaOptions[element as keyof SchemaOptions<T>]);
      }
    }
    
    const s = getSchema(target);
    
    // enforce useNewCustomCheckerFunction to true
    const v = new FastestValidator({ ...validatorOptions, useNewCustomCheckerFunction: true });
  
    /**
       * Make a copy of the schema, in order to keep the original from being overriden or deleted by fastest-validator
       * $$async key is removed from schema object at compile()
       * https://github.com/icebob/fastest-validator/blob/a746f9311d3ebeda986e4896d39619bfc925ce65/lib/validator.js#L176
       */
    Reflect.defineMetadata(COMPILE_KEY, v.compile({...s}), target);
      
  
    return target;
  };
}