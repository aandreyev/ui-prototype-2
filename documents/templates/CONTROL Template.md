Project Control (LLM‑Guided) — Template

Replace <PROTOTYPE_NAME> and <PRD_FILENAME> after copying into `prototypes/<PROTOTYPE_NAME>/CONTROL.md`.

Read order
1) PRD: `<PRD_FILENAME>`
2) `../../documents/LLM Master Control.md`
3) `../../documents/Prototype Project Process.md`
4) `../../documents/templates/Prototype Process Checklist.md`
5) Integration: `../../documents/ALP Frontend Integration Summary.md`, `../../documents/UI Prototyping Framework.md`
6) Environment: `../../documents/Environment Validation Checklist.md`
 7) Conventions & Naming: `../../documents/Conventions and Naming.md`
 8) Data & Adapters: `../../documents/Adapter Patterns.md`, `../../documents/MSW and Data Contracts Guide.md`, `../../documents/Vuex Usage Notes.md`

Outputs required
- User stories + acceptance criteria (commit as `stories.md`)
- Component inventory (commit as `components.md`)
- Data model mapping (commit as `data-model.md`)
- Contracts plan (commit as `contracts.md`)
- Then code: components, adapters, MSW, stories
- Handoff: complete `documents/templates/Component Handoff Template.md` and export screenshots

Notes
- Use Vuex patterns from Integration Summary; align field names with ALP schema
- Keep emits aligned to ALP conventions (e.g., `selected`, `selected-range`, `load-more`)

