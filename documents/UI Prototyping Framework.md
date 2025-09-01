Scenario A — UI Prototyping Framework (Existing Application)

Purpose: Define the minimal, repeatable framework for prototyping front‑end components for a large, existing application, so they can be handed off for integration with the current backend, routing, auth, and data models.

⸻

1) Ground Rules & Goals
	•	Isolation first: Build components in Storybook, not inside the running app.
	•	Design fidelity: Use the existing design system (tokens, primitives) as the single source of truth.
	•	Contract awareness: Prototype against realistic API shapes via MSW; never hard‑code sample JSON in components.
	•	Hand‑off clarity: Every component ships with stories, types, an adapter contract, screenshots, and acceptance criteria.
	•	Quality gates: Types clean, a11y checks pass, visual regression stable, small diffs.

⸻

2) Alignment Checklist (Before You Start)
	•	Confirm design tokens (colors, spacing, typography, radii, shadows) and import path
	•	Confirm UI primitives (e.g., shadcn/* or house components) and allowed utility classes
	•	Confirm icon set + naming
	•	Confirm a11y requirements (focus styles, ARIA rules, keyboard nav patterns)
	•	Confirm API owner and the source of truth for endpoint contracts
	•	Confirm data model source of truth for ALP (EF Core models/migrations/OpenAPI). Mock data should match existing ALP field names/types/enums where possible
	•	Confirm performance budgets (bundle size per page, LCP targets)

⸻

3) Component Inventory (Map)

3.1 Atoms
	•	Typography: Text, Heading, Code
	•	Interactive: Button (primary/secondary/link/destructive), IconButton
	•	Inputs: Input, Textarea, Select, Combobox/Autocomplete, Checkbox, Radio, Switch, Slider
	•	Indicators: Badge, Pill/Tag, Tooltip, HelpHint, Progress, Spinner, Skeleton, StatusDot
	•	Decorative/Utility: Avatar, Divider/Separator, KBD (keyboard hint), VisuallyHidden

3.2 Layout Primitives
	•	Containers: PageContainer, Section, Card, Panel
	•	Structure: Grid, Stack/VStack/HStack, Cluster (wrap row), Split (sidebar + content)
	•	App Chrome: TopNav, SideNav, Breadcrumbs, Footer
	•	Surfaces: Sheet/Drawer, Dialog/Modal, Popover, HoverCard, Tabs, Accordion

3.3 Data Display
	•	Table: DataTable (sortable, filterable, pageable, column pinning), TableToolbar, ColumnVisibilityMenu
	•	List: List, ListItem (with meta, actions)
	•	Card: EntityCard (title, subtitle, meta, actions), MetricCard (value, delta)
	•	Detail: DescriptionList/KeyValue, JSONViewer (safe), CodeBlock (copyable)
	•	Empty/State: EmptyState (title, description, primary action), ErrorState, LoadingState
	•	Status: Alert/Callout (info/warn/error/success), Toast/Notifications

3.4 Forms & Validation
	•	Form (schema‑driven wrapper)
	•	Field primitives: Field, Label, HelperText, ErrorText, RequiredMark
	•	Controls: DatePicker, TimePicker, DateTimePicker, FileUpload (drag & drop), PhoneNumber, Money/Currency, Percentage, ToggleGroup, TagInput
	•	Actions: FormActions (Submit/Cancel), SaveBar (sticky)
	•	Validation: Zod/Yup schema binding, async uniqueness checks

3.5 Navigation & Search
	•	Routing Aware: NavItem, NavSection, Breadcrumbs
	•	Search: GlobalSearch/CommandPalette, InlineSearchBar (debounced), Filters (facets, chips), Pagination

3.6 Domain Adapters (per feature)
	•	Adapters: UserAdapter, OrgAdapter, ProjectAdapter … small modules that expose typed fetch functions and MSW mocks mirroring real endpoints.
	•	Events: Domain events emitted by components (onCreate, onUpdate, onDelete, onNavigate).

Note: Start with atoms + layout. Introduce feature modules (adapters + composed components) as slices of the existing app’s domains.

⸻

4) States to Cover (per Component)
	•	Base (default)
	•	Loading (skeleton + spinner spec)
	•	Empty (actionable, link to create/import)
	•	Error (API error, validation error)
	•	Permission (read‑only, masked, or “request access” state)
	•	Long content (overflow, wrapping, truncation with tooltip)
	•	Responsive (mobile, tablet, desktop breakpoints)

Each state must have a Storybook story and, where relevant, axe a11y checks.

⸻

5) API Contract & MSW
	•	MSW handlers mirror production endpoints, including status codes (200/400/401/403/404/409/422/500) and headers.
	•	Data realism: Use realistic shapes (IDs, dates, money, enums) + pagination & filters.
	•	Schema parity (ALP): To the extent possible, mock payloads must use existing ALP field names, types, enums, and nested structures. Cross‑check `reference/ALP/ALP.Data/Models`, `reference/ALP/ALP.Data/EntityTypeConfigurations`, and `reference/alp-business-logic/ALP_Database_Structure.sql`
	•	Error modeling: Provide error payload schemas with codes and messages.
	•	Latency: Simulate network delay (e.g., 300–800ms) and timeouts.
	•	Switchability: Adapters export the same functions regardless of MSW vs real fetch, so the integration team swaps implementations without refactors.

Example adapter outline

/adapters/user/
  index.ts        # typed functions (list, get, create, update, delete)
  types.ts        # User, UserInput, Filters, Error types
  msw.ts          # handlers (list, get, create...) + seeds
  client.ts       # real fetch/axios implementation (integration team)


⸻

6) Handoff Package (per Feature)
	•	Code: components + stories + adapter (types + msw)
	•	Docs: README with usage, props, supported states, a11y notes
	•	Contracts: request/response types (optionally OpenAPI fragments)
	•	Screenshots: Playwright/Storybook PNGs (before/after; key states)
	•	Acceptance Criteria: checklist below completed

Acceptance Checklist
	•	Matches tokens & primitives; no ad‑hoc colors/sizing
	•	Stories for all required states
	•	Axe checks: no serious violations
	•	Keyboard: tab order, focus ring, escape/enter behavior for modals/sheets
	•	Screen reader: roles, labels, announcements for async states
	•	Visual baseline stable (no unintended diffs)
	•	Performance: interaction snappy; list virtualization if >100 rows
	•	Security: no dangerouslySetInnerHTML; safe link handling; sanitized copy

⸻

7) File/Folder Structure (Prototype Repo)

src/
  components/
    atoms/...
    layout/...
    data-display/...
    forms/...
    navigation/...
  adapters/
    user/
    org/
    project/
  tokens/
    tokens.json   # imported by Tailwind + components
  styles/
    globals.css   # maps tokens → CSS vars/Tailwind theme
.storybook/
  main.ts
  preview.ts      # msw addon + a11y
mocks/
  server.ts       # MSW setup for dev
  handlers.ts     # aggregate handlers

tests/
  visual/
    story-shots.spec.ts  # Playwright screenshots
  a11y/
    axe.spec.ts          # key story checks


⸻

8) Storybook Conventions
	•	Title taxonomy: Feature/Component/State (e.g., Users/Table/WithFilters)
	•	Controls: expose key props for manual QA
	•	Viewports: mobile (375×812), tablet (768×1024), desktop (1440×900)
	•	Theming: toggle for light/dark if app supports it
	•	Decorators: Vuex provider (if needed), Router mock (if needed)

⸻

9) Prompts for LLM (Copy/Paste)

New component

“Using our tokens and primitives, create <UserTable> with sortable columns, client‑side filtering, paginated footer, empty/loading/error stories. Provide adapters/user/types.ts and adapters/user/msw.ts for /api/users (GET list with q, page, size; POST create; PATCH update; DELETE). Return a single diff touching only these files.”

Refactor for a11y

“Add keyboard focus management to <Dialog> (trap focus, ESC to close, return focus to trigger). Ensure roles/aria‑labels. Update stories and write axe tests for Dialog/Default and Dialog/LongContent.”

Tighten design

“Reduce vertical rhythm by 12% in EntityCard, align iconography to 16px grid, and replace any hardcoded spacing with tokens. Update snapshots.”

⸻

10) Integration Notes (for Core App Team)
	•	Mount points: proposed routes/locations where components slot in
	•	Data contracts: request/response typedefs (or OpenAPI fragment)
	•	Events: emitted events and handler expectations
	•	Auth: required permissions/claims for actions
	•	Migration: if UI implies backend/db changes, list them explicitly

⸻

11) Risks & Mitigations
	•	Design drift → Enforce tokens; lint for disallowed styles
	•	API mismatch → Align on types/OpenAPI early; validate in CI
	•	A11y regressions → Axe + keyboard tests per PR
	•	Performance → Virtualize large lists; debounce search; memoize heavy rows
	•	Hand‑off ambiguity → Ship adapters + stories + screenshots + checklists every time

⸻

12) Definition of Done (Prototype)
	•	✅ Component + stories cover all states
	•	✅ Adapter + MSW handlers mirror expected API
	•	✅ A11y + visual checks pass; screenshots exported
	•	✅ README with usage + props + integration notes
	•	✅ Small, reviewable diff (scoped to feature)

⸻

Appendix A — Tokens Mapping (example)
	•	--color-brand-primary → Tailwind bg-brand-primary
	•	--radius-md → rounded-md
	•	--space-md → px-md py-md
	•	Typography scale: text-sm | text-base | text-lg mapped from token sizes

Appendix B — MSW Error Catalog (example)
	•	401: { code: 'AUTH_REQUIRED', message: 'Please log in.' }
	•	403: { code: 'FORBIDDEN', message: 'You do not have access to this resource.' }
	•	404: { code: 'NOT_FOUND', message: 'Resource not found.' }
	•	409: { code: 'CONFLICT', message: 'Duplicate entity.' }
	•	422: { code: 'VALIDATION', issues: [...] }
	•	500: { code: 'SERVER_ERROR', message: 'Unexpected error.' }

⸻

Appendix C — ALP Schema Alignment & Extraction
	•	Sources of truth:
		•	EF Core: `reference/ALP/ALP.Data/ALPDbContext.cs`, `reference/ALP/ALP.Data/Models/`, `reference/ALP/ALP.Data/EntityTypeConfigurations/`, `reference/ALP/ALP.Data/Migrations/`
		•	API contracts: `reference/ALP/ALP/Swagger/` and NSwag configs under `reference/ALP/ALP/App/nswag/`
		•	Docs/SQL snapshot: `reference/alp-business-logic/ALP_Database_Structure.sql`
	•	Goal: Derive canonical field names, types, enums, and relationships to drive MSW payloads and adapter types.
	•	Recommended (when backend can run): export Swagger/OpenAPI and/or use NSwag configs to generate client types; use these types for adapters and mocks.
	•	Offline (no backend runtime): script the DB schema from EF Core migrations and cross‑check with the SQL snapshot.

Example EF Core commands (from repo root):

```bash
dotnet tool restore
dotnet ef dbcontext info -p reference/ALP/ALP.Data -s reference/ALP/ALP
dotnet ef migrations script -p reference/ALP/ALP.Data -s reference/ALP/ALP -o schema.sql
```

	•	Usage in prototypes: When seeding MSW, copy ALP field names/types exactly; include foreign keys and display fields; preserve enum values; avoid introducing new fields unless explicitly proposed in Integration Notes.

⸻

13) Playwright Visual Diffs for Iterations

Goal: Fast feedback on whether a change looks right. Keep baselines in Git; compare on every run.

13.1 What to snapshot
	•	Storybook stories (preferred): Deterministic component states → fewer flakes.
	•	Key pages: End‑to‑end flows (login, list, detail, create/edit) for integration sanity.

13.2 Minimal test examples

Story shots (iframe mode):

// tests/visual/story-shots.spec.ts
import { test, expect } from '@playwright/test'

const stories = [
  'users-table--empty',
  'users-table--loaded',
  'entity-card--default',
]

for (const id of stories) {
  test(`story: ${id}`, async ({ page }) => {
    await page.goto(`http://localhost:6006/iframe.html?id=${id}`)
    await page.setViewportSize({ width: 1280, height: 800 })
    await expect(page).toHaveScreenshot(`${id}.png`, {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.001,
    })
  })
}

Page shots (app runtime):

// tests/visual/page-shots.spec.ts
import { test, expect } from '@playwright/test'

test('users list page', async ({ page }) => {
  await page.goto(process.env.BASE_URL + '/users')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('users-list.png', {
    animations: 'disabled',
    fullPage: true,
  })
})

13.3 Playwright config (stability + folders)

// playwright.config.ts
import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: 'tests',
  retries: 1,
  use: {
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    timezoneId: 'Australia/Melbourne',
    locale: 'en-AU',
  },
  snapshotDir: 'tests/__screenshots__',
  outputDir: 'tests/__output__',
})

13.4 Baselines & approvals
	•	First run creates baselines under tests/__screenshots__ (checked into Git).
	•	PRs compare against baselines; diffs are saved to tests/__output__.
	•	To accept intentional changes: npx playwright test --update-snapshots (commit new baselines).

13.5 Make diffs deterministic (anti‑flake)
	•	Fonts: self‑host; avoid OS‑dependent rendering; use the same Docker image in CI.
	•	Animations/carets: disable via animations: 'disabled', caret: 'hide'.
	•	Time/Random: freeze dates (e.g., Date.now = () => 1700000000000) and seed RNG.
	•	Dynamic regions: mask them:

await expect(page).toHaveScreenshot('detail.png', { mask: [page.locator('[data-dynamic]')] })

	•	Network: use MSW in stories; for pages, wait for networkidle and debounce live data.

13.6 CI integration (PRs)
	•	Run Storybook on CI (static build + local server), then run story shots.
	•	Upload __output__ as artifacts; link in PR comments.
	•	Gate merges on visual diff + a11y checks for AI‑authored PRs.

13.7 LLM feedback loop
	1.	Run shots → collect PNGs for changed stories/pages.
	2.	Drop PNGs into the chat with instructions (e.g., “tighten table density by 10%, improve focus ring contrast”).
	3.	Apply the patch returned by the LLM.
	4.	Re‑run shots; if accepted, update snapshots and merge.

13.8 Naming & taxonomy
	•	File names mirror Storybook IDs (e.g., feature-component--state.png).
	•	Keep separate folders: visual/stories/ and visual/pages/.

13.9 When to prefer a SaaS (later)
	•	Want hosted review & team approvals → add Chromatic or Percy. Keep Playwright for E2E & critical pages.


