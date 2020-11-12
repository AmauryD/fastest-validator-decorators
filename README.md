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
  prop3: string;

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
entity.prop3 = "some@email.com"
entity.prop4 = -10;
entity.prop5 = new Entity1();

const result = validate(entity); // returns true or fastest-validator errors
const result = await validateOrReject(entity); // returns true or throws fastest-validator errors
```

There is a SchemaBase utility class that reduces the verbosity of instantiating new objects by calling Object.assign in the constructor.

```js
@Schema()
const Entity extends SchemaBase {
  @Email()
  email: string;
}

const entity = new Entity({ email: 'some@email.com' })
const result = validate(entity);
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

**@Field({})** - Generic decorator, no default properties set. Will apply all options to the schema.

**@String({})** - Applies { type: "string", empty: false }

**@Boolean({})** - Applies { type: "boolean" }

**@Number({})** - Applies { type: "number", convert: true }

**@UUID({})** - Applies { type: "uuid" }

**@ObjectId({})** - Applies { type: "string", pattern: /^[a-f\d]{24}$/i }

**@Email({})** - Applies { type: "email" }

**@Date({})** - Applies { type: "date" }

**@Enum({})** - Applies { type: "enum" }

**@Array({})** - Applies { type: "array" }

**@Nested({})** - Applies { type: "object", props: {} } (The props are gathered from the nested schema)

## Available methods

**getSchema()** - Returns the fastest-validator schema for a given class

**validate()** - Returns true or fastest-validator errors for a given instance

**validateOrReject()** - Returns true or throws fastest-validator errors for a given instance

## License
Licensed under the MIT license.
