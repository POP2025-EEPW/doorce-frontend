# Doorce Frontend

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Scripts](#scripts)
- [Development workflow](#development-workflow)
- [Project structure](#project-structure)
- [Adding components (shadcn/ui)](#adding-components-shadcnui)
- [Component structure (global vs local)](#component-structure-global-vs-local)
- [Storybook](#storybook)
- [Storybook tests (play function, CLI)](#storybook-tests-play-function-cli)
- [Routing](#routing)
- [Code style & naming](#code-style--naming)
- [Branching & collaboration](#branching--collaboration)
- [Troubleshooting](#troubleshooting)

## Overview

- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Storybook 9
- ESLint + Prettier + lint-staged
- Husky + commitlint (conventional commits)

## Setup

```bash
npm install
npm run dev         # app
npm run storybook   # UI workshop
```

## Scripts

- `dev`: run the app in development
- `build`: type-check and build for production
- `preview`: preview the production build
- `lint`: run ESLint
- `lint:fix`: run ESLint with fixes
- `format`: run Prettier format
- `storybook`: run Storybook
- `build-storybook`: build static Storybook
- `test`: run Vitest tests
- `test:storybook`: run Storybook play tests headless
- `test:storybook:coverage`: Storybook tests with coverage

## Development workflow

### Commits & hooks

- Follow conventional commits (enforced by commitlint). Examples:
  - `feat(auth): add login validation`
  - `fix(ui): correct button focus ring`
- Pre-commit runs lint-staged (ESLint + Prettier) on staged files.

### Project structure

```
src/
  components/
    ui/            # shadcn/ui components (global/reusable)
  hooks/
  lib/
  pages/
  assets/
  index.css
  main.tsx
  consts/
    routes.ts
```

- Import with `@` alias (e.g., `@/components/ui/button`).

### Adding components (shadcn/ui)

1. Add a component via CLI:
   ```bash
   npx shadcn@latest add button
   ```
2. Use it:
   ```tsx
   import { Button } from "@/components/ui/button";
   ```
3. Keep tokens/styles in `src/index.css` (Tailwind layers).

### Component structure (global vs local)

Global, reusable components live under `src/components/` (or `src/components/ui` for shadcn/ui). Complex feature components can own a local folder to keep internals private:

```
src/components/
  SuperComponent/
    SuperComponent.tsx            # exported public component
    SuperComponent.stories.tsx    # colocated story for the public API
    index.ts                      # re-export default/named symbols
    components/                   # local-only subcomponents
      SubCom/
        SubCom.tsx
    hooks/                        # local hooks scoped to this component
      useSuperThing.ts
    factories/                    # local factories/builders
      makeSuperState.ts
    // etc/ other private, internal-only modules

  // Global hooks shared project-wide
src/hooks/
  useBreakpoint.ts
  useFeatureFlag.ts
```

Guidelines

- Keep stories focused on the public component (file next to `SuperComponent.tsx`).
- Avoid separate stories for deep internals; test internals via the parent story.
- Do not add stories for shadcn/ui primitives under `src/components/ui`; add stories for composed project components that use them.
- Keep shadcn/ui component names and exports as shipped (no renaming). For project-specific variants, create wrapper components under `src/components`.
- Re-export from `index.ts` for clean imports: `import { SuperComponent } from "@/components/SuperComponent"`.
- Local-only modules stay inside the component folder; promote to `src/components/` or `src/hooks/` only when reused across features.

### Storybook

- Run with `npm run storybook`.
- Stories live alongside components.
- Note: `src/stories/` is for examples only. Add real component stories next to their components (colocated) rather than in `src/stories/`.
- Add a basic story:

```ts
// Button.stories.ts
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = { component: Button };
export default meta;
export const Default: StoryObj<typeof Button> = {
  args: { children: "Click" },
};
```

#### Storybook tests (play function, CLI)

1. Add a play test in a story:

```ts
// In any *.stories.ts(x)
import { expect, userEvent, within } from "storybook/test";

export const WithClick = {
  args: { children: "Search" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /search/i }));
    expect(canvas.getByRole("button", { name: /search/i })).toBeEnabled();
  },
};
```

2. Run headless tests (no Storybook dev server needed):

```bash
npm run test:storybook
```

- For coverage: `npm run test:storybook:coverage`

### Routing

- Router: HashRouter (SPA, frontend-only)
- Route registry lives in `src/consts/routes.ts` as `ROUTES` with UPPERCASE keys:

```ts
// src/consts/routes.ts
export const ROUTES = {
  HOME: "/",
  // add future routes here, e.g. SETTINGS: "/settings"
} as const;
```

## Code style & naming

- Components: PascalCase (`SearchFilters.tsx`), one primary component per file, under `src/components/...`.
- Hooks: `useXxx.ts` named files; place shared hooks under `src/hooks`.
- Utilities: `src/lib/*.ts` with clear, domain-oriented names; prefer named exports over default.
- Stories: colocate `*.stories.ts(x)` next to the component or mirror structure under `src/stories/`.
- Tests: colocate `*.test.ts(x)` next to the subject file or use `src/__tests__/` with matching paths.
- Imports: use the `@` alias for `src` (e.g., `@/components/ui/button`).
- File names: kebab-case for non-components (e.g., `search-utils.ts`, `date-format.ts`).
- Barrels: avoid deep barrels; prefer explicit imports to keep dependencies clear.

- Folder names: plural (e.g., `components/`, `hooks/`, `consts/`, `lib/`, `factories/`, `assets/`).
- Component files: singular, PascalCase (e.g., `Button.tsx`, `SearchFilters.tsx`).

- File suffix conventions:
  - `*.interface.ts`: TypeScript interfaces
  - `*.types.ts`: shared type aliases/unions
  - `*.mock.ts`: mock data/stubs (non-runtime)
  - `*.fixture.ts`: test fixtures
  - `*.factory.ts`: builders/generators
  - `*.schema.ts`: validation schemas (e.g., Zod)
  - `*.stories.ts(x)`: Storybook stories
  - `*.test.ts(x)`: unit/integration tests

Fixtures are reusable, realistic test data or setup (not mocks). Place them under `src/__fixtures__/` or colocate next to the consuming tests. Prefer small factory helpers (e.g., `makeUser(overrides)`) so tests can tweak only what they need.

Styling is automated by Prettier and ESLint; no manual formatting needed.

## Branching & collaboration

- Branches must be created from the GitHub Issue (Projects) via the "Development" panel. Local branch creation is blocked by hooks.
- Required branch format: `<issue-number>-<type>-<kebab-name>` (kebab-case, no slash).
  - Allowed `<type>`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`
  - Examples: `10-fix-resolve-problem-with-button`, `234-feat-add-login-form`
- Pushes to `main` are blocked by hooks; open a PR instead.
- In your PR description, reference the issue to auto-close it on merge: `Closes #<number>`.
- Open PRs early; keep changes focused; write clear descriptions.
- Ensure `lint` and `build` pass before requesting review.

## Troubleshooting

- Husky not running: ensure hooks are executable: `chmod +x .husky/*`.
- Storybook shows old UI: clear cache `npm run storybook -- --no-manager-cache`.
