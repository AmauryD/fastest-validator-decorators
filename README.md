[![npm](https://img.shields.io/npm/v/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-decorators) 
[![npm](https://img.shields.io/npm/dm/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-decorators) 
[![GitHub issues](https://img.shields.io/github/issues/tobydeh/fastest-validator-decorators.svg)](https://github.com/tobydeh/fastest-validator-decorators/issues) 
[![GitHub license](https://img.shields.io/github/license/tobydeh/fastest-validator-decorators.svg)](https://github.com/tobydeh/fastest-validator-decorators/blob/master/LICENSE)

# Fastest Validator Decorators
> Decorators for [fastest-validator](https://github.com/icebob/fastest-validator#readme)

## Example usage

```js
import {
  Schema,
  Array,
  Nested,
  UUID,
  Enum,
  Email,
  Number,
  getSchema,
  validate,
  validateOrReject
} from "fastest-validator-decorators";

@Schema(true)
class Entity1 {
  @Array({ items: "string"})
  prop1: string[];
}

@Schema()
class Entity2 {
  @UUID()
  prop1: string;

  @Enum({ values : ["one", "two"] })
  prop2: "one" | "two";

  @Email()
  prop3;

  @Number({ positive: true })
  prop4: number;

  @Nested()
  prop5: Entity1;
}

const schema = getSchema(Entity2); // get the fastest-validator schema
{
  $$strict: false,
  prop1: { type: "uuid" },
  prop2: { type: "enum", values: ["one", "two"] },
  prop3: { type: "email" },
  prop4: { type: "number", positive: true, convert: true },
  prop5: { type: "object", strict: true, props: {
    prop1: { type: "array", items: "string" }
  }}
}

const entity = new Entity2();
entity.prop1 = "thiswillfail";
entity.prop2 = "one";
entity.prop3 = "some@email.com";
entity.prop4 = -10;
entity.prop5 = new Entity1();

const result = validate(entity); // returns true or fastest-validator errors
const result = await validateOrReject(entity); // returns true or throws fastest-validator errors
```

The `SchemaBase` utility class reduces the verbosity of instantiating new objects by calling Object.assign in the constructor and provides a validate() method.

:mega: This `SchemaBase` approach will probably be removed in 2.x release. See [#27](https://github.com/AmauryD/fastest-validator-decorators/issues/27).

```js
@Schema()
class Entity extends SchemaBase {
  @Email()
  email: string;
}

const entity = new Entity({ email: 'some@email.com' });
const result = entity.validate();
```

## Setup

Install the package
```
npm install --save fastest-validator-decorators
```

Add the following to your tsconfig.json
```
"experimentalDecorators": true
"emitDecoratorMetadata": true
```

## Available decorators

All decorators accept an object of options that apply to the type being used, for a full list of options please refer to the fastest-validator [documentation](https://www.npmjs.com/package/fastest-validator).

**@Schema(strict=false, messages={})** - Schema decorator. 
**@Schema({ strict = false, async = false }, messages={})** - Schema decorator. 

**@Field({})** - Generic decorator, no default properties set. Will apply all options to the schema.

[**@String({})**](https://github.com/icebob/fastest-validator#string) - Applies { type: "string", empty: false }

[**@Boolean({})**](https://github.com/icebob/fastest-validator#boolean) - Applies { type: "boolean" }

[**@Number({})**](https://github.com/icebob/fastest-validator#number) - Applies { type: "number", convert: true }

[**@UUID({})**](https://github.com/icebob/fastest-validator#uuid) - Applies { type: "uuid" }

[**@ObjectId({})**](https://github.com/icebob/fastest-validator#objectid) - Applies { type: "objectid" }

[**@Email({})**](https://github.com/icebob/fastest-validator#email) - Applies { type: "email" }

[**@Date({})**](https://github.com/icebob/fastest-validator#date) - Applies { type: "date" }

[**@Enum({})**](https://github.com/icebob/fastest-validator#enum) - Applies { type: "enum" }

[**@Array({})**](https://github.com/icebob/fastest-validator#array) - Applies { type: "array" }

[**@Equal({})**](https://github.com/icebob/fastest-validator#equal) - Applies { type: "equal" }

[**@Instance({})**](https://github.com/icebob/fastest-validator#class) - Applies { type: "class" }

[**@Currency({})**](https://github.com/icebob/fastest-validator#currency) - Applies { type: "currency" }

[**@Func({})**](https://github.com/icebob/fastest-validator#function) - Applies { type: "function" }

[**@Luhn({})**](https://github.com/icebob/fastest-validator#luhn) - Applies { type: "luhn" }

[**@Mac({})**](https://github.com/icebob/fastest-validator#mac) - Applies { type: "mac" }

[**@Url({})**](https://github.com/icebob/fastest-validator#url) - Applies { type: "url" }

[**@Any({})**](https://github.com/icebob/fastest-validator#any) - Applies { type: "any" }

**@Nested({})** - Applies { type: "object", props: {} } (The props are gathered from the nested schema)

[**@Custom({})**](https://github.com/icebob/fastest-validator#custom-validator) - Applies { type: "custom" }

```ts
@Custom({
  check (value: number, errors: {type: string, actual: number}[]){
    if (value % 2 !== 0) {
      errors.push({ type: "even", actual : value });
    }
    return value;
  }
})
```

## Async support

In order to a schema to be async , you must add the `async: true` to `SchemaOptions`.

:warning: Be carefull, when enabling async option, the return of the validate function becomes a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```ts
@Schema({
  async: true,
  strict: true
})
class User {
  @Custom({
    async check (value: string, errors: {type: string, actual: string}[]) {
      const isUserInDB = await db.checkUserName(value);
      if (isUserInDB) {
        errors.push({ type: "unique", actual : value });
      }
      return value;
    },
  })
  username!: string;
}

const user = new User();
user.username = "James Bond";
const result = await validate(user);
```

## Available methods

**getSchema()** - Returns the fastest-validator schema for a given class

**validate()** - Returns true or fastest-validator errors for a given instance

**validateOrReject()** - Returns true or throws fastest-validator errors for a given instance

## License
Licensed under the MIT license.
