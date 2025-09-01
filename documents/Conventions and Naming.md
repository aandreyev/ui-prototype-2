Conventions and Naming

1) Storybook Taxonomy
- Title: Feature/Component/State (e.g., Users/Table/WithFilters)
- Files: `Component.stories.ts` colocated with component

2) Files & Folders
- Components: `src/components/<area>/<Component>.vue`
- Adapters: `src/adapters/<feature>/`
- Types: `types.ts` per adapter, exported barrel `index.ts`

3) Props & Events
- Props: kebab in template, camelCase in script. Required props first.
- Emits: follow ALP patterns with typed payloads
  - Single-word events: `close`, `created`, `updated`, `deleted`, `selected`
  - Multi-word events (app code): kebab-case, e.g. `selected-range`, `load-more`, `row-selection-change`, `select-email`
  - Library-specific cases may use camelCase where existing components do (e.g., calendar `updateEventValue`)
  - Prefer kebab-case for new multi-word emits in app components; mirror existing names when integrating

4) CSS/Classes
- Use Tailwind + tokens; no inline colors; prefer utility classes over bespoke CSS
- Long lines wrap; avoid one-liners; match existing formatting

5) Accessibility
- Always include labels/ARIA roles for interactive elements
- Keyboard: tab order, ESC closes overlays, focus returns to trigger

6) Data & Contracts
- Never hardcode example JSON in components; use adapter + MSW
- Align field names/types to ALP schema


