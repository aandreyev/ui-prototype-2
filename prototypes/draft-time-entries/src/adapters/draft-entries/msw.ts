import { http, HttpResponse } from 'msw'
import { minutesToUnits } from '../../lib/time'

export type DraftTimeEntryDto = {
  id: string
  date: string
  durationMinutes: number
  sourceType: 'Calendar' | 'Email' | 'Timer' | 'API'
  matterId?: number
  matterComponentId?: number
  matterOutcomeId?: number
  description?: string
  status: 'draft' | 'ignored' | 'complete' | 'confirmed'
  isMergedEntry: boolean
}

let seed: DraftTimeEntryDto[] = [
  { id: 'd1', date: '2025-01-01T09:00:00.000Z', durationMinutes: 30, sourceType: 'Calendar', matterId: 12345, description: 'Client meeting', status: 'draft', isMergedEntry: false },
  { id: 'd2', date: '2025-01-01T11:00:00.000Z', durationMinutes: 15, sourceType: 'Email', description: 'Draft email to client', status: 'draft', isMergedEntry: false },
  { id: 'd3', date: '2025-01-02T10:30:00.000Z', durationMinutes: 60, sourceType: 'Timer', description: 'Research', status: 'draft', isMergedEntry: false },
]

export const draftEntriesHandlers = [
  http.get('/api/draft-time-entries', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    const page = Number(url.searchParams.get('page') || '1')
    const size = Number(url.searchParams.get('size') || '10')
    const filtered = q
      ? seed.filter(d => [d.description, String(d.matterId), d.sourceType, d.status].some(v => (v || '').toString().toLowerCase().includes(q)))
      : seed
    const start = (page - 1) * size
    return HttpResponse.json({ items: filtered.slice(start, start + size), total: filtered.length })
  }),

  http.post('/api/draft-time-entries/sync', async () => {
    // For prototype: return existing seed
    return HttpResponse.json({ items: seed, total: seed.length })
  }),

  http.post('/api/draft-time-entries/:id/confirm', async ({ params }) => {
    const id = params.id as string
    const entry = seed.find(d => d.id === id)
    if (!entry) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 })
    entry.status = 'confirmed'
    // In real impl, convert to TimeEntry with units
    const units = minutesToUnits(entry.durationMinutes)
    return HttpResponse.json({ ok: true, timeEntry: { date: entry.date, units } })
  }),

  http.post('/api/draft-time-entries/:id/ignore', async ({ params }) => {
    const id = params.id as string
    const entry = seed.find(d => d.id === id)
    if (!entry) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 })
    entry.status = 'ignored'
    return HttpResponse.json({ ok: true })
  }),
]
