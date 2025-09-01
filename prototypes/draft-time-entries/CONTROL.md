Project Control (LLM‑Guided)

Read order
1) PRD: `ALP_Time_Entry_Automation_PRD.md`
2) `../../documents/LLM Master Control.md`
3) `../../documents/Prototype Project Process.md`
4) `../../documents/templates/Prototype Process Checklist.md`
5) Integration: `../../documents/ALP Frontend Integration Summary.md` and `../../documents/UI Prototyping Framework.md`
6) Environment: `../../documents/Environment Validation Checklist.md`

Outputs required
- User stories + acceptance criteria (commit as `stories.md`)
- Component inventory (commit as `components.md`)
- Data model mapping (commit as `data-model.md`)
- Contracts plan (commit as `contracts.md`)
- Then code: components, adapters, MSW, stories
- Handoff: complete template and export screenshots

Notes
- Use Vuex patterns from Integration Summary; align field names with ALP schema
- Keep emits in ALP style (e.g., `selected`, `selected-range`, `load-more`)

