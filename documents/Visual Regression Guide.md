Visual Regression Guide

1) What to Snapshot
- Storybook stories for deterministic UI states
- Key pages for integration sanity (optional)

2) Running
```bash
npx playwright test
```
To accept changes:
```bash
npx playwright test --update-snapshots
```

3) Stability
- Disable animations and carets
- Freeze time and seed randomness
- Use self-hosted fonts; consistent deviceScaleFactor
- Mask dynamic regions in screenshots

4) CI
- Build Storybook, run story shots, upload `tests/__output__` artifacts


