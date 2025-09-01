// Main app entry with Vuex store
import { createApp } from 'vue'
import { createStore } from 'vuex'
import timeEntriesModule from './store/timeEntries'

const store = createStore({
  modules: {
    timeEntries: timeEntriesModule
  }
})

// This would be used in a real app
// const app = createApp(App)
// app.use(store)
// app.mount('#app')

export { store }
