Vuex Usage Notes

1) Modules
- Follow ALP pattern: feature-scoped modules with namespaced getters/actions/mutations
- Keep component logic thin; use actions for side effects

2) Composables
- Wrap common access in composables (e.g., `useCan`) that call Vuex getters

3) Testing
- Provide a minimal store in stories/tests; mock getters/actions as needed

4) Realtime
- If required, simulate via MSW or events; connect SignalR only in integration contexts


