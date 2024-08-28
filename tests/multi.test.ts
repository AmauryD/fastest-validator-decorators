import { expect, it } from "vitest";
import {
  Schema,
  String,
  Number,
  Boolean,
  getSchema,
  Multi,
  validate,
} from "../src/index.js";
import { describe } from "vitest";

describe("Multi decorator", () => {
  @Schema({
    async: true,
  })
  class Test {
    @Multi({
      rules: [
        { type: "string" },
        { type: "number" },
        { type: "boolean" },
      ],
    })
      name!: string | number | boolean;
  }

  it("Should create a multi schema type", () => {
    const schema = getSchema(Test);
    expect(schema).toMatchInlineSnapshot(`
      {
        "$$async": true,
        "$$strict": false,
        "name": {
          "rules": [
            {
              "type": "string",
            },
            {
              "type": "number",
            },
            {
              "type": "boolean",
            },
          ],
          "type": "multi",
        },
      }
    `);
  });

  it.each([{
    input: "string",
    valid: true
  },{
    input: 1,
    valid: true
  },{
    input: true,
    valid: true
  }, {
    input: {},
    valid: false
  }])("Using @Multi decorator with value $input should be valid : $valid", async (args) => {
    const t = new Test();
    Object.assign(t, {
      name: args.input,
    });

    const validated = await validate(t);

    if (args.valid) {
      expect(validated).toBe(true);
    } else {
      expect(validated).toBeInstanceOf(Array);
    }
  });
});

it("Stacking multiple decorators should resolve in multi schema type", async () => {
  @Schema({
    async: true,
  })
  class Test {
    @String()
    @Number()
    @Boolean()
      name!: string | number | boolean;
  }

  const t = new Test();
  Object.assign(t, {
    prop: "prop",
    prop2: "prop2",
  });
  const schema = getSchema(Test);

  expect(schema).toMatchInlineSnapshot(`
    {
      "$$async": true,
      "$$strict": false,
      "name": {
        "rules": [
          {
            "type": "boolean",
          },
          {
            "type": "number",
          },
          {
            "type": "string",
          },
        ],
        "type": "multi",
      },
    }
  `);
  
});