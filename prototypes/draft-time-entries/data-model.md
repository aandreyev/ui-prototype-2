# Data Model Mapping — Draft Time Entries

Reference: `reference/ALP/ALP.Data/Models/TimeTracking/TimeEntry/TimeEntry.cs`, `reference/ALP/ALP.Data/Models/TimeTracking/Timers/Timer.cs`, and `reference/alp-business-logic/ALP_Time_Tracking.md`.

## DraftTimeEntry (prototype view model)
- id: string
- date: string (ISO)
- sourceType: 'Calendar' | 'Email' | 'Timer' | 'API'
- matterId?: number
- matterComponentId?: number
- matterOutcomeId?: number
- description?: string
- status: 'draft' | 'ignored' | 'complete' | 'confirmed'
- isMergedEntry: boolean
- durationMinutes: number (UI only; see Units mapping)

## TimeEntry (ALP model — for confirmation payload)
- userId: number
- date: string (ISO) — maps to `TimeEntry.Date`
- units: number — 6‑minute units; maps to `TimeEntry.Units`
- description: string — maps to `TimeEntry.Description`
- calendarEventId?: string — maps to `TimeEntry.CalendarEventId`
- matterId?: number — downstream association (via service layer)
- matterComponentId?: number (optional)
- matterOutcomeId?: number (optional)

## Minutes ⇄ Units mapping
- UI collects minutes for usability (durationMinutes)
- Adapter converts: `units = Math.ceil(durationMinutes / 6)`
- When loading existing entries, `durationMinutes = units * 6`

## List Display Fields (per PRD)
- date/time
- source (Calendar/Email/Timer/API)
- duration (minutes; derived from units)
- detected matter (if any)
- description preview
- status indicator
- merge indicator

## Filters/Sort
- by date, source, matter, status, merge
