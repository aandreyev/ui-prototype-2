<template>
  <div v-if="open" class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white rounded shadow w-[800px] max-w-full p-5 space-y-4">
      <div class="text-base font-medium">Merge Time Entries</div>
      
      <!-- Selected Entries Preview -->
      <div class="space-y-2">
        <div class="text-sm font-medium">Selected Entries ({{ entries.length }})</div>
        <div class="max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
          <div v-for="entry in entries" :key="entry.id" class="flex justify-between text-xs py-1">
            <span>{{ entry.date }} - {{ entry.description || 'No description' }}</span>
            <span>{{ entry.minutes }}m</span>
          </div>
        </div>
      </div>
      
      <!-- Merged Result -->
      <div class="space-y-3">
        <div class="text-sm font-medium">Merged Entry</div>
        
        <div class="grid grid-cols-2 gap-3">
          <label class="text-xs">Date
            <input 
              class="border rounded px-2 py-1 w-full" 
              type="datetime-local" 
              v-model="merged.date"
            />
          </label>
          <label class="text-xs">Total Duration
            <input 
              class="border rounded px-2 py-1 w-full bg-gray-50" 
              type="text" 
              :value="`${totalMinutes} minutes`"
              readonly
            />
          </label>
        </div>
        
        <label class="text-xs block">Matter
          <input 
            class="border rounded px-2 py-1 w-full" 
            placeholder="Common matter (if detected)"
            v-model="merged.matter"
          />
        </label>
        
        <label class="text-xs block">Merged Description
          <div class="flex gap-2">
            <textarea 
              class="border rounded px-2 py-1 w-full" 
              rows="4" 
              v-model="merged.description"
              placeholder="AI-generated description will appear here..."
            ></textarea>
            <button 
              type="button"
              class="px-3 py-1 text-xs border rounded bg-blue-50 hover:bg-blue-100"
              @click="generateMergedDescription"
              :disabled="isGeneratingAi"
            >
              {{ isGeneratingAi ? '...' : 'AI Merge' }}
            </button>
          </div>
        </label>
      </div>
      
      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-2">
        <button class="px-3 py-1 text-xs border rounded" @click="$emit('cancel')">
          Cancel
        </button>
        <button 
          class="px-3 py-1 text-xs border rounded bg-green-50 hover:bg-green-100"
          @click="$emit('save', merged)"
          :disabled="!merged.description?.trim()"
        >
          Create Merged Entry
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch, ref } from 'vue'
import type { TimeEntry } from '../../types'
import { AiService } from '../../services/aiService'

const props = defineProps<{
  open: boolean
  entries: TimeEntry[]
}>()

defineEmits<{
  (e: 'save', entry: Partial<TimeEntry>): void
  (e: 'cancel'): void
}>()

const isGeneratingAi = ref(false)

const totalMinutes = computed(() => 
  props.entries.reduce((sum, entry) => sum + (entry.minutes || 0), 0)
)

const merged = reactive({
  date: '',
  matter: '',
  description: '',
  minutes: 0
})

// Initialize merged entry when modal opens
watch(() => props.open, (open) => {
  console.log('🔀 Merge modal open changed:', open, 'Entries:', props.entries.length)
  if (open && props.entries.length) {
    // Use earliest date
    const dates = props.entries.map(e => e.date).filter(Boolean).sort()
    merged.date = dates[0] || new Date().toISOString().slice(0, 16)
    
    // Try to find common matter
    const matters = props.entries.map(e => e.matter).filter(Boolean)
    const uniqueMatters = [...new Set(matters)]
    merged.matter = uniqueMatters.length === 1 ? uniqueMatters[0] : ''
    
    merged.minutes = totalMinutes.value
    merged.description = ''
    
    // Auto-generate description on open
    generateMergedDescription()
  }
})

async function generateMergedDescription() {
  isGeneratingAi.value = true
  try {
    const description = await AiService.generateMergedDescription(
      props.entries.map(e => ({ description: e.description, duration: e.minutes || 0 }))
    )
    merged.description = description
  } catch (error) {
    console.error('Failed to generate merged description:', error)
    merged.description = 'Combined legal work and consultation'
  } finally {
    isGeneratingAi.value = false
  }
}
</script>
