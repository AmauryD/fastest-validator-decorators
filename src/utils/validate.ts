import type { ValidationError } from "fastest-validator";
import { COMPILE_KEY } from "../constants";

/**
 * Validates an instance of a @Schema().
 */
export const validate = (obj: InstanceType<any>): true | ValidationError[] | Promise<true | ValidationError[]> => {
  const validate = Reflect.getOwnMetadata(COMPILE_KEY, obj.constructor);
  if (!validate) {
    throw new Error("Obj is missing complied validation method");
  }
  return validate(obj);
};
  