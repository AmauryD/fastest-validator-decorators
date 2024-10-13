[![npm version](https://img.shields.io/npm/v/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-decorators)
[![npm downloads](https://img.shields.io/npm/dm/fastest-validator-decorators.svg)](https://www.npmjs.com/package/fastest-validator-decorators)
[![GitHub issues](https://img.shields.io/github/issues/tobydeh/fastest-validator-decorators.svg)](https://github.com/tobydeh/fastest-validator-decorators/issues)
[![License](https://img.shields.io/github/license/tobydeh/fastest-validator-decorators.svg)](https://github.com/tobydeh/fastest-validator-decorators/blob/master/LICENSE)

# Fastest Validator Decorators

**Fastest Validator Decorators** is a TypeScript library providing a set of decorators that streamline the integration with the [fastest-validator](https://github.com/icebob/fastest-validator#readme), a high-performance validation library for JavaScript and TypeScript. This package simplifies schema definition and validation by leveraging TypeScript's decorator feature.

:boom: Upgrading from version 1.x? Check the [Migration Guide](MIGRATING.md).

## Key Features
- **Type-safe schema validation** using TypeScript decorators.
- Supports all validation types provided by fastest-validator.
- **Nested object and array validation** made simple with decorators.
- **Async validation support**, enabling you to run asynchronous validation tasks.
  
## Installation

Install the package via npm:

```bash
npm install --save fastest-validator-decorators fastest-validator
```

:warning: **Note:** `fastest-validator` is a peer dependency, so ensure it's also installed.

Next, enable decorators in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Usage Example

Here’s a basic example of how to use the decorators in your project:

```ts
import {
  Schema, Array, UUID, Enum, Email, Number, Nested, getSchema, validate, validateOrReject
} from "fastest-validator-decorators";

@Schema({ strict: true })
class Entity1 {
  @Array({ items: "string" })
  prop1: string[];
}

@Schema()
class Entity2 {
  @UUID()
  prop1: string;

  @Enum({ values: ["one", "two"] })
  prop2: "one" | "two";

  @Email()
  prop3: string;

  @Number({ positive: true })
  prop4: number;

  @Nested()
  prop5: Entity1;
}

// Generating a validation schema
const schema = getSchema(Entity2);

// Creating and validating instances
const entity = new Entity2();
entity.prop1 = "invalid-uuid";  // Validation error: invalid UUID
entity.prop2 = "one";
entity.prop3 = "user@example.com";
entity.prop4 = -10;  // Validation error: number is not positive

const result = validate(entity); // true or error list
await validateOrReject(entity);   // true or throws an error
```

## Available Decorators

Fastest Validator Decorators supports the following decorators for schema definition. Each decorator corresponds to a validation type from [fastest-validator](https://github.com/icebob/fastest-validator#readme).

- **@Schema**: Defines the validation schema for a class.
- **@Field**: Generic decorator for defining custom fields.
- **@String**, **@Boolean**, **@Number**, **@UUID**, **@ObjectId**, **@Email**, **@Date**, **@Enum**, **@Array**, **@Equal**, **@Instance**, **@Currency**, **@Func**, **@Luhn**, **@Mac**, **@Url**, **@Any**, **@Multi**: Each of these applies a specific fastest-validator type with custom options.
  
You can also use **@Nested** and **@NestedArray** for validating complex objects and arrays of objects.

### Decorator Stacking

The library allows stacking multiple decorators on a single property. For example:

```ts
@String()
@Number()
prop1: string | number;
```

This syntax resolves to the @Multi decorator, which validates the property against multiple types.

### Async Validation Support

Async validation is supported by adding the `async: true` option to your schema. Here's an example of how to use asynchronous checks within a custom validation:

```ts
@Schema({ async: true, strict: true })
class User {
  @Custom({
    async check(value, errors) {
      const isUserInDB = await db.checkUserName(value);
      if (isUserInDB) errors.push({ type: "unique", actual: value });
      return value;
    }
  })
  username: string;
}

const user = new User();
user.username = "existingUser";
await validateOrReject(user);  // async validation
```

## API Methods

- **getSchema(Class)**: Retrieves the fastest-validator schema for a given class.
- **validate(instance)**: Validates the provided instance and returns `true` or an error list.
- **validateOrReject(instance)**: Same as `validate()`, but throws errors if validation fails.

## License

This project is licensed under the [MIT License](LICENSE).