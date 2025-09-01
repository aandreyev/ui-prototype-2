Prototype Project Process

Use this standardized flow for every prototype (e.g., `prototypes/draft-time-entries`). Keep artifacts in the prototype folder and link them from the prototype README. Entry point: `START HERE.md`.

1) Intake & Alignment
- Read order (LLM): PRD → LLM Master Control → Process Checklist → Integration Summary → UI Prototyping Framework → Environment Validation Checklist
- Review PRD and stakeholders
- Define scope boundaries and success criteria
- Identify data contracts and permissions (link to ALP schema sources)

2) User Stories & Flows
- Write user stories with acceptance criteria
- Map primary flows (list, detail, create/edit), empty/error/permission states

3) Information Architecture & Data Model
- Identify entities, key fields, and relationships used by the UI
- Confirm field names/types against ALP schema (models/OpenAPI/SQL snapshot)

4) Component Inventory
- List needed components (atoms → composite), reuse first (from existing prototypes/ALP)
- Note emits, props, and events per component following conventions

5) Contracts & MSW
- Define request/response types (or generate from NSwag)
- Implement MSW handlers with realistic data and error catalog
 - Check: Environment Validation Checklist items for MSW/aliases

6) Build & Stories
- Implement components with states: Default, Loading, Empty, Error, Permission, LongContent
- Add Storybook stories; wire a11y decorators; import shared styles/tokens

7) Validation & Tests
- Run axe checks on key stories
- Add visual snapshots for important states
 - Confirm environment parity using Environment Validation Checklist
 - Complete per‑project Accessibility Checklist (copy from `documents/templates/Accessibility Checklist.md`)
 - Follow `Visual Regression Guide.md` for snapshot stability (fonts, time, randomness, masks)

8) Handoff Package
- Complete Component Handoff Template
- Capture screenshots, integration notes (routes, permissions, events)
 - Attach completed Accessibility Checklist

9) Review & Sign‑off
- Demo to stakeholders; accept or iterate next version


