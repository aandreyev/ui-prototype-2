ALP Frontend Integration Summary

Purpose: A concise inventory of the existing ALP frontend stack and conventions that our prototype framework should mirror for seamless integration. Use this as a checklist when scaffolding new prototype components and adapters.

—

1) Core Stack
• Framework: Vue 3 (`vue@^3.4`), Vite (`vite@^5`), TypeScript
• Router: `vue-router@^4`
• State: Vuex 4 (modular store)
• Styling: Tailwind CSS 3 with CSS variables, `tailwindcss-animate`, custom container sizes
• UI Kits:
  • shadcn-vue registry under `src/lib/registry/new-york/ui/*`
  • Headless UI (`@headlessui/vue`), Radix primitives (`radix-vue`, `@radix-icons/vue`)
  • Font Awesome (global component `font-awesome-icon`)
• Tables & Lists: `@tanstack/vue-table` integrated into `DataTable.vue` component
• Forms & Validation: `vee-validate@^4`, `@vee-validate/rules`, local `src/validation.ts`
• Charts: ApexCharts (`vue3-apexcharts`)
• Realtime: SignalR client (`@microsoft/signalr`), Vuex plugin `src/store/plugins/signalr.ts`
• Utilities: `clsx` + `tailwind-merge` via `src/lib/utils.ts`
• Testing: Vitest (happy-dom), Cypress (component tests)

—

2) Build & Config
• Vite: Vue plugin + `vite-plugin-html-env`; alias `@` → `src`
• TypeScript: strict, path alias `@/*`
• Tailwind: dark mode class, extended tokens mapped to CSS variables
• Component Registry: `components.json` (shadcn-vue setup)

—

3) Global Components and Directives
Define in `src/global-components.ts` and registered in `src/main.ts`.

• ALP commons (namespaced with `alp-*`):
  • Buttons/Badges: `alp-button`, `alp-button-with-text`, `alp-default-badge`
  • Containers/Layout: `alp-container`, `alp-section`, `alp-divider`, `alp-table`, `alp-infinite-table`, `alp-infinite-container`, `alp-menu-container`, `table-layout-container`
  • Data/Status: `alp-empty`, `alp-loader`, `alp-icon`, `alp-heading`, `alp-paginator`
  • Permissions: `alp-can`, `alp-can-all`, `alp-can-any`
  • Forms: `alp-form-container`, `alp-form-divider`, `date-field`
  • Inputs: `inline-text-area`, `text-area`, `inline-shad-input`

• shadcn-vue globals (namespaced with `shad-*`):
  • Form: `shad-form`, `shad-form-*`, `shad-input`, `shad-select*`, `shad-checkbox`, `shad-label`, `shad-switch`, `shad-calendar`
  • Content: `shad-card*`, `shad-badge`, `shad-avatar*`
  • Overlays: `shad-dialog*`, `shad-popover*`, `shad-dropdown-menu*`, `shad-sheet*`, `shad-toaster`
  • Navigation/Utility: `shad-command*`, `shad-button`, `shad-data-table`

• Icons: `iconify-icon`
• Directive: `v-columns-resizable` via `registerResizableTable` for resizable table headers

—

4) Routing & Permissions
• Router: `src/router/index.ts`, lazy-loaded views; `meta.requiresAuth`, `meta.permissions`
• Auth check: beforeEach guard consults Vuex `auth` module; redirects to `/login`
• Permission checks: `useCan()` composable wrapping Vuex `permissions` getters; `no-permission` route
• App shell: `@/components/ui/layout/framework/LayoutFramework.vue` under `/app`

—

5) State Management (Vuex)
• Modular store `src/store/index.ts` with feature modules (auth, permissions, users, matters, invoices, projects, notifications, metabase, sharepoint, etc.)
• SignalR Vuex plugin `src/store/plugins/signalr.ts` auto-subscribes to hub events and dispatches refresh actions on server events

—

 

6) Data Access & API Contracts
• NSwag configs: `reference/ALP/ALP/App/nswag/*.config.nswag` and helper `authorised-api-base.ts`
• API base URL: `import.meta.env.VITE_APP_API_ROOT`
• Patterns:
  • Prefer generated clients/types from Swagger/NSwag where available
  • For prototypes, MSW handlers should mirror ALP endpoints and payload shapes; align field names/types/enums with ALP schema

—

7) Tables & Filters Pattern
• `src/components/common/layout/DataTable/DataTable.vue` encapsulates TanStack Table with:
  • Built-in search input, faceted filters (single/multi), column visibility menu
  • Pagination controls and per-page selector
  • Row selection with event emitters (`selected`, `row-selection-change`)
  • Slots: `icon`, accessor-key slots, `action`, `expanded-row`, `datatablefilter`
• Prototype components should use this component for list views to match behavior

—

8) Forms & Validation Pattern
• Validation rules registered via `src/validation.ts` (`vee-validate` rules + custom: phone, url, distinctEntity)
• Use `shad-form` and `shad-form-*` primitives for consistency

—

9) Realtime & Notifications
• SignalR hub `/notify` with auth token factory; events update Vuex modules and trigger toast notifications via `useNotify`

—

10) Prototype Framework Alignment (Actionable Checklist)
• Use Vue 3 + Vite + TS; alias `@` → `src`
• Include Tailwind config compatible with ALP tokens and classes
• Register the same global components and directive names used by ALP where applicable
• Provide `DataTable` wrapper with identical prop/event/slot API
• Wire `vee-validate` rules from `validation.ts`
• Mirror router auth/permission guards in stories or MSW contexts
• Use Vuex for state; keep components decoupled via composables
• Generate API types via NSwag when possible; otherwise, use ALP models as source of truth for mock payloads
• Respect `VITE_APP_API_ROOT` for real client variants; default to MSW in stories

—

11) Schema & Client Generation (Quickstart)
• OpenAPI/NSwag (preferred when backend available):
  • See `reference/ALP/ALP/App/nswag/*.config.nswag`
  • Generate clients/types and use in adapters and MSW handlers
• EF Core (offline schema):
  • Models: `reference/ALP/ALP.Data/Models/`
  • Config: `reference/ALP/ALP.Data/EntityTypeConfigurations/`
  • Snapshot: `reference/alp-business-logic/ALP_Database_Structure.sql`

—

12) Suggested Prototype Folder Structure (mirroring ALP)
src/
  components/
    common/ (alp-* wrappers where useful)
    data-table/ (ported DataTable)
    forms/
    inputs/
  lib/
    registry/new-york/ui/* (shadcn-vue)
    utils.ts
  adapters/ (typed fetch + MSW handlers)
  router/ (if routing is demoed in stories)
  store/ (Vuex modules and composables)
  assets/

—

13) Environment & Scripts
• Dev server: `vite --port 8080`
• Tests: vitest (happy-dom) and cypress component runner

References
• `reference/ALP/ALP/App/package.json`
• `reference/ALP/ALP/App/vite.config.ts`, `tailwind.config.js`, `tsconfig.json`
• `reference/ALP/ALP/App/src/main.ts`, `global-components.ts`, `router/index.ts`, `store/index.ts`
• `reference/ALP/ALP/App/src/components/common/layout/DataTable/DataTable.vue`
• `reference/ALP/ALP/App/nswag/*`


