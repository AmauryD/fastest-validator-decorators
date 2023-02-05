import type { ValidationError } from "fastest-validator";
import { validate } from "./validate.js";

/**
 * Validates an instance of a @Schema().
 * Throws the validation errors if errored.
 */
export const validateOrReject = async (schemaInstance: InstanceType<any>): Promise<true | ValidationError[]> => {
  const result = await validate(schemaInstance);
  if (result !== true) {
    throw result;
  }
  return true;
};