# Technical Design — Draft Time Entries

## Scope
Implement the Draft Time Entries flow per PRD with explicit business rules for states and actions across Draft, Ignored, and Confirmed lists, and a standard Edit Time Entry modal.

## Entities (UI view models)
- DraftTimeEntry { id, date, minutes, matter, description, status: 'draft'|'ignored'|'confirmed', sourceType?, matterId?, outcomeId?, componentId? }
- TimeEntryPayload (confirm): { userId, date (ISO), units, description, calendarEventId? }

## Minutes ↔ Units
- UI collects minutes; convert to ALP units (6-min) on confirm.
- minutesToUnits = ceil(minutes/6), unitsToMinutes = units*6.

## Lists and Buttons
- Draft list rows: buttons Edit, Ignore, Confirm.
- Ignored list rows: only Edit.
- Confirmed list rows: no buttons.

## Edit Modal
- Opens on Edit from any list.
- Draft status: modal shows Save and Confirm buttons.
  - Save: persist changes, stay in draft.
  - Confirm: persist changes, move to confirmed.
- Ignored status: modal shows Cancel, Save (→Draft), Confirm (→Confirmed), and Ignore (→Ignored; remains ignored).
  - Save: move to Draft (status=draft).
  - Confirm: move to Confirmed.
  - Ignore: remains Ignored with updated data.
- Confirmed entries are not editable (no entry point from UI).

## State Transitions
- Draft → Ignore: via Ignore button on row.
- Draft → Confirmed: via Confirm button on row or modal Confirm.
- Draft (Edit modal) → Draft: Save.
- Ignored → Draft: Edit modal Save.
- Ignored → Ignored: Edit modal Ignore.
- Ignored → Confirmed: Edit modal Confirm.

## API/Adapters & MSW
- GET /api/draft-time-entries
- POST /api/draft-time-entries/sync
- POST /api/draft-time-entries/:id/confirm (convert minutes→units)
- POST /api/draft-time-entries/:id/ignore
- Later: PUT /api/draft-time-entries/:id for edits; in prototype we mutate local state in stories.

## Components
- TimeEntriesList.vue: displays entries with conditional buttons by status; emits edit/ignore/confirm.
- EditTimeEntryModal.vue: lightweight modal with form fields and Save/Confirm/Cancel/Ignore (for ignored state) emits.

## Storybook Flows
- Loaded (basic)
- RemovesOnConfirm (row confirm removal)
- WithEditModalFlow (draft/ignored/confirmed lists with modal transitions)

## A11y & Visuals
- Keyboard support: tab focus on row buttons; modal focus trap (future improvement); visible focus ring.
- Visual snapshots: TimeEntries stories per Visual Regression Guide.

## Open Items / Next Iterations
- Port ALP EditTimeEntry modal fields/validation fully.
- Wire MSW updates for Save/Confirm/Ignore vs local state.
- Add filters/sorting and bulk actions per PRD.
