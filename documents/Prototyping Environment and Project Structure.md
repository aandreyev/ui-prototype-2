Prototyping Environment and Project Structure

Goal: Keep one shared, stable stack while developing many discrete prototype components/packages that can be handed off for integration.

1) Top-level layout
repo/
- documents/ (this folder)
- prototypes/ (each prototype is isolated here)
  - <feature-prototype-1>/
  - <feature-prototype-2>/
- shared/ (optional shared code strictly for prototypes)
  - tokens/ (design tokens)
  - styles/ (globals)
  - lib/ (registry, utils)
 - scripts/ (e.g., new-prototype.sh)

2) Shared stack
- Vue 3 + Vite + TypeScript
- Tailwind (tokens via CSS variables)
- shadcn-vue registry under `shared/lib/registry/new-york/ui/*`
- Storybook with MSW + a11y add-ons
- Vuex (minimal store for stories when needed)

3) Per‑prototype package
- Each `prototypes/<name>` is a small Vite+Storybook project depending on `shared/`
- Contents:
  - src/components/... (new components)
  - src/adapters/... (types + MSW)
  - .storybook/ (reuses shared preview + addons)
  - mocks/handlers.ts
  - package.json (scripts proxy to shared configs if desired)
  - README.md (handoff summary)
  - CONTROL.md (copy from `documents/templates/CONTROL Template.md` and fill in PRD and name)

4) Dependency strategy
- Shared code publishes as local workspace packages (pnpm/yarn workspaces) or path aliases to `shared/*`
- Prototypes import from `shared/` for tokens, registry, utils
- Keep prototypes free of cross-dependencies between each other

5) Handoff
- Each prototype ships with:
  - Components + stories + screenshots
  - Adapter types + MSW handlers
  - Component Handoff Template completed
  - Integration notes (routes, permissions, events)

6) Versioning and isolation
- Use workspaces so each prototype has its own lockfile scope but shares node_modules
- Tag completed prototypes (e.g., `proto/users-table@v1`)

7) Recommended scripts (workspace root)
- `yarn proto <name> dev` → runs Storybook for that prototype
- `yarn proto <name> build` → builds that prototype
- `yarn proto <name> shots` → runs visual tests for that prototype

8) Suggested folder template
prototypes/<feature-name>/
- src/
  - components/
  - adapters/
- .storybook/
- mocks/
- tests/
- README.md
- package.json

9) Keep stack constant
- All config (Tailwind, tokens, registry, Storybook preview, MSW setup) lives in `shared/` and is referenced by each prototype via aliases or workspace dependency
- Prototypes focus only on feature code


