Prototype Setup Guide (Deprecated)

Note: Use `START HERE.md` and the scaffold script `scripts/new-prototype.sh` instead. This guide is retained for reference only.

1) Prereqs
• Node 18+
• Yarn 1.x or npm
• Optional: Playwright (for visual diffs)

2) Install
```bash
yarn install
```

3) Scripts
• Dev Storybook (recommended for prototyping):
```bash
yarn storybook
```
• Vite dev (if previewing pages):
```bash
yarn serve
```
• Build:
```bash
yarn build
```
• Tests:
```bash
yarn test
```

4) Environment
• `VITE_APP_API_ROOT` (URL of ALP API) – optional when using real clients; prototypes default to MSW.

5) MSW
• Start MSW in Storybook preview; use handlers under `mocks/` mirroring ALP endpoints and field names.

6) Tailwind & Tokens
• Tokens mapped to CSS variables via Tailwind config; avoid ad‑hoc colors/sizes.

7) Vuex
• Provide a minimal Vuex store for stories that require auth/permissions; prefer composables to read store state.

8) Visual Diffs (optional)
• Install Playwright; run snapshot tests under `tests/visual/`.


