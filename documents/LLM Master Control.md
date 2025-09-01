LLM Master Control

Purpose: A single orchestration document to tell the LLM what to read, in what order, and what outputs to produce at each step of the prototype process.

Start in `START HERE.md`, then for any prototype (e.g., `prototypes/draft-time-entries`), follow these steps:

1) Read & Context
- Read PRD in the prototype folder (e.g., `ALP_Time_Entry_Automation_PRD.md`).
- Read `documents/Prototype Project Process.md` and `documents/templates/Prototype Process Checklist.md`.
- Read integration references: `documents/ALP Frontend Integration Summary.md`, `documents/UI Prototyping Framework.md`.
- Read environment guides: `documents/Prototyping Environment and Project Structure.md`, `documents/Environment Validation Checklist.md`.

2) Plan
- Produce: user stories with acceptance criteria, component inventory, data model mapping (fields aligned to ALP), contracts plan (NSwag or manual types).

3) Implement
- Build components and stories covering required states; adhere to `Conventions and Naming.md`, `Adapter Patterns.md`, `MSW and Data Contracts Guide.md`.
- Validate with `Accessibility Checklist.md` and `Visual Regression Guide.md`.

4) Handoff
- Complete `documents/templates/Component Handoff Template.md` per component.
- Update prototype README with links to artifacts and screenshots.

5) Output expectations (per step)
- Step 2: Markdown files for stories, IA/data model, component list.
- Step 3: Code edits for components, adapters, handlers, and stories.
- Step 4: Completed handoff template and screenshots.


