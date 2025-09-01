import { minutesToUnits, unitsToMinutes } from '../lib/time'

export type ConfirmDraftInput = {
  userId: number
  date: string | Date
  durationMinutes: number
  description: string
  calendarEventId?: string
  matterId?: number
  matterComponentId?: number
  matterOutcomeId?: number
}

export type TimeEntryPayload = {
  userId: number
  date: string
  units: number
  description: string
  calendarEventId?: string
}

export function buildTimeEntryPayload(input: ConfirmDraftInput): TimeEntryPayload {
  const units = minutesToUnits(input.durationMinutes)
  const dateStr = typeof input.date === 'string' ? input.date : input.date.toISOString()
  return {
    userId: input.userId,
    date: dateStr,
    units,
    description: input.description?.trim() ?? '',
    calendarEventId: input.calendarEventId,
  }
}

export function deriveUiDurationFromUnits(units: number): number {
  return unitsToMinutes(units)
}
