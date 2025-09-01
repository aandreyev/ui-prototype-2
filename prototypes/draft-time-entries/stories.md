# User Stories & Acceptance Criteria — Draft Time Entries

## Fee Earner
- As a fee earner, I want calendar meetings with matter references (e.g., [12345]) to create draft entries so I don’t miss time.
  - Given a calendar event subject containing [12345]
  - When drafts are synced
  - Then a draft appears with date/time, duration, source=Calendar, detected matter 12345

- As a fee earner, I want to review and confirm complete drafts quickly.
  - Given a draft with required fields (date/time, duration, matter, description)
  - When I click Confirm
  - Then it converts to a formal time entry and disappears from drafts

- As a fee earner, I want to ignore irrelevant drafts so they don’t reappear.
  - Given an irrelevant draft
  - When I click Ignore
  - Then it is marked ignored and moves to ignore list below, with edit button still available

- As a fee earner, I want to bulk merge related drafts with an AI-suggested description.
  - Given multiple related drafts (same matter / time proximity)
  - When I select them and Merge
  - Then I see a merged preview with summed duration and AI description, which I can edit and save as a draft

- As a fee earner, I want AI suggestions for descriptions when a matter is detected.
  - Given a draft with a detected matter
  - When AI suggestion is available
  - Then a policy-compliant description is proposed and editable

## Administrative Staff
- As admin staff, I want to monitor drafts across fee earners to ensure coverage.
  - Given filter controls by user, status, source, date
  - When applied
  - Then the list updates accordingly

- As admin staff, I want to configure capture rules (firm defaults) for sources.
  - Given the admin settings page
  - When I change criteria (e.g., require brackets in subject)
  - Then sync uses the updated criteria and persists settings

## Performance & UX
- List view paginates/virtualizes for >100 rows.
- All actions provide immediate feedback; sync shows progress.

## Accessibility
- Full keyboard support for selection, merge, confirm, ignore; dialogs have proper roles and focus management.
