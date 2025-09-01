# Prototype: Users Table

## Overview
- Feature: Users listing table with search and pagination
- Emits: `selected`, `deleted`, `load-more`

## Run
```bash
yarn install
yarn dev
```

## Contents
- Component: `src/components/UsersTable.vue`
- Story: `src/stories/UsersTable.stories.ts`
- Types: `src/adapters/users/types.ts`
- MSW: `src/adapters/users/msw.ts`, `mocks/handlers.ts`

## Integration Notes
- Mount point: Users list
- Permissions: n/a in prototype
- Events: parent listens to `selected(userId)` and `deleted(userId)`

## Handoff
- See `documents/templates/Component Handoff Template.md`

