import type { RuleCustom, RuleString, RuleBoolean, RuleNumber, RuleUUID, RuleObjectID, RuleEmail, RuleDate, RuleEnum, RuleArray, RuleAny, RuleEqual, RuleClass, RuleCurrency, RuleFunction, RuleLuhn, RuleMac, RuleURL, RuleCustomInline } from "fastest-validator";
import { getSchema } from "./utils/get-schema";
import { updateSchema } from "./utils/update-schema";

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
export const Custom = decoratorFactory<RuleCustomInline>({ type: "custom" }, { check (){/**/} });
  
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
  