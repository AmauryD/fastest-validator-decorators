import {
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
  NestedArray
} from "../src/index";
import type { ValidationError } from "fastest-validator";
import { COMPILE_KEY } from "../src/constants";
import { validate } from "../src/utils/validate";
import { validateOrReject } from "../src/utils/validate-or-reject";

describe("Schema", () => {
  it("Should default to not strict", () => {
    @Schema()
    class Test {}
    expect(getSchema(Test)).toEqual({ $$strict: false });
  });

  it("Should set strict", () => {
    @Schema({ strict: true})
    class Test {}
    expect(getSchema(Test)).toEqual({ $$strict: true });
  });

  it("Should validate strict", () => {
    @Schema({ strict: true})
    class Test {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test();
    Object.assign(t,{
      prop: "prop",
      prop2: "prop2",
    });
    const result = validate(t);
    expect(result[0].type).toEqual("objectStrict");
  });

  it("Should validate not strict", () => {
    @Schema()
    class Test {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test();
    Object.assign(t,{
      prop: "prop",
      prop2: "prop2",
    });
    expect(validate(t)).toEqual(true);
  });

  it("Should remove extra properties", () => {
    @Schema({ strict: "remove" })
    class Test {
      @String()
        prop!: string;
    }
    const t = new Test();
    Object.assign(t,{
      prop: "prop",
      prop2: "prop2",
    });

    expect(validate(t)).toEqual(true);
    expect(Object.keys(t)).toEqual(["prop"]);
  });

  it("Should compile the schema before instantiation", () => {
    @Schema()
    class Test {
      @String()
        prop!: string;
      prop2!: string;
    }
    const compiled = Reflect.getMetadata(COMPILE_KEY, Test);
    expect(compiled).toBeTruthy();
    const t = new Test();
    
    expect(compiled).toBe(Reflect.getMetadata(COMPILE_KEY, t.constructor));
  });

  it("should preserve the constructor name on instancies", () => {
    @Schema()
    class Test {
      @String()
        prop!: string;
      prop2!: string;
    }
    const t = new Test();
    expect(t.constructor.name).toEqual("Test");
  });
});

describe("Field", () => {
  it("Should apply nothing by default", () => {
    @Schema()
    class Test {
      @Field({
        type: "any"
      })
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
      prop: { type: "string"},
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @String({ type: "x" as any, empty: true })
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
      @Boolean({ type: "x" as any, optional: true })
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
      prop: { type: "number" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Number({ type: "x" as any, convert: false })
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
      @UUID({})
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
      @UUID({ type: "x" as any, optional: true })
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
      @ObjectId({})
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
      @ObjectId({ type: "x" as any, optional: true })
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
      @Email({})
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
      @Email({ type: "x" as any, optional: true })
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
      @Instance({
        instanceOf: Object
      })
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "class",  instanceOf: Object },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Instance({ type: "x" as any, instanceOf: Buffer })
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
      @Currency({})
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "currency" },
    });
  });

  it("Should apply passed options", () => {
    @Schema()
    class Test {
      @Currency({ type: "x" as any, currencySymbol: "£" })
        prop!: Buffer;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "currency", "currencySymbol": "£", },
    });
  });
});

describe("Func", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Func({})
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
      @Luhn({})
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
      @Mac({})
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "mac" } });
  });
});

describe("Url", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Url({})
        prop!: string;
    }
    expect(getSchema(Test)).toEqual({ $$strict: false, prop: { type: "url" } });
  });
});

describe("Date", () => {
  it("Should apply defaults", () => {
    @Schema()
    class Test {
      @Date({})
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
      @Date({ type: "x" as any as any, convert: true })
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
      @Enum({
        values: []
      })
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
      @Enum({ type: "x" as any, values: [], optional: true })
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
      @Array({})
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
      @Array({ type: "x" as any, optional: true })
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

  it("Validates nested array", () => {
    @Schema()
    class TestNested {
      @String({
        empty: false
      })
      public declare name: string;
    }
    @Schema()
    class Test {
      @NestedArray({
        type: "array",
        validator: TestNested
      })
        prop!: TestNested[];
    }
    
    const test = new Test();

    const schema  = getSchema(Test);
    
    test.prop = [{
      name: "a"
    }, {
      name: ""
    }];
    
    const errors = validate(test);


    expect(errors).toHaveLength(1);
    expect(errors[0]).toStrictEqual({
      type: "stringEmpty",
      message: "The 'prop[1].name' field must not be empty.",
      field: "prop[1].name",
      actual: ""
    });
    
    expect(schema).toStrictEqual({
      prop: {
        type: "array",
        items: { type: "object", props: {
          "name": {
            "empty": false,
            "type": "string",
          },
        }, strict: false }
      },
      "$$strict": false
    });
  });

  it("Should apply nested schema", () => {
    @Schema({ strict: true})
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
    class Test {
      @Email({})
        prop!: string;
    }
    const t = new Test();
    t.prop = "test@test.com";
    
    expect(validate(t)).toEqual(true);
  });

  it("Should return validation errors", () => {
    @Schema()
    class Test {
      @Email({})
        prop!: string;
    }
    const t = new Test();
    t.prop = "Invalid";
    expect(validate(t)[0].field).toEqual("prop");
  });
});

describe("validateOrReject", () => {
  it("Should return true when valid", async () => {
    @Schema()
    class Test {
      @Email({})
        prop!: string;
    }
    const t = new Test();
    t.prop = "test@test.com";
    expect(await validateOrReject(t)).toEqual(true);
  });

  it("Should throw validation errors", async () => {
    @Schema()
    class Test {
      @Email({})
        prop!: string;
    }
    const t = new Test();
    t.prop = "invalid";
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
      @Equal({})
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
      @Equal({ type: "x" as any, field: "otherField" })
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: { type: "equal", field: "otherField" },
    });
  });
});

describe("Extending schemas", () => {
  test("Does not mix up inherited properties in schema", () => {
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
      a: { type: "string" },
      $$strict: false,
    });
    expect(getSchema(B)).toEqual({
      b: { type: "string" },
      a: { type: "string" },
      $$strict: false,
    });
    expect(getSchema(C)).toEqual({
      c: { type: "string" },
      a: { type: "string" },
      $$strict: false,
      b: { type: "string" },
    });
  });

  test("Nested does not pollute parents", () => {
    @Schema()
    class A {
      @String()
        a!: string;
    }

    @Schema({ strict: true})
    class Nest {
      @String()
        s!: string;

      @Array({
        
      })
        sr!: string;
    }

    @Schema()
    class B extends A {
      @String()
        b!: string;
      @Nested()
        nest!: Nest;
    }


    expect(getSchema(A)).toEqual({
      a: { type: "string" },
      $$strict: false,
    });
    expect(getSchema(Nest)).toEqual({
      s: { type: "string" }, 
      sr: { type: "array" } ,
      $$strict: true
    });
    expect(getSchema(B)).toEqual({
      b: { type: "string" },
      a: { type: "string" },
      nest : {
        props: { s: { type: "string" }, sr: { type: "array" } },
        strict: true,
        type: "object"
      },
      $$strict: false,
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const check = function check (): void {};
    @Schema()
    class Test {
      @Custom({
        check
      })
        prop!: unknown;
    }
    expect(getSchema(Test)).toEqual({
      $$strict: false,
      prop: expect.objectContaining({ type: "custom", check }),
    });
  });

  it("Should validate", () => {
    class X {}
    @Schema({
      strict: false
    }, {
      messages: {
        mustBeX: "The value must be an instance of X"
      }
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
