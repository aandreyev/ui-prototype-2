Adapter Patterns

1) Structure
adapters/<feature>/
- index.ts: exported functions (list, get, create, update, delete)
- types.ts: request/response, filters, errors
- msw.ts: handlers + seeds
- client.ts: real fetch/axios (integration team)

2) Guidelines
- No direct fetch in components; call adapter functions
- Always type inputs/outputs; avoid `any`
- Keep pagination/filter shapes consistent across features

3) Errors
- Throw typed errors with `{ code, message }`; align to MSW catalog

4) Switching MSW ↔ real client
- Export identical function signatures from `index.ts`
- Use an environment flag or injected client to swap implementations


