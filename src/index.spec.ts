import {
  validate,
  validateOrReject,
  getSchema,
  Schema,
  Field,
  String,
  Boolean,
  Number,
  UUID,
  ObjectId,
  Email,
  Date,
  Enum,
  Array,
  Nested,
  Any,
  Equal,
  Instance,
  Currency,
  Func,
  Luhn,
  Mac,
  Url,
  Custom,
  SchemaBase,
  COMPILE_KEY,
} from "../src/index";
import * as v from "../src/index";
import type { ValidationError } from "fastest-validator";

describe("Schema", () => {
  it("Should default to not strict", () => {
    @Schema()
    class Test {}
    expect(getSchema(Test)).toEqual({ $$strict: false });
  });

  it("Should set strict", () => {
    @Schema(true)
    class Test {}
    expect(getSchema(Test)).toEqual({ $$strict: true });
  });

  it("Should validate strict", () => {
    @Schema(true)
    class Test extends SchemaBase {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test({
      prop: "prop",
      prop2: "prop2",
    });
    const result = validate(t);
    expect(result[0].type).toEqual("objectStrict");
  });

  it("Should validate not strict", () => {
    @Schema()
    class Test extends SchemaBase {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test({
      prop: "prop",
      prop2: "prop2",
    });
    expect(validate(t)).toEqual(true);
  });

  it("Should remove extra properties", () => {
    @Schema("remove")
    class Test extends SchemaBase {
      @String()
        prop!: string;
    }
    const t = new Test({
      prop: "prop",
      prop2: "prop2",
    });
    expect(validate(t)).toEqual(true);
    expect(Object.keys(t)).toEqual(["prop"]);
  });

  it("Should compile the schema before instantiation", () => {
    @Schema()
    class Test extends SchemaBase {
      @String()
        prop!: string;
      prop2!: string;
    }
    const compiled = Reflect.getMetadata(COMPILE_KEY, Test);
    expect(compiled).toBeTruthy();
    const t = new Test({});
    expect(compiled).toBe(Reflect.getMetadata(COMPILE_KEY, t.constructor));
  });

  it("should preserve the constructor name on instancies", () => {
    @Schema()
    class Test extends SchemaBase {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test({});
    expect(t.constructor.name).toEqual("Test");
  });
});

describe("Field", () => {
  it("Should apply type any as a default", () => {
    @Schema()
    class Test {
      @Field()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "any" } });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Field({ type: "string" })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "string" },
    });
  });
});

describe("String", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @String()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "string", empty: false },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @String({ type: "x", empty: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "string", empty: true },
    });
  });
});

describe("Boolean", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Boolean()
        prop!: boolean;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "boolean" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Boolean({ type: "x", optional: true })
        prop!: boolean;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "boolean", optional: true },
    });
  });
});

describe("Number", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Number()
        prop!: number;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "number", convert: true },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Number({ type: "x", convert: false })
        prop!: number;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "number", convert: false },
    });
  });
});

describe("UUID", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @UUID()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "uuid" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @UUID({ type: "x", optional: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "uuid", optional: true },
    });
  });
});

describe("ObjectId", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @ObjectId()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "objectID" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @ObjectId({ type: "x", optional: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "objectID", optional: true },
    });
  });
});

describe("Email", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Email()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "email" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Email({ type: "x", optional: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "email", optional: true },
    });
  });
});

describe("Instance", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Instance()
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "class", instanceOf: Object },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Instance({ type: "x", instanceOf: Buffer })
        prop!: Buffer;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "class", instanceOf: Buffer },
    });
  });

  it("Should validate", () => {
    @Schema()
    class Test {
      @Instance({ instanceOf: Buffer })
        prop!: Buffer;
    }
    const t = new Test();
    t.prop = Buffer.from("hello");
    expect(validate(t)).toEqual(true);
  });
});

describe("Currency", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Currency()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "currency", currencySymbol: "$" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Currency({ type: "x", currencySymbol: "£" })
        prop!: Buffer;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "currency", currencySymbol: "£" },
    });
  });
});

describe("Func", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Func()
        prop!: () => void;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "function" },
    });
  });
});

describe("Luhn", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Luhn()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "luhn" },
    });
  });
});

describe("Mac", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Mac()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "mac" } });
  });
});

describe("Url", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Url()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "url" } });
  });
});

describe("Date", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Date()
        prop!: Date;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "date" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Date({ type: "x", convert: true })
        prop!: Date;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "date", convert: true },
    });
  });
});

describe("Enum", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Enum()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "enum", values: [] },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Enum({ type: "x", optional: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "enum", optional: true, values: [] },
    });
  });
});

describe("Array", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Array()
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "array" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Array({ type: "x", optional: true })
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "array", optional: true },
    });
  });
});

describe("Nested", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Nested()
        prop!: any;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "object", strict: false, props: {} },
    });
  });

  it("Should apply nested schema", () => {
    @Schema(true)
    class NestedTest {
      @Boolean()
        prop!: boolean;
    }
    @Schema()
    class Test {
      @Nested()
        prop!: NestedTest;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: {
        type: "object",
        strict: true,
        props: {
          prop: { type: "boolean" },
        },
      },
    });
  });

  it("Should not remove nested $$strict", () => {
    @Schema()
    class NestedTest {
      @Boolean()
        prop!: boolean;
    }
    @Schema()
    class Test {
      //eslint-disable-line
      @Nested()
        prop!: NestedTest;
    }
    expect(getSchema(NestedTest)).toEqual({
      $$strict: false,
      prop: { type: "boolean" },
    });
  });
});

describe("validate", () => {
  it("Should throw an error if missing compiled validation method", () => {
    class Test {}
    expect(() => validate(new Test())).toThrow();
    expect(() => validate({})).toThrow();
  });

  it("Should return true when valid", () => {
    @Schema()
    class Test extends SchemaBase {
      @Email()
        prop!: string;
    }
    const t = new Test({
      prop: "test@test.com",
    });
    expect(validate(t)).toEqual(true);
  });

  it("Should return validation errors", () => {
    @Schema()
    class Test extends SchemaBase {
      @Email()
        prop!: string;
    }
    const t = new Test({
      prop: "invalid",
    });
    expect(validate(t)[0].field).toEqual("prop");
  });
});

describe("validateOrReject", () => {
  it("Should return true when valid", async () => {
    @Schema()
    class Test extends SchemaBase {
      @Email()
        prop!: string;
    }
    const t = new Test({
      prop: "test@test.com",
    });
    expect(await validateOrReject(t)).toEqual(true);
  });

  it("Should throw validation errors", async () => {
    @Schema()
    class Test extends SchemaBase {
      @Email()
        prop!: string;
    }
    const t = new Test({
      prop: "invalid",
    });
    expect.assertions(1);
    try {
      await validateOrReject(t);
    } catch (e) {
      expect((e as ValidationError[])[0].field).toEqual("prop");
    }
  });
});

describe("Any", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Any()
        prop!: any;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "any" } });
  });
});

describe("Equal", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Equal()
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "equal" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Equal({ type: "x", field: "otherField" })
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "equal", field: "otherField" },
    });
  });
});

describe("SchemaBase", () => {
  it("Should call validate", () => {
    @Schema()
    class Test extends SchemaBase {
      @Email()
        prop!: string;
    }
    const t = new Test({
      prop: "invalid",
    });
    jest.spyOn(v, "validate");
    t.validate();
    expect(v.validate).toBeCalledWith(t);
  });

  it("should allow using class type in generics", () => {
    @Schema()
    class Test extends SchemaBase {}
    function create<T extends SchemaBase> (klass: { new (): T }): T {
      return new klass();
    }
    const t = create(Test);
    expect(t).toBeDefined();
    expect(t).toBeInstanceOf(Test);
  });
});

describe("Extending schemas", () => {
  test("Does not mix up inherited properties", () => {
    @Schema()
    class A {
      @String()
        a!: string;
    }

    @Schema()
    class B extends A {
      @String()
        b!: string;
    }

    @Schema()
    class C extends B {
      @String()
        c!: string;
    }

    expect(getSchema(A)).toEqual({
      a: { empty: false, type: "string" },
      $$strict: false,
    });
    expect(getSchema(B)).toEqual({
      b: { empty: false, type: "string" },
      a: { empty: false, type: "string" },
      $$strict: false,
    });
    expect(getSchema(C)).toEqual({
      c: { empty: false, type: "string" },
      a: { empty: false, type: "string" },
      $$strict: false,
      b: { empty: false, type: "string" },
    });
  });

  test("Validation is required for inherited properties", () => {
    @Schema()
    class Parent {
      @String()
        a!: string;
    }

    @Schema()
    class Child extends Parent {
      @String()
        b!: string;
    }

    const child = new Child();

    child.b = "aaa";

    expect(validate(child)).toEqual([
      {
        type: "required",
        message: "The 'a' field is required.",
        field: "a",
        actual: undefined,
      },
    ]);

    const parent = new Parent();
    parent.a = "a";
    expect(validate(parent)).toStrictEqual(true);

    const invalidParent = new Parent();
    expect(validate(invalidParent)).toStrictEqual([
      {
        actual: undefined,
        field: "a",
        message: "The 'a' field is required.",
        type: "required",
      },
    ]);
  });
});

describe("Custom", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Custom()
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: expect.objectContaining({ type: "custom" }),
    });
  });

  it("Should validate", () => {
    class X {}
    @Schema(false, {
      messages: {
        mustBeX: "The value must be an instance of X",
      },
    })
    class Test {
      @Custom({
        check (value: any, errors: { type: string }[]) {
          if (!(value instanceof X)) {
            errors.push({ type: "mustBeX" });
          }
          return value;
        },
      })
        prop!: X;
    }
    const t = new Test();
    t.prop = {};
    expect(validate(t)[0].field).toEqual("prop");
    expect(validate(t)[0].message).toEqual(
      "The value must be an instance of X"
    );
    t.prop = new X();
    expect(validate(t)).toEqual(true);
  });
});

describe("Custom async", () => {
  it("Should support async validation", async () => {
    @Schema({
      async: true,
    })
    class Test {
      @Custom({
        async check (value: any) {
          await new Promise((res) => setTimeout(res, 500));
          return value;
        },
      })
        prop!: unknown;
    }

    /**
     * $$async key is removed for unknown reason from schema object at compile()
     * https://github.com/icebob/fastest-validator/blob/a746f9311d3ebeda986e4896d39619bfc925ce65/lib/validator.js#L176
     */
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      $$async: true,
      prop: expect.objectContaining({ type: "custom" }),
    });
    expect(Reflect.getMetadata(COMPILE_KEY, Test)).toHaveProperty(
      "async",
      true
    );
    const t = new Test();
    t.prop = "blah";
    const promise = validate(t);
    expect(promise).toBeInstanceOf(Promise);
    expect(await promise).toEqual(true);
  });

  it("Validate with errors", async () => {
    @Schema({
      async: true,
    })
    class Test {
      @Custom({
        async check (value: any, errors: { type: string }[]) {
          await new Promise((res) => setTimeout(res, 500));
          if (value !== 123) {
            errors.push({ type: "not-123" });
          }
          return value;
        },
      })
        prop!: unknown;
    }

    const t = new Test();
    t.prop = "blah";
    expect(await validate(t)).toEqual([
      { field: "prop", message: undefined, type: "not-123" },
    ]);
  });
});
