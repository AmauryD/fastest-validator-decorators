import type { ValidationError } from "fastest-validator";
import { validate } from "./validate";

/**
 * Validates an instance of a @Schema().
 * Throws the validation errors if errored.
 */
export const validateOrReject = async (obj: InstanceType<any>): Promise<true | ValidationError[]> => {
  const result = await validate(obj);
  if (result !== true) {
    throw result;
  }
  return true;
};