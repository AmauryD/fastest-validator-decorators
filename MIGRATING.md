# Moving From 1.x to 2.x

## SchemaBase has been removed

The `SchemaBase` class has been removed. This class was overriding the constructor and may cause problems in the future.

The user is now responsible to handle property assignment to the class manually.

Here's a simple function replacing the SchemaBase's behavior.

```ts
function validateFromPayload(validationClass: any, payload: Record<string, any>) {
    const validationClassInstance = new validationClass();
    Object.assign(validationClassInstance,payload);
    return validate(validationClassInstance);
}
```

### Before 

```ts
@Schema(true)
export class User extends SchemaBase {
    @String() 
    username: string;
}

const user = new User({
    username: 'AmauryD'
});
const validated = user.validate();
```

### After

```ts
@Schema({
    strict: true
})
export class User {
    @String() 
    username: string;
}
const validated = validateFromPayload(User, {
    username: 'AmauryD'
});
```


## Fastest-validator is now a peerDependency

`fastest-validator` has been moved to peerDependencies. So it needs to be installed in your project using your favorite package manager.

## Decorators are only applying "type" property as default.

The old decorators were applying some properties by default (like converting numbers). This behavior was confusing and was removed. User needs to explicitly tell fastest validator to apply a specific validation option.

### Before

`@Number()`

- applies `{ type: "number", convert: true }`

### After

`@Number()`

- applies `{ type: "number" }`


## Schema first option is now an object.

For better readability the first option to the @Schema decorator is an object.

### Before 

```ts
// applies strict
@Schema(true)
class X {}
```

### After 

```ts
// applies strict
@Schema({
    strict: true
})
class X {}
```

## Schema second option has changed.

Before, second option was used to create only custom validation messages. It has been replaced by a more flexible option `ValidatorConstructorOptions`. You need to wrap your old message object in a message key in order to migrate.

### Before 

```ts
// applies strict
@Schema(true, {
    evenNumber: "The '{field}' field must be an even number! Actual: {actual}"
})
class X {}
```

### After 

```ts
// applies strict
@Schema({
    strict: true
}, {
    messages: {
        // Register our new error message text
        evenNumber: "The '{field}' field must be an even number! Actual: {actual}"
    },
    // other fastest validator options ...
    plugins: [],
})
class X {}
```

## Decorators are fully typed.

All decorators now provide typescript auto-completion. The types are directly from fastest-validator package.
