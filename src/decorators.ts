import type { RuleCustom, RuleString, RuleBoolean, RuleNumber, RuleUUID, RuleObjectID, RuleEmail, RuleDate, RuleEnum, RuleArray, RuleAny, RuleEqual, RuleClass, RuleCurrency, RuleFunction, RuleLuhn, RuleMac, RuleURL, RuleCustomInline } from "fastest-validator";
import { getSchema } from "./utils/get-schema";
import { updateSchema } from "./utils/update-schema";
import type { Except , HasRequiredKeys , RemoveIndexSignature } from "type-fest";

type RemoveTypeFromRule<T  extends RuleCustom> = Except<T, "type">;
type IsMandatory<T  extends object> =  HasRequiredKeys<RemoveIndexSignature<T>> extends true ? [param: T] : [param?: T];

export const decoratorFactory = <T extends object>(mandatory: Partial<T> = {}) => {
  return function (...options: IsMandatory<T>): any {
    return (target: any, key: string | symbol): any => {
      updateSchema(target, key, { ...options[0], ...mandatory });
    };
  };
};

export const Field = decoratorFactory<RuleCustom>({});
export const String = decoratorFactory<RemoveTypeFromRule<RuleString>>({ type: "string" });
export const Boolean = decoratorFactory<RemoveTypeFromRule<RuleBoolean>>({ type: "boolean" });
export const Number = decoratorFactory<RemoveTypeFromRule<RuleNumber>>({ type: "number" });
export const UUID = decoratorFactory<RemoveTypeFromRule<RuleUUID>>({ type: "uuid" });
export const ObjectId = decoratorFactory<RemoveTypeFromRule<RuleObjectID>>({ type: "objectID" });
export const Email = decoratorFactory<RemoveTypeFromRule<RuleEmail>>({ type: "email" });
export const Date = decoratorFactory<RemoveTypeFromRule<RuleDate>>({ type: "date" });
export const Enum = decoratorFactory<RemoveTypeFromRule<RuleEnum>>({ type: "enum" });
export const Array = decoratorFactory<RemoveTypeFromRule<RuleArray>>({ type: "array" });
export const Any = decoratorFactory<RemoveTypeFromRule<RuleAny>>({ type: "any" });
export const Equal = decoratorFactory<RemoveTypeFromRule<RuleEqual>>({ type: "equal" });
export const Instance = decoratorFactory<RemoveTypeFromRule<RuleClass>>({ type: "class" });
export const Currency = decoratorFactory<RemoveTypeFromRule<RuleCurrency>>({ type: "currency" });
export const Func = decoratorFactory<RemoveTypeFromRule<RuleFunction>>({ type: "function" });
export const Luhn = decoratorFactory<RemoveTypeFromRule<RuleLuhn>>({ type: "luhn" });
export const Mac = decoratorFactory<RemoveTypeFromRule<RuleMac>>({ type: "mac" });
export const Url = decoratorFactory<RemoveTypeFromRule<RuleURL>>({ type: "url" });
export const Custom = decoratorFactory<RemoveTypeFromRule<RuleCustomInline>>({ type: "custom" });
  
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
  