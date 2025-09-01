// If types are still missing after install, adjust
// import type { Meta, StoryObj } from '@storybook/vue3-vite'  // Comment if error persists

// Use any for now as fallback
type Meta<T> = any
type StoryObj<T> = any

import { ref } from 'vue'
import TimeEntriesList from '../components/TimeEntriesList.vue'
import EditTimeEntryModal from '../components/modals/EditTimeEntryModal.vue'

// Remove vuex and composable for now to unblock
// import { createStore } from 'vuex'
// import useTimeEntryState from '../composables/useTimeEntryState'
// const store = createStore({ state: { /* mock state */ } })

const meta: Meta<typeof TimeEntriesList> = {
  title: 'TimeEntries/List',
  component: TimeEntriesList,
}

export default meta

type Story = StoryObj<typeof TimeEntriesList>

export const Loaded: Story = {
  render: () => ({
    components: { TimeEntriesList },
    setup() {
      const entries = ref([
        { id: 't1', date: '2025-01-01', matter: 'Matter A', description: 'Research and drafting', minutes: 150, status: 'draft' },
        { id: 't2', date: '2025-01-02', matter: 'Matter B', description: 'Client call', minutes: 60, status: 'draft' },
        { id: 't3', date: '2025-01-03', matter: 'Matter A', description: 'Court filing', minutes: 30, status: 'draft' },
      ])
      function onComplete(entry: any) {
        const idx = entries.value.findIndex(e => e.id === entry.id)
        if (idx >= 0) entries.value[idx] = { ...entries.value[idx], status: 'complete' }
      }
      function onIgnore(entry: any) {
        const idx = entries.value.findIndex(e => e.id === entry.id)
        if (idx >= 0) entries.value[idx] = { ...entries.value[idx], status: 'ignored' }
      }
      function onBulkAction(action: string, ids: string[]) {
        console.log(`Bulk ${action}:`, ids)
        if (action === 'complete') {
          entries.value = entries.value.map(e => 
            ids.includes(e.id) ? { ...e, status: 'complete' } : e
          )
        } else if (action === 'ignore') {
          entries.value = entries.value.map(e => 
            ids.includes(e.id) ? { ...e, status: 'ignored' } : e
          )
        }
      }
      return { entries, onComplete, onIgnore, onBulkAction }
    },
    template: '<TimeEntriesList :entries="entries" @complete="onComplete" @ignore="onIgnore" @bulk-action="onBulkAction" />',
  }),
}

export const RemovesOnConfirm: Story = {
  render: () => ({
    components: { TimeEntriesList },
    setup() {
      const entries = ref([
        { id: 't1', date: '2025-01-01', matter: 'Matter A', description: 'Research and drafting', minutes: 150, status: 'draft' },
        { id: 't2', date: '2025-01-02', matter: 'Matter B', description: 'Client call', minutes: 60, status: 'draft' },
        { id: 't3', date: '2025-01-03', matter: 'Matter A', description: 'Court filing', minutes: 30, status: 'draft' },
      ])
      function onComplete(entry: any) {
        entries.value = entries.value.filter(e => e.id !== entry.id)
      }
      function onIgnore(entry: any) {
        const idx = entries.value.findIndex(e => e.id === entry.id)
        if (idx >= 0) entries.value[idx] = { ...entries.value[idx], status: 'ignored' }
      }
      function onBulkAction(action: string, ids: string[]) {
        console.log(`Bulk ${action}:`, ids)
        if (action === 'complete') {
          entries.value = entries.value.filter(e => !ids.includes(e.id))
        } else if (action === 'ignore') {
          entries.value = entries.value.map(e => 
            ids.includes(e.id) ? { ...e, status: 'ignored' } : e
          )
        }
      }
      return { entries, onComplete, onIgnore, onBulkAction }
    },
    template: '<TimeEntriesList :entries="entries" @complete="onComplete" @ignore="onIgnore" @bulk-action="onBulkAction" />',
  }),
}

export const WithEditModalFlow: Story = {
  render: () => ({
    components: { TimeEntriesList, EditTimeEntryModal },
    setup() {
      const drafts = ref([
        { id: 't1', date: '2025-01-01T09:00', matter: 'Matter A', description: 'Research and drafting', minutes: 150, status: 'draft' },
        { id: 't2', date: '2025-01-02T10:00', matter: 'Matter B', description: 'Client call', minutes: 60, status: 'draft' },
      ])
      const ignored = ref<any[]>([])
      const complete = ref<any[]>([])

      const showEdit = ref(false)
      const selected = ref<any | null>(null)

      function openEdit(entry: any) {
        selected.value = { ...entry }
        showEdit.value = true
      }

      function onSave(updated: any) {
        // Save sends back to drafts
        const all = [...drafts.value, ...ignored.value]
        const idx = all.findIndex(e => e.id === updated.id)
        const wasIgnored = ignored.value.some(e => e.id === updated.id)
        if (idx >= 0) {
          if (wasIgnored) ignored.value = ignored.value.filter(e => e.id !== updated.id)
          else drafts.value = drafts.value.filter(e => e.id !== updated.id)
        }
        drafts.value = [{ ...updated, status: 'draft' }, ...drafts.value]
        showEdit.value = false
      }

      function onComplete(updated: any) {
        // Complete moves to complete
        drafts.value = drafts.value.filter(e => e.id !== updated.id)
        ignored.value = ignored.value.filter(e => e.id !== updated.id)
        complete.value = [{ ...updated, status: 'complete' }, ...complete.value]
        showEdit.value = false
      }

      function onIgnore(entry: any) {
        drafts.value = drafts.value.filter(e => e.id !== entry.id)
        ignored.value = [{ ...entry, status: 'ignored' }, ...ignored.value]
      }

      function onRowComplete(entry: any) {
        drafts.value = drafts.value.filter(e => e.id !== entry.id)
        complete.value = [{ ...entry, status: 'complete' }, ...complete.value]
      }
      
      function onBulkAction(action: string, ids: string[]) {
        console.log(`Bulk ${action}:`, ids)
        if (action === 'complete') {
          const selectedEntries = drafts.value.filter(e => ids.includes(e.id))
          drafts.value = drafts.value.filter(e => !ids.includes(e.id))
          complete.value = [...complete.value, ...selectedEntries.map(e => ({ ...e, status: 'complete' }))]
        } else if (action === 'ignore') {
          const selectedEntries = drafts.value.filter(e => ids.includes(e.id))
          drafts.value = drafts.value.filter(e => !ids.includes(e.id))
          ignored.value = [...ignored.value, ...selectedEntries.map(e => ({ ...e, status: 'ignored' }))]
        }
      }

      function onCancel() { showEdit.value = false }

      return { drafts, ignored, complete, showEdit, selected, openEdit, onSave, onComplete, onCancel, onIgnore, onRowComplete, onBulkAction }
    },
    template: `
      <div class="space-y-4">
        <div>
          <div class="text-xs font-medium mb-1">Drafts</div>
          <TimeEntriesList :entries="drafts" @edit="openEdit" @complete="onRowComplete" @ignore="onIgnore" @bulk-action="onBulkAction" />
        </div>
        <div>
          <div class="text-xs font-medium mb-1">Ignored</div>
          <TimeEntriesList :entries="ignored" @edit="openEdit" />
        </div>
        <div>
          <div class="text-xs font-medium mb-1">Complete</div>
          <TimeEntriesList :entries="complete" />
        </div>

        <EditTimeEntryModal :open="showEdit" :entry="selected" :status="selected?.status || 'draft'" @save="onSave" @complete="onComplete" @ignore="onIgnore" @cancel="onCancel" />
      </div>
    `,
  }),
}

export const Empty: Story = {
  render: () => ({
    components: { TimeEntriesList },
    setup() {
      const entries: any[] = []
      return { entries }
    },
    template: '<TimeEntriesList :entries="entries" />',
  }),
}

