import { http, HttpResponse } from 'msw'
import type { UsersListResponse } from './types'

const seedUsers = [
  { id: 'u1', fullName: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
  { id: 'u2', fullName: 'Bob Smith', email: 'bob@example.com', role: 'User' },
  { id: 'u3', fullName: 'Charlie Young', email: 'charlie@example.com', role: 'Manager' },
]

export const usersHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') || '').toLowerCase()
    const page = Number(url.searchParams.get('page') || '1')
    const size = Number(url.searchParams.get('size') || '10')
    const filtered = q
      ? seedUsers.filter(u => [u.fullName, u.email, u.role].some(v => v.toLowerCase().includes(q)))
      : seedUsers
    const start = (page - 1) * size
    const body: UsersListResponse = { items: filtered.slice(start, start + size), total: filtered.length }
    return HttpResponse.json(body)
  }),
]

