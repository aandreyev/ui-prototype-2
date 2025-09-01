<template>
  <div v-if="selectedCount > 0" class="flex gap-2 p-3 bg-blue-50 border border-blue-200 rounded">
    <div class="flex-1 text-sm">
      {{ selectedCount }} {{ selectedCount === 1 ? 'entry' : 'entries' }} selected
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
      :disabled="selectedCount < 2"
      :class="{ 'opacity-50 cursor-not-allowed': selectedCount < 2 }"
    >
      Merge Selected ({{ selectedCount }})
    </button>
    <button 
      class="px-3 py-1 text-xs border rounded bg-gray-50 hover:bg-gray-100"
      @click="$emit('clear-selection')"
    >
      Clear
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedCount: number
}>()

defineEmits<{
  (e: 'bulk-action', action: 'ignore' | 'complete' | 'merge'): void
  (e: 'clear-selection'): void
}>()
</script>
