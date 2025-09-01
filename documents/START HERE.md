START HERE — Prototyping Framework

Audience: Anyone creating a new prototype under `prototypes/`.

1) Create prototype (automated)
- Run: `scripts/new-prototype.sh <name> <PRD_FILENAME>`
- This creates `prototypes/<name>/` with CONTROL.md, PROCESS-CHECKLIST.md, ACCESSIBILITY-CHECKLIST.md, README.md, and the scaffold (Vite + Storybook + Tailwind).
- Place your PRD in the folder first or update CONTROL.md after.
 - Optional: copy `documents/templates/New Prototype Checklist.md` into the prototype for kickoff tracking.

2) Validate environment
- Ensure shared imports work: `@shared` and `../../../shared/styles/globals.css` in `.storybook/preview.ts`.
- Complete `Environment Validation Checklist.md`.

3) Follow CONTROL.md
- CONTROL.md defines the read order and required outputs:
  - Read PRD → Master Control → Process → Checklist → Integration Summary → UI Framework → Environment Checklist
  - Produce user stories, component inventory, data model mapping, contracts plan
  - Implement components, adapters, MSW, stories
  - Complete handoff template and export screenshots

4) Use these core references
- Prototype Project Process.md (step-by-step flow)
- LLM Master Control.md (what to read and when)
- ALP Frontend Integration Summary.md (stack & conventions)
- UI Prototyping Framework.md (states, MSW, handoff)
- Conventions and Naming.md, Adapter Patterns.md, MSW and Data Contracts Guide.md
- Accessibility Checklist.md, Visual Regression Guide.md, Vuex Usage Notes.md

5) Sign-off & handoff
- Ensure PROCESS-CHECKLIST.md is complete
- Handoff package per Component Handoff Template


