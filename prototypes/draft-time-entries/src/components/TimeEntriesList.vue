<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <input
        class="border rounded px-2 py-1 text-sm"
        placeholder="Search time entries..."
        v-model="q"
        @input="$emit('load-more', 1, pageSize)"
      />
    </div>
    <!-- Temporary bulk actions toolbar for testing -->
    <div v-if="selected.length > 0" class="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded mb-3">
      <div class="flex-1 text-sm">
        {{ selected.length }} {{ selected.length === 1 ? 'entry' : 'entries' }} selected
      </div>
      <button 
        class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-50"
        @click="$emit('bulk-action', 'ignore')"
      >
        Ignore Selected
      </button>
      <button 
        class="px-3 py-1 text-xs border rounded bg-white hover:bg-gray-50"
        @click="$emit('bulk-action', 'complete')"
      >
        Complete Selected
      </button>
      <button 
        class="px-3 py-1 text-xs border rounded bg-green-50 hover:bg-green-100 border-green-300"
        @click="$emit('bulk-action', 'merge')"
        :disabled="selected.length < 2"
        :class="{ 'opacity-50 cursor-not-allowed': selected.length < 2 }"
      >
        Merge Selected ({{ selected.length }})
      </button>
      <button 
        class="px-3 py-1 text-xs border rounded bg-gray-50 hover:bg-gray-100"
        @click="selected = []"
      >
        Clear
      </button>
    </div>
    <table class="w-full text-sm border rounded">
      <thead class="bg-gray-50">
        <tr>
          <th class="p-2"><input type="checkbox" @change="toggleAll" :checked="allSelected" /></th>
          <th class="text-left p-2">Date</th>
          <th class="text-left p-2">Matter</th>
          <th class="text-left p-2">Description</th>
          <th class="text-right p-2">Minutes</th>
          <th class="text-left p-2">Status</th>
          <th class="text-left p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in items" :key="t.id" class="border-t" :class="{ 'bg-blue-50': selected.includes(t.id) }">
          <td class="p-2"><input type="checkbox" v-model="selected" :value="t.id" /></td>
          <td class="p-2">{{ t.date }}</td>
          <td class="p-2">{{ t.matter }}</td>
          <td class="p-2">{{ t.description }}</td>
          <td class="p-2 text-right">{{ t.minutes }}</td>
          <td class="p-2 capitalize">{{ t.status }}</td>
          <td class="p-2 text-right space-x-2">
            <button class="px-2 py-1 text-xs border rounded" @click="$emit('edit', t)">Edit</button>
            <template v-if="t.status === 'draft'">
              <button class="px-2 py-1 text-xs border rounded" @click="$emit('ignore', t)">Ignore</button>
              <button class="px-2 py-1 text-xs border rounded" @click="$emit('complete', t)">Complete</button>
            </template>
            <template v-else-if="t.status === 'ignored'">
              <!-- Only Edit shown -->
            </template>
            <template v-else>
              <!-- complete: no actions -->
            </template>
          </td>
        </tr>
        <tr v-if="!items.length">
          <td colspan="7" class="p-6 text-center text-gray-500">No results.</td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-end gap-2">
      <button class="px-2 py-1 text-xs border rounded" :disabled="page===1" @click="toPage(page-1)">Prev</button>
      <span class="text-xs">Page {{ page }} of {{ totalPages }}</span>
      <button class="px-2 py-1 text-xs border rounded" :disabled="page===totalPages" @click="toPage(page+1)">Next</button>
    </div>
    <!-- Loading State -->
    <div v-if="loading" class="p-6 text-center">Loading...</div>

    <!-- Error State -->
    <div v-if="error" class="p-6 text-center text-red-500">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { unitsToMinutes } from '../lib/time'
import type { TimeEntry } from '../types'

const props = defineProps<{ entries: TimeEntry[]; pageSize?: number; loading?: boolean; error?: string }>()
const $emit = defineEmits<{ (e: 'edit', value: TimeEntry): void; (e: 'complete', value: TimeEntry): void; (e: 'ignore', value: TimeEntry): void; (e: 'bulk-action', action: string, ids: string[]): void; (e: 'selection-change', ids: string[]): void }>()

const selected = ref<string[]>([])

// Watch for selection changes and emit to parent
watch(selected, (newSelection) => {
  $emit('selection-change', newSelection)
}, { deep: true })

const q = ref('')
const page = ref(1)
const pageSize = props.pageSize ?? 10

const normalized = computed(() =>
  (props.entries || []).map(e => ({
    ...e,
    minutes: typeof e.minutes === 'number'
      ? e.minutes
      : typeof e.units === 'number'
        ? unitsToMinutes(e.units)
        : typeof e.hours === 'number'
          ? Math.round(e.hours * 60)
          : 0,
  }))
)

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase()
  if (!s) return normalized.value
  return normalized.value.filter(e => [e.matter, e.description, e.status].some(x => (x ?? '').toLowerCase().includes(s)))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const items = computed(() => filtered.value.slice((page.value-1)*pageSize, (page.value-1)*pageSize + pageSize))

const allSelected = computed(() => items.value.length > 0 && items.value.every(t => selected.value.includes(t.id)))
function toggleAll(e: Event) {
  if ((e.target as HTMLInputElement).checked) selected.value = items.value.map(t => t.id)
  else selected.value = []
}

function toPage(p: number){
  page.value = Math.min(Math.max(1,p), totalPages.value)
}
</script>

<style scoped>
</style>


