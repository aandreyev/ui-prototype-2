Environment Validation Checklist

Stack parity with ALP
- [ ] Vue 3 + Vite present and versions acceptable
- [ ] Tailwind config loaded; tokens/variables available
- [ ] shadcn-vue registry or equivalent available (if needed)
- [ ] Vuex store available for stories that need it

Storybook & MSW
- [ ] Storybook runs locally (`yarn dev`)
- [ ] MSW handlers wired for prototypes needing data

Build & Tests
- [ ] Vite build completes
- [ ] Visual tests (optional) runnable

Paths & Aliases
- [ ] `@` → `src` works
- [ ] `@shared` → `shared` works

API / Contracts (when needed)
- [ ] `VITE_APP_API_ROOT` set for real client testing
- [ ] NSwag/OpenAPI generation path validated (if generating types)


