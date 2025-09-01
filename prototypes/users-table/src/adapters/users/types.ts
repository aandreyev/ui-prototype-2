export type UserDto = {
  id: string
  fullName: string
  email: string
  role: string
}

export type UsersListResponse = {
  items: UserDto[]
  total: number
}

