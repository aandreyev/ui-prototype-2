import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import TimeEntriesList from '../components/TimeEntriesList.vue'
import EditTimeEntryModal from '../components/modals/EditTimeEntryModal.vue'
import MergePreviewModal from '../components/modals/MergePreviewModal.vue'
import BulkActionsToolbar from '../components/BulkActionsToolbar.vue'
import type { TimeEntry } from '../types'

const meta: Meta<typeof TimeEntriesList> = {
  title: 'TimeEntries/WithMergeFlow',
  component: TimeEntriesList,
}

export default meta
type Story = StoryObj<typeof TimeEntriesList>

export const FullWorkflow: Story = {
  render: () => ({
    components: { 
      TimeEntriesList, 
      EditTimeEntryModal, 
      MergePreviewModal, 
      BulkActionsToolbar 
    },
    setup() {
      const drafts = ref<TimeEntry[]>([
        { 
          id: 't1', 
          date: '2025-01-15T10:00', 
          matter: '12345', 
          description: 'Client strategy meeting', 
          minutes: 90, 
          status: 'draft',
          sourceType: 'Calendar'
        },
        { 
          id: 't2', 
          date: '2025-01-15T11:45', 
          matter: '12345', 
          description: 'Follow-up email correspondence', 
          minutes: 15, 
          status: 'draft',
          sourceType: 'Email'
        },
        { 
          id: 't3', 
          date: '2025-01-15T14:00', 
          matter: '67890', 
          description: 'Contract research', 
          minutes: 120, 
          status: 'draft',
          sourceType: 'Timer'
        },
      ])
      const ignored = ref<TimeEntry[]>([])
      const complete = ref<TimeEntry[]>([])
      const selected = ref<string[]>([])
      const selectedEntries = ref<TimeEntry[]>([])

      const showEdit = ref(false)
      const showMerge = ref(false)
      const editEntry = ref<TimeEntry | null>(null)
      const editStatus = ref<'draft' | 'ignored' | 'complete'>('draft')

      function openEdit(entry: TimeEntry) {
        editEntry.value = { ...entry }
        editStatus.value = entry.status
        showEdit.value = true
      }

      function onSave(updated: TimeEntry) {
        // Update in current list
        const currentList = getCurrentList(editStatus.value)
        const idx = currentList.value.findIndex(e => e.id === updated.id)
        if (idx >= 0) {
          currentList.value[idx] = { ...updated }
        }
        showEdit.value = false
      }

      function onComplete(updated: TimeEntry) {
        // Move to complete
        removeFromCurrentList(updated.id)
        complete.value.push({ ...updated, status: 'complete' })
        showEdit.value = false
      }

      function onIgnore(entry: TimeEntry) {
        removeFromCurrentList(entry.id)
        ignored.value.push({ ...entry, status: 'ignored' })
      }

      function onRowComplete(entry: TimeEntry) {
        removeFromCurrentList(entry.id)
        complete.value.push({ ...entry, status: 'complete' })
      }

      function removeFromCurrentList(id: string) {
        drafts.value = drafts.value.filter(e => e.id !== id)
        ignored.value = ignored.value.filter(e => e.id !== id)
      }

      function getCurrentList(status: string) {
        return status === 'draft' ? drafts : status === 'ignored' ? ignored : complete
      }

      function onSelectionChange(ids: string[]) {
        console.log('🔍 Selection changed:', ids)
        selected.value = ids
        selectedEntries.value = drafts.value.filter(e => ids.includes(e.id))
        console.log('📊 Updated selected.value:', selected.value, 'selectedEntries:', selectedEntries.value.length)
      }

      function onBulkAction(action: 'ignore' | 'complete' | 'merge') {
        console.log('🔄 Bulk action:', action, 'Selected IDs:', selected.value, 'Selected entries:', selectedEntries.value.length)
        if (action === 'merge') {
          if (selectedEntries.value.length < 2) {
            alert('Please select at least 2 entries to merge')
            return
          }
          console.log('🔀 Opening merge modal with entries:', selectedEntries.value)
          showMerge.value = true
        } else if (action === 'ignore') {
          // Move selected to ignored
          selectedEntries.value.forEach(entry => onIgnore(entry))
          selected.value = []
          selectedEntries.value = []
        } else if (action === 'complete') {
          // Move selected to complete
          selectedEntries.value.forEach(entry => onRowComplete(entry))
          selected.value = []
          selectedEntries.value = []
        }
      }

      function onMergeSave(mergedEntry: Partial<TimeEntry>) {
        // Remove selected entries
        drafts.value = drafts.value.filter(e => !selected.value.includes(e.id))
        
        // Add merged entry
        const newEntry: TimeEntry = {
          ...mergedEntry,
          id: `merged-${Date.now()}`,
          status: 'draft',
          isMerged: true
        } as TimeEntry
        
        drafts.value.unshift(newEntry)
        selected.value = []
        showMerge.value = false
      }



      return { 
        drafts, 
        ignored, 
        complete, 
        selected,
        selectedEntries,
        showEdit, 
        showMerge,
        editEntry, 
        editStatus,
        openEdit, 
        onSave, 
        onComplete, 
        onIgnore, 
        onRowComplete,
        onSelectionChange,
        onBulkAction,
        onMergeSave,
        onCancel: () => { 
          showEdit.value = false
          showMerge.value = false 
        }
      }
    },
    template: `
      <div class="space-y-4">
        <!-- Bulk Actions Toolbar -->
        <BulkActionsToolbar 
          :selectedCount="selected.length"
          @bulk-action="onBulkAction"
          @clear-selection="selected = []"
        />

        <!-- Draft Entries -->
        <div>
          <div class="text-sm font-medium mb-2">Draft Entries ({{ drafts.length }})</div>
          <TimeEntriesList 
            :entries="drafts" 
            @edit="openEdit" 
            @complete="onRowComplete" 
            @ignore="onIgnore"
            @bulk-action="onBulkAction"
            @selection-change="onSelectionChange"
          />
        </div>

        <!-- Ignored Entries -->
        <div v-if="ignored.length">
          <div class="text-sm font-medium mb-2">Ignored Entries ({{ ignored.length }})</div>
          <TimeEntriesList 
            :entries="ignored" 
            @edit="openEdit"
          />
        </div>

        <!-- Complete Entries -->
        <div v-if="complete.length">
          <div class="text-sm font-medium mb-2">Complete Entries ({{ complete.length }})</div>
          <TimeEntriesList :entries="complete" />
        </div>

        <!-- Edit Modal -->
        <EditTimeEntryModal 
          :open="showEdit" 
          :entry="editEntry" 
          :status="editStatus"
          @save="onSave" 
          @complete="onComplete" 
          @ignore="onIgnore" 
          @cancel="onCancel" 
        />

        <!-- Merge Modal -->
        <MergePreviewModal
          :open="showMerge"
          :entries="selectedEntries"
          @save="onMergeSave"
          @cancel="onCancel"
        />
        
        <!-- Debug info -->
        <div class="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
          <strong>Debug Info:</strong><br>
          Selected count: {{ selected.length }}<br>
          Selected IDs: {{ selected.join(', ') || 'none' }}<br>
          Selected entries loaded: {{ selectedEntries.length }}<br>
          Show merge modal: {{ showMerge }}<br>
          BulkActionsToolbar visible: {{ selected.length > 0 }}
        </div>
      </div>
    `,
  }),
}
