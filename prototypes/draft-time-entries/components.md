# Component Inventory — Draft Time Entries

## TimeEntriesList
- Purpose: List and manage draft time entries (review, select, bulk actions)
- Props:
  - entries: Array<TimeEntry>
  - pageSize?: number
- Emits:
  - selected(id: string)
  - deleted(id: string)
  - load-more(page: number, size: number)
  - bulk-selected(ids: string[])
- Slots: N/A (initial)
- States: Loading, Empty, Error (story coverage)

## TimeEntryRow (future)
- Props: entry: TimeEntry
- Emits: selected(id), deleted(id)

## MergePreviewModal (future)
- Props: selectedEntries: TimeEntry[]
- Emits: close(), saved(mergedDraftId)

## AdminSettingsForm (future)
- Props: settings, defaults
- Emits: saved(settings)

## Types
- TimeEntry: { id, date, matter, description, hours, status, source }
