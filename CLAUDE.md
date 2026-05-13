# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm** (pinned via `packageManager` in `package.json`). Node 20/22/24 are tested in CI.

- `pnpm test` — runs ESLint (via `pretest`) then Vitest once (`--watch=false`).
- `pnpm vitest tests/validator.test.ts` — run a single test file (skips the lint step).
- `pnpm vitest -t "name fragment"` — run tests matching a name.
- `pnpm lint` — ESLint only.
- `pnpm run build` — `tsup` bundles `src/index.ts` to ESM + CJS + `.d.ts` in `dist/` (prebuild cleans `dist/`).
- `pnpm publish` — runs `prepublishOnly` (test + build) first. Publishing is automated; see Release flow.

## Architecture

The library is a thin decorator layer over [`fastest-validator`](https://github.com/icebob/fastest-validator). All state lives in `reflect-metadata` keyed by two symbols from `src/constants.ts`:

- `SCHEMA_KEY` — per-property rules, stored as own-metadata on the class **prototype**.
- `COMPILE_KEY` — the compiled validator function, stored as metadata on the **constructor**.

Flow per class:

1. **Property decorators** (`src/decorators.ts`) — `@String`, `@Number`, `@UUID`, etc. are produced by `decoratorFactory`, which calls `updateSchema(target, key, {...rule})`. The `updateSchema` helper (`src/utils/update-schema.ts`) has a key behavior: **stacking two decorators on the same property auto-wraps them into a `RuleMulti`**, and a third stacked decorator pushes into the existing `rules` array. `@Nested` / `@NestedArray` resolve the referenced class's schema via `getSchema` and inline it as a nested `object` / `array` rule. `@Nested` reads the design-type via `Reflect.getMetadata("design:type", ...)` unless an explicit `validator` option is passed (needed for circular refs / interfaces).
2. **`@Schema` class decorator** (`src/schema.ts`) — applied after property decorators have populated `SCHEMA_KEY`. It (a) writes `$$strict` / `$$async` / extra root keys into the schema metadata, (b) calls `getSchema(target)` to assemble the final schema, (c) instantiates `FastestValidator` with `useNewCustomCheckerFunction: true` **forced on** (any caller-provided `validatorOptions` is merged but cannot disable this), and (d) stores the compiled function on the constructor under `COMPILE_KEY`. A shallow copy of the schema is passed to `compile()` because fastest-validator mutates the object (it strips `$$async`).
3. **Inheritance** — `getSchema` (`src/utils/get-schema.ts`) walks the full prototype chain via `getPrototypeChain` and merges `SCHEMA_KEY` metadata from each level **in reverse** (root → leaf), so subclass decorators override parent ones. This is the mechanism behind the fix in commit f9ad4c4; preserve this ordering when changing schema assembly.
4. **`validate` / `validateOrReject`** (`src/utils/`) — just look up `COMPILE_KEY` on `instance.constructor` and call it. They return `true | ValidationError[]` synchronously, or a `Promise` of the same when the schema is `async`.

`src/index.ts` does `import "reflect-metadata"` as a side effect, so consumers don't need to import it themselves.

## Constraints worth knowing

- **Legacy TS decorators only.** `tsconfig.json` sets `experimentalDecorators: true` + `emitDecoratorMetadata: true`. Stage 3 decorators are not supported because `@Nested` relies on `design:type` metadata.
- **`verbatimModuleSyntax: true`** — type-only imports must use `import type`.
- **ESM-first**, dual-published. `package.json` is `"type": "module"`; internal imports use `.js` extensions on `.ts` source (required by NodeNext-style resolution).
- The package forces `useNewCustomCheckerFunction: true` on every `@Schema`. Custom checkers must use the new `(value, errors, schema, path, parent, context) => value` signature, not the legacy one.

## Release flow

Releases are automated via **release-please** on `master`:

1. Merge conventional-commit PRs to `master` (PR titles are linted by `.github/workflows/lint-pr.yaml` — squash-merge so the title becomes the commit).
2. `.github/workflows/release-please.yaml` opens/updates a "release PR" that bumps `package.json` + `.release-please-manifest.json` and updates `CHANGELOG.md`.
3. Merging the release PR creates a `vX.Y.Z` tag + GitHub Release, which triggers the `publish` job to run `pnpm publish --provenance --access public` using the `NPM_TOKEN` secret.

Do **not** hand-edit `CHANGELOG.md`, the version in `package.json`, or `.release-please-manifest.json` — release-please owns them. Changelog sections are configured in `release-please-config.json`; `chore` / `ci` / `build` / `style` / `test` commits are hidden from the changelog by design.
