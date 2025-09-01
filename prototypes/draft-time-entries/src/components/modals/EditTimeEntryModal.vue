<template>
  <div v-if="open" class="fixed inset-0 bg-black/40 flex items-center justify-center">
    <div class="bg-white rounded shadow w-[720px] max-w-full p-5 space-y-4">
      <div class="text-base font-medium">Edit Time Entry</div>

      <!-- Invoice Assignment Warning -->
      <div v-if="entry?.invoiceId" class="p-3 bg-red-50 border border-red-200 rounded">
        <div class="text-xs font-medium text-red-800">Invoice Already Assigned</div>
        <div class="text-xs text-red-700">This time entry is assigned to invoice #{{ entry.invoiceId }}. Confirm changes with the coordinator. Entries on sent invoices cannot be changed.</div>
      </div>

      <!-- Entry Type (Sales / MatterComponent) -->
      <div class="grid grid-cols-2 gap-3">
        <label class="text-xs">Entry Type
          <select class="border rounded px-2 py-1 w-full" v-model="local.entryType">
            <option value="Sales">Sales</option>
            <option value="MatterComponent">Matter Component</option>
          </select>
        </label>
        <label class="text-xs">Date
          <input class="border rounded px-2 py-1 w-full" type="datetime-local" v-model="local.date" :class="{ 'border-red-500': dateError }" />
          <div v-if="dateError" class="text-red-500 text-xs mt-1">{{ dateError }}</div>
        </label>
      </div>

      <!-- Matter / Matter Component selectors (stubs) -->
      <div v-if="local.entryType === 'Sales'" class="grid grid-cols-1 gap-2">
        <label class="text-xs">Matter
          <input class="border rounded px-2 py-1 w-full" placeholder="Select matter (e.g., 12345)" v-model="local.matter" :class="{ 'border-red-500': matterError }" />
          <div v-if="matterError" class="text-red-500 text-xs mt-1">{{ matterError }}</div>
        </label>
      </div>
      <div v-else class="grid grid-cols-1 gap-2">
        <label class="text-xs">Matter Component
          <input class="border rounded px-2 py-1 w-full" placeholder="Select matter component" v-model="local.matterComponent" :class="{ 'border-red-500': matterComponentError }" />
          <div v-if="matterComponentError" class="text-red-500 text-xs mt-1">{{ matterComponentError }}</div>
        </label>
      </div>

      <!-- Rate and Units Row -->
      <div class="grid grid-cols-2 gap-3">
        <label class="text-xs">Rate
          <input class="border rounded px-2 py-1 w-full" type="number" min="0" step="0.01" v-model.number="local.rate" />
        </label>
        <label class="text-xs">Units (6‑min)
          <input class="border rounded px-2 py-1 w-full" type="number" min="0" step="1" v-model.number="local.units" />
        </label>
      </div>

      <!-- Minutes helper -->
      <div class="grid grid-cols-2 gap-3">
        <label class="text-xs">Minutes
          <input class="border rounded px-2 py-1 w-full" type="number" min="1" step="1" v-model.number="local.minutes" :class="{ 'border-red-500': minutesError }" />
          <div v-if="minutesError" class="text-red-500 text-xs mt-1">{{ minutesError }}</div>
        </label>
      </div>

      <!-- GST and Billable Type -->
      <div class="grid grid-cols-2 gap-3">
        <label class="text-xs">GST Type
          <select class="border rounded px-2 py-1 w-full" v-model="local.gstType">
            <option value="Gst">GST (10%)</option>
            <option value="GstExport">GST Export (0%)</option>
            <option value="GstBasExclude">BAS Excluded (0%)</option>
          </select>
        </label>
        <label class="text-xs">Billable Type
          <select class="border rounded px-2 py-1 w-full" v-model="local.billableType">
            <option value="Billable">Billable</option>
            <option value="NonBillable">Non Billable</option>
            <option value="NonChargeable">Non Chargeable</option>
            <option value="ProBono">Pro Bono</option>
          </select>
        </label>
      </div>

      <!-- Description -->
      <label class="text-xs block">Description
        <div class="flex gap-2">
          <textarea class="border rounded px-2 py-1 w-full" rows="4" v-model="local.description" :class="{ 'border-red-500': descriptionError }"></textarea>
          <button 
            type="button" 
            class="px-3 py-1 text-xs border rounded bg-blue-50 hover:bg-blue-100" 
            @click="generateAiDescription"
            :disabled="isGeneratingAi || (!local.matter && !local.matterComponent)"
            title="Generate AI description"
          >
            {{ isGeneratingAi ? '...' : 'AI' }}
          </button>
        </div>
        <div v-if="descriptionError" class="text-red-500 text-xs mt-1">{{ descriptionError }}</div>
        <div v-if="aiSuggestions.length" class="mt-2">
          <div class="text-xs text-gray-600 mb-1">AI Suggestions:</div>
          <div class="space-y-1">
            <button 
              v-for="suggestion in aiSuggestions" 
              :key="suggestion"
              type="button"
              class="block text-xs p-2 border rounded bg-gray-50 hover:bg-gray-100 w-full text-left"
              @click="local.description = suggestion"
            >
              {{ suggestion }}
            </button>
          </div>
        </div>
      </label>

      <!-- Footer Buttons (status‑aware) -->
      <div class="flex justify-end gap-2 pt-2">
        <button class="px-2 py-1 text-xs border rounded" @click="$emit('cancel')">Cancel</button>
        <template v-if="status === 'draft'">
          <button class="px-2 py-1 text-xs border rounded" @click="$emit('save', { ...local })">Save</button>
          <button 
            class="px-2 py-1 text-xs border rounded" 
            @click="$emit('complete', { ...local })" 
            :disabled="!canComplete"
            :class="{ 'opacity-50 cursor-not-allowed': !canComplete }"
          >
            Complete
          </button>
        </template>
        <template v-else-if="status === 'ignored'">
          <button class="px-2 py-1 text-xs border rounded" @click="$emit('save', { ...local })">Save</button>
          <button 
            class="px-2 py-1 text-xs border rounded" 
            @click="$emit('complete', { ...local })"
            :disabled="!canComplete"
            :class="{ 'opacity-50 cursor-not-allowed': !canComplete }"
          >
            Complete
          </button>
          <button class="px-2 py-1 text-xs border rounded" @click="$emit('ignore', { ...local })">Ignore</button>
        </template>
        <template v-else>
          <!-- complete: modal should not generally open -->
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, computed, ref } from 'vue'
// Temporarily removing vee-validate to fix errors
// import { useForm, useField } from 'vee-validate'
// import * as yup from 'yup'
import type { TimeEntry } from '../../types'
import { AiService } from '../../services/aiService'

const props = defineProps<{ open: boolean; entry: TimeEntry | null; status?: 'draft' | 'ignored' | 'complete' }>()

// Simplified validation without vee-validate for now to fix errors
const errors = ref({})
const isValid = ref(true)

// Simplified error handling without vee-validate
const dateError = ref('')
const minutesError = ref('')
const descriptionError = ref('')
const matterError = ref('')
const matterComponentError = ref('')

const isGeneratingAi = ref(false)
const aiSuggestions = ref<string[]>([])

const local = reactive({
  id: '', date: '', minutes: 0, matter: '', matterComponent: '', description: '',
  rate: 0, units: 0, gstType: 'Gst', billableType: 'Billable', entryType: 'Sales',
})

watch(() => props.entry, (e) => {
  if (!e) {
    // Reset to defaults when no entry
    Object.assign(local, {
      id: '', date: '', minutes: 0, matter: '', matterComponent: '', description: '',
      rate: 0, units: 0, gstType: 'Gst', billableType: 'Billable', entryType: 'Sales',
    })
    return
  }
  
  local.id = e.id || ''
  local.date = e.date || ''
  local.minutes = e.minutes ?? 0
  local.matter = e.matter ?? ''
  local.matterComponent = e.matterComponent ?? ''
  local.description = e.description ?? ''
  local.rate = e.rate ?? 0
  local.units = e.units ?? 0
  local.gstType = e.gstType ?? 'Gst'
  local.billableType = e.billableType ?? 'Billable'
  local.entryType = e.entryType ?? 'Sales'
}, { immediate: true })

const status = computed(() => props.status ?? 'draft')

// AI Description Generation
async function generateAiDescription() {
  if (!local.matter && !local.matterComponent) return
  
  isGeneratingAi.value = true
  try {
    const matterId = parseInt(local.matter || local.matterComponent || '0')
    const response = await AiService.generateDescription({
      matterId: matterId || undefined,
      duration: local.minutes,
      source: 'Calendar',
      context: local.description
    })
    
    local.description = response.description
    aiSuggestions.value = response.alternatives
  } catch (error) {
    console.error('AI generation failed:', error)
  } finally {
    isGeneratingAi.value = false
  }
}

// Complete button should only be enabled when form is valid
const canComplete = computed(() => local.date && local.minutes > 0 && local.description?.trim())
</script>

<style scoped>
</style>
