import { ref } from 'vue'
import type { TimeEntry } from '../types'

export default function useTimeEntryState() {
  const drafts = ref<TimeEntry[]>([])
  const ignored = ref<TimeEntry[]>([])
  const confirmed = ref<TimeEntry[]>([])

  // Functions like onSave, onConfirm, etc.
  return { drafts, ignored, confirmed /* functions */ }
}
