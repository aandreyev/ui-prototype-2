<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center gap-2">
      <input
        class="border rounded px-2 py-1 text-sm"
        :placeholder="searchPlaceholder"
        v-model="searchText"
        @input="onSearch"
      />
      <button class="border rounded px-2 py-1 text-sm" @click="$emit('load-more', 1, pageSize)">Refresh</button>
    </div>
    <table class="w-full text-sm border rounded">
      <thead class="bg-gray-50">
        <tr>
          <th class="text-left p-2">Name</th>
          <th class="text-left p-2">Email</th>
          <th class="text-left p-2">Role</th>
          <th class="text-left p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in paged" :key="user.id" class="border-t">
          <td class="p-2">{{ user.fullName }}</td>
          <td class="p-2">{{ user.email }}</td>
          <td class="p-2">{{ user.role }}</td>
          <td class="p-2 text-right">
            <button class="px-2 py-1 text-xs border rounded mr-2" @click="$emit('selected', user.id)">Select</button>
            <button class="px-2 py-1 text-xs border rounded" @click="$emit('deleted', user.id)">Delete</button>
          </td>
        </tr>
        <tr v-if="!paged.length">
          <td colspan="4" class="p-6 text-center text-gray-500">No results.</td>
        </tr>
      </tbody>
    </table>
    <div class="flex items-center justify-end gap-2">
      <button class="px-2 py-1 text-xs border rounded" :disabled="page===1" @click="toPage(page-1)">Prev</button>
      <span class="text-xs">Page {{ page }} of {{ totalPages }}</span>
      <button class="px-2 py-1 text-xs border rounded" :disabled="page===totalPages" @click="toPage(page+1)">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type User = {
  id: string
  fullName: string
  email: string
  role: string
}

const props = defineProps<{ users: User[]; searchPlaceholder?: string; pageSize?: number }>()
const emit = defineEmits(['selected', 'deleted', 'load-more'])

const searchText = ref('')
const page = ref(1)
const pageSize = computed(() => props.pageSize ?? 10)

const filtered = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  if (!q) return props.users
  return props.users.filter(u =>
    [u.fullName, u.email, u.role].some(v => (v ?? '').toLowerCase().includes(q))
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

function toPage(p: number) {
  page.value = Math.min(Math.max(1, p), totalPages.value)
  emit('load-more', page.value, pageSize.value)
}

function onSearch() {
  page.value = 1
  emit('load-more', page.value, pageSize.value)
}

watch(() => props.users, () => { if (page.value > totalPages.value) page.value = totalPages.value })
</script>

<style scoped>
</style>


