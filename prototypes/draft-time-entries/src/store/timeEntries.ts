// Vuex module for time entries state management (ALP pattern)
import { Module } from 'vuex'
import type { TimeEntry } from '../types'

export interface TimeEntriesState {
  drafts: TimeEntry[]
  ignored: TimeEntry[]
  complete: TimeEntry[]
  loading: boolean
  error: string | null
  selectedIds: string[]
}

const timeEntriesModule: Module<TimeEntriesState, any> = {
  namespaced: true,
  
  state: (): TimeEntriesState => ({
    drafts: [],
    ignored: [],
    complete: [],
    loading: false,
    error: null,
    selectedIds: []
  }),

  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.loading = loading
    },
    
    SET_ERROR(state, error: string | null) {
      state.error = error
    },
    
    SET_DRAFTS(state, entries: TimeEntry[]) {
      state.drafts = entries
    },
    
    SET_IGNORED(state, entries: TimeEntry[]) {
      state.ignored = entries
    },
    
    SET_COMPLETE(state, entries: TimeEntry[]) {
      state.complete = entries
    },
    
    MOVE_ENTRY(state, { id, fromStatus, toStatus }: { id: string, fromStatus: string, toStatus: string }) {
      const fromList = state[fromStatus as keyof TimeEntriesState] as TimeEntry[]
      const toList = state[toStatus as keyof TimeEntriesState] as TimeEntry[]
      
      const entryIndex = fromList.findIndex(e => e.id === id)
      if (entryIndex >= 0) {
        const entry = fromList.splice(entryIndex, 1)[0]
        entry.status = toStatus as 'draft' | 'ignored' | 'complete'
        toList.push(entry)
      }
    },
    
    UPDATE_ENTRY(state, { status, entry }: { status: string, entry: TimeEntry }) {
      const list = state[status as keyof TimeEntriesState] as TimeEntry[]
      const index = list.findIndex(e => e.id === entry.id)
      if (index >= 0) {
        list[index] = { ...entry }
      }
    },
    
    SET_SELECTED(state, ids: string[]) {
      state.selectedIds = ids
    },
    
    BULK_MOVE(state, { ids, toStatus }: { ids: string[], toStatus: string }) {
      ids.forEach(id => {
        // Find entry across all lists
        const fromDrafts = state.drafts.findIndex(e => e.id === id)
        const fromIgnored = state.ignored.findIndex(e => e.id === id)
        
        if (fromDrafts >= 0) {
          const entry = state.drafts.splice(fromDrafts, 1)[0]
          entry.status = toStatus as 'draft' | 'ignored' | 'complete'
          ;(state[toStatus as keyof TimeEntriesState] as TimeEntry[]).push(entry)
        } else if (fromIgnored >= 0) {
          const entry = state.ignored.splice(fromIgnored, 1)[0]
          entry.status = toStatus as 'draft' | 'ignored' | 'complete'
          ;(state[toStatus as keyof TimeEntriesState] as TimeEntry[]).push(entry)
        }
      })
      state.selectedIds = []
    }
  },

  actions: {
    async fetchEntries({ commit }) {
      commit('SET_LOADING', true)
      try {
        // In real app, this would call API
        const response = await fetch('/api/draft-time-entries')
        const data = await response.json()
        
        commit('SET_DRAFTS', data.drafts || [])
        commit('SET_IGNORED', data.ignored || [])
        commit('SET_COMPLETE', data.complete || [])
      } catch (error) {
        commit('SET_ERROR', error instanceof Error ? error.message : 'Failed to fetch entries')
      } finally {
        commit('SET_LOADING', false)
      }
    },
    
    async confirmEntry({ commit }, { id, status }: { id: string, status: string }) {
      commit('MOVE_ENTRY', { id, fromStatus: status, toStatus: 'complete' })
      // API call would happen here
    },
    
    async ignoreEntry({ commit }, { id, status }: { id: string, status: string }) {
      commit('MOVE_ENTRY', { id, fromStatus: status, toStatus: 'ignored' })
      // API call would happen here  
    },
    
    async bulkAction({ commit }, { action, ids }: { action: string, ids: string[] }) {
      if (action === 'confirm') {
        commit('BULK_MOVE', { ids, toStatus: 'complete' })
      } else if (action === 'ignore') {
        commit('BULK_MOVE', { ids, toStatus: 'ignored' })
      }
      // API calls would happen here
    }
  },

  getters: {
    draftCount: state => state.drafts.length,
    ignoredCount: state => state.ignored.length,
    completeCount: state => state.complete.length,
    selectedCount: state => state.selectedIds.length,
    hasSelected: state => state.selectedIds.length > 0
  }
}

export default timeEntriesModule
