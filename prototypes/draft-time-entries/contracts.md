# Contracts & MSW Plan — Draft Time Entries

## Endpoints (prototype)
- GET /api/draft-time-entries?q=&page=&size=&source=&status=
- PUT /api/draft-time-entries/{id}
- POST /api/draft-time-entries/{id}/confirm
- POST /api/draft-time-entries/{id}/ignore
- POST /api/draft-time-entries/bulk-action (ignore/merge)
- POST /api/draft-time-entries/merge (ids: string[])
- POST /api/draft-time-entries/sync (all sources)
- POST /api/draft-time-entries/sync/{source}

## Types (prototype)
- DraftTimeEntryDto { id, date, durationMinutes, sourceType, matterId?, componentId?, outcomeId?, description?, status, isMergedEntry }
- DraftTimeEntriesResponse { items: DraftTimeEntryDto[], total: number }

## MSW Handlers
- GET /api/draft-time-entries → filter, paginate, return items
- POST /api/draft-time-entries/sync → return updated items
- POST /api/draft-time-entries/merge → returns merged draft
- POST /api/draft-time-entries/{id}/confirm → 200, removes from list
- POST /api/draft-time-entries/{id}/ignore → 200, sets status=ignored

## Error Catalog
- 401 AUTH_REQUIRED
- 403 FORBIDDEN
- 404 NOT_FOUND
- 409 CONFLICT
- 422 VALIDATION
- 500 SERVER_ERROR
