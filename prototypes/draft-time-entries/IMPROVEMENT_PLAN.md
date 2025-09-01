# Draft Time Entries - Improvement Plan

## 🚨 Critical Issues (Must Fix)

### 1. Missing Core PRD Features
- [ ] **AI Description Service**: Implement AI suggestions for detected matters
- [ ] **Matter Detection**: Parse calendar subjects for `[12345]` format, auto-populate
- [ ] **Source Integration**: Calendar/Email/Timer parsing and sync functionality  
- [ ] **Bulk Merge**: Select multiple entries, generate AI description, create merged draft
- [ ] **Admin Configuration**: Settings form for capture rules, sync thresholds

### 2. Business Logic Corrections
- [ ] **Status Standardization**: Use `draft/ignored/complete` per PRD (not `confirmed`)
- [ ] **Complete State Transitions**: Fix edit modal button logic for all status combinations
- [ ] **Required Field Validation**: Enforce date, description, matter, duration > 0
- [ ] **Duration Handling**: Sync minutes ↔ units conversion in modal

### 3. Technical Architecture
- [ ] **Vuex Store Module**: Replace ref() state with proper Vuex module
- [ ] **Error Boundaries**: Add loading, error, empty states throughout
- [ ] **Type Safety**: Complete TypeScript interfaces for all API contracts
- [ ] **MSW Simulation**: Implement realistic backend behavior in handlers

## 🔧 Implementation Priority

### Phase 1: Core Functionality (Week 1)
1. **Fix Status System**: Update all components to use `draft/ignored/complete`
2. **Add Validation**: Implement vee-validate rules matching ALP patterns
3. **State Management**: Create proper Vuex module for time entries
4. **Matter Detection**: Mock calendar parsing with `[12345]` extraction

### Phase 2: AI & Bulk Operations (Week 2)  
1. **AI Service**: Mock AI description generation endpoint
2. **Bulk Selection**: Implement proper multi-select with toolbar
3. **Merge Functionality**: Create merge preview modal with AI descriptions
4. **Source Simulation**: Mock calendar/email/timer data sources

### Phase 3: Admin & Polish (Week 3)
1. **Admin Settings**: Complete configuration form with validation
2. **Error Handling**: Add comprehensive error states and messaging
3. **Performance**: Implement virtualization for large lists
4. **Testing**: Complete a11y, visual regression, unit test coverage

## 🎯 Success Criteria
- [ ] All PRD user stories have working implementations
- [ ] Edit modal matches ALP validation patterns exactly
- [ ] Bulk operations work with proper feedback
- [ ] AI descriptions generate for detected matters
- [ ] Admin can configure all capture rules
- [ ] 100% TypeScript coverage with proper types
- [ ] All accessibility checks pass
- [ ] Visual regression tests capture key flows

## 📊 Current vs Target State

| Feature | Current | Target | Gap |
|---------|---------|--------|-----|
| Status System | `confirmed` | `complete` | Wrong enum |
| Validation | None | Full vee-validate | Missing |
| State Mgmt | ref() | Vuex module | Wrong pattern |
| AI Suggestions | Missing | Mock service | Not implemented |
| Bulk Operations | Basic checkboxes | Full workflow | Incomplete |
| Matter Detection | Manual | Auto from `[12345]` | Missing |
| Error Handling | None | Comprehensive | Missing |
| Testing | Placeholders | Full coverage | Incomplete |

## 🚀 Quick Wins (Can implement today)
1. Fix status enum throughout codebase
2. Add proper validation rules to edit modal  
3. Move bulk actions toolbar above table
4. Implement proper loading/error states
5. Add matter detection regex for calendar subjects
