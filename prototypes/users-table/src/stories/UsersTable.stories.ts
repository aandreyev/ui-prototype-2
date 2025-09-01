import type { Meta, StoryObj } from '@storybook/vue3'
import UsersTable from '../components/UsersTable.vue'

const meta: Meta<typeof UsersTable> = {
  title: 'Users/UsersTable',
  component: UsersTable,
}

export default meta
type Story = StoryObj<typeof UsersTable>

export const Loaded: Story = {
  args: {
    users: [
      { id: 'u1', fullName: 'Alice Johnson', email: 'alice@example.com', role: 'Admin' },
      { id: 'u2', fullName: 'Bob Smith', email: 'bob@example.com', role: 'User' },
      { id: 'u3', fullName: 'Charlie Young', email: 'charlie@example.com', role: 'Manager' },
    ],
    searchPlaceholder: 'Search users...'
  }
}

export const Empty: Story = {
  args: {
    users: [],
    searchPlaceholder: 'Search users...'
  }
}

