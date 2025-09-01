export interface TimeEntry {
  id: string
  date: string
  matter?: string
  matterComponent?: string
  description: string
  minutes: number
  units?: number
  hours?: number
  status: 'draft' | 'ignored' | 'complete'
  rate?: number
  gstType?: 'Gst' | 'GstExport' | 'GstBasExclude'
  billableType?: 'Billable' | 'NonBillable' | 'NonChargeable' | 'ProBono'
  entryType?: 'Sales' | 'MatterComponent'
  invoiceId?: string
  userId?: number
  calendarEventId?: string
  matterId?: number
  matterOutcomeId?: number
  sourceType?: 'Calendar' | 'Email' | 'Timer' | 'API'
  isMerged?: boolean
}

export interface ConfirmDraftInput {
  userId: number
  date: string | Date
  durationMinutes: number
  description: string
  calendarEventId?: string
  matterId?: number
  matterComponentId?: number
  matterOutcomeId?: number
}

export interface TimeEntryPayload {
  userId: number
  date: string
  units: number
  description: string
  calendarEventId?: string
}
