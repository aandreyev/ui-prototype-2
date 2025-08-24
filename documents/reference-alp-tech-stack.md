# Reference: ALP Application Tech Stack

This document summarizes the observed technology stack of the `ALP` reference application (frontend to backend) based on the checked in submodule snapshot. It is used only for architectural inspiration; do not copy code verbatim.

---

## High-Level Architecture

A full-stack web application composed of:

- **Backend**: ASP.NET Core (net8.0 target) multi-project solution (`ALP`, `ALP.Data`, `ALP.Services`, `ALP.Import`, `ALP.Tests`).
- **Frontend SPA**: Vue 3 + TypeScript built with Vite, served via ASP.NET Core SPA static file middleware on publish.
- **Real-time Communication**: SignalR hub (`/notify`) consumed by Vuex plugin for live updates.
- **Data Layer**: Entity Framework Core (PostgreSQL provider + naming conventions) with migrations under `ALP.Data`.
- **Background Jobs**: Hangfire with PostgreSQL storage (conditional enabling via configuration) for recurring jobs and scheduled tasks.
- **Authentication & Authorization**: JWT bearer auth + Microsoft identity integrations (Azure AD / Microsoft Account), plus custom policies and IdentityModel usage. Combines both `System.Text.Json` and `Newtonsoft.Json` serialization.
- **External Integrations**: Xero (accounting), SendGrid (email), Azure Blob Storage, Microsoft Graph, ActiveCampaign, PDF generation libraries, etc.
- **API Documentation**: Swagger (multiple groupings: accounts, crm, documents, matters, offerings, projects, common, webhooks) with custom operation id & enum filters.
- **CI/Dev Experience**: Node/Yarn invoked during .NET build for SPA asset compilation. Vite dev server used locally (ports 8080 / 5173). Tests present for .NET (`ALP.Tests`) and front-end (Vitest + Cypress scripts available).

---

## Backend Stack Details

- **Runtime / Framework**: .NET 8 (TargetFramework `net8.0`).
- **Web Host**: Traditional Program + Startup pattern (`Program.CreateHostBuilder` -> `Startup`).
- **Primary Packages**:
  - Web & Auth: `Microsoft.AspNetCore.Authentication.JwtBearer`, Cookie, MicrosoftAccount, OpenIdConnect.
  - Data: `Microsoft.EntityFrameworkCore`, `Npgsql.EntityFrameworkCore.PostgreSQL`, `EFCore.NamingConventions`, `Z.EntityFramework.Plus.EFCore`.
  - Auto-mapping: `AutoMapper` + DI extensions.
  - Real-time: `Microsoft.Azure.SignalR` (prod) or local SignalR (dev).
  - Background Jobs: `Hangfire`, `Hangfire.PostgreSql`.
  - API Modeling & Docs: `Swashbuckle.AspNetCore`, `NSwag.Annotations`.
  - Identity & Tokens: `IdentityModel`, `IdentityModel.AspNetCore`, `Microsoft.Identity.Client`, `Duende.IdentityServer.EntityFramework.Storage`.
  - Integrations: `Azure.Storage.Blobs`, `SendGrid`, `Microsoft.Graph`, `Xero.NetStandard.OAuth2`, `ActiveCampaignNet`, `CsvHelper`, `PdfSharpCore`, `QRCoder`.
  - Utilities: `System.Linq.Dynamic.Core`, JSON Patch support, session state.
- **Serialization**: Both System.Text.Json (with enum converters, null ignore) and Newtonsoft.Json (camelCase, ref loop handling) configured.
- **Configuration**: Uses strongly typed binding for Xero config & custom JWT config section.
- **CORS**: Explicit dev origins allowed (ports 8080 and 5173) for SPA dev servers.
- **Hangfire Jobs**: Multiple recurring jobs defined (sync emails, invoices, wiki, project templates, trust/invoice statements, etc.).
- **Security Notes**: JWT validation with short clock skew (1 min), SignalR query token fallback for hub.

---

## Frontend Stack Details

- **Core**: Vue 3 (`vue@^3.4.x`), TypeScript (`typescript@^4.8.x`).
- **Build Tooling**: Vite 5 (with `@vitejs/plugin-vue`) targeting ES2022 builds.
- **State Management**: Vuex 4 with a large modular store and a custom SignalR plugin for real-time subscription & dispatch.
- **Routing**: `vue-router@^4`.
- **UI / Design System**:
  - Tailwind CSS 3 + custom config (CSS variables for theme tokens, dark mode via class, container breakpoints).
  - Radix-inspired component libraries: `radix-vue`, `@headlessui/vue`, `shadcn-vue`, `reka-ui`.
  - Iconography: FontAwesome (`@fortawesome/*`), `@radix-icons/vue`, `@iconify/vue`, `lucide-vue-next`.
  - Animations/utilities: `tailwindcss-animate`, custom keyframes in Tailwind config.
  - Class utilities: `clsx`, `class-variance-authority`, `tailwind-merge`.
- **Forms & Validation**: `vee-validate` + rules + optional Zod integration via `@vee-validate/zod`; date inputs via `flatpickr`, `v-calendar`; phone handling via `libphonenumber-js`.
- **Charts & Visualization**: `apexcharts`, `vue3-apexcharts`, `chart.js` + plugins, `medium-zoom` for images.
- **Tables / Data**: `@tanstack/vue-table` for advanced data grids; custom datatable store modules.
- **Real-time**: `@microsoft/signalr` client tied to store plugin.
- **Rich Text & File Handling**: `tinymce` integration, `pdfjs-dist`, `file-saver` for downloads.
- **Misc Libraries**: `jwt-decode`, `nanoid`, Lodash micro-packages, `fast-json-patch`, `dompurify` (sanitization), `notyf` (notifications), drag & drop via `vuedraggable`.
- **Testing**: `vitest` (unit), `happy-dom` (DOM env), `cypress` (e2e).
- **Env Handling**: `vite-plugin-html-env` for injecting env variables into index HTML.
- **Performance / Optimizations**: `postcss` pipeline with nesting/import; potential purge via Tailwind; alias `@` to `src`.
- **Package Manager**: Yarn 1 (classic) per `packageManager` field.

---

## Dev & Build Integration

- Back-end project defines `SpaRoot` (App/) and invokes `yarn` & `yarn build` during publish target ensuring front-end assets bundled into `App/dist`.
- During debug/build without existing node_modules, the .csproj target installs dependencies.
- SPA static files served via `UseSpaStaticFiles` and `UseSpa` pipeline.
- CORS configured to allow local dev server origins for hot reloading.

---

## Real-time Update Flow

1. User authenticates (Vuex auth module obtains JWT).
2. SignalR plugin builds a hub connection with `accessTokenFactory` referencing store getter.
3. After connection and on certain mutations (projects, matters, invoices, templates, timers) it dynamically subscribes/unsubscribes to entity channels (`prefix:id`).
4. Server hub (`NotificationHub`) pushes events like `ProjectUpdated` triggering targeted Vuex actions to refresh slices.

---

## Observed Domain Modules (Front-end)

Large modular Vuex store: auth, permissions, projects, matters, invoices, documents, notifications, time entries, emails (incoming/outgoing), wiki, risk register, incident log, offerings, contracts, dynamic/entity parameters, calendar, assets, reminders, bug-report, sharepoint, metabase, project templates, etc.

---

## Notable Architectural Practices

- Layered .NET solution (Data -> Services -> Web) with AutoMapper bridging domain DTOs.
- Dual JSON serializer strategy for flexibility (System.Text.Json + Newtonsoft).
- Strong emphasis on real-time UX via SignalR and targeted entity-level subscriptions (minimizes over-fetching).
- Centralized store modules reflecting backend bounded contexts.
- Build orchestration tying front-end asset pipeline into .NET publish process, enabling single deployment artifact.
- Extensive 3rd-party integrations (finance, communication, authentication, doc management) indicating micro-integrations rather than microservices.

---

## Potential Migration Insights (For Prototyping Framework)

- Consider adopting entity-channel subscription pattern in future prototypes (abstract behind an adapter interface thus testable in isolation).
- Tailwind + CSS variable theming pattern aligns with design token approach in our framework spec.
- Use of modular store suggests designing adapter slices with clear event triggers for Storybook/MSW scenarios.

---

## Gaps / Unknowns

- CI configuration and infrastructure scripts not inspected (no Dockerfiles found in scanned paths).
- Specific database schema and migration scripts not enumerated here; would require deeper dive into `Migrations/`.
- Authentication flows (token acquisition) code not reviewed in this summary.

---

## Summary Table

| Layer | Technology |
|-------|------------|
| Frontend | Vue 3, TypeScript, Vite, Tailwind CSS, Vuex, vue-router, Radix/HeadlessUI/shadcn-vue, ApexCharts/Chart.js, Vee-Validate, SignalR client |
| Backend | ASP.NET Core (.NET 8), EF Core (PostgreSQL), AutoMapper, Hangfire, SignalR, Swagger/NSwag, JWT Auth + Microsoft Identity, Background jobs |
| Integrations | Azure Blob Storage, SendGrid, Xero, ActiveCampaign, Microsoft Graph, PDF generation (PdfSharp), Email (jobs), QR codes |
| Tooling | Yarn 1, Vitest, Cypress, Vite, PostCSS, Tailwind, Swagger UI |
| Real-time | SignalR hub `/notify` + Vuex plugin |

---

*Generated automatically; update manually if deeper exploration uncovers additional stack components.*
