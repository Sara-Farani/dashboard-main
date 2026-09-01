import { apiClient } from '../lib/apiClient'
import type {
  ChangePasswordPayload,
  CreateUserPayload,
  ResetUserPasswordPayload,
  RoleItem,
  UpdateUserPayload,
  UserItem,
} from '../types/user'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export async function getUsers(): Promise<UserItem[]> {
  const { data } = await apiClient.get<ApiResponse<UserItem[]>>('/users')

  return data.data
}

export async function getRoles(): Promise<RoleItem[]> {
  const { data } = await apiClient.get<ApiResponse<RoleItem[]>>('/roles')

  return data.data
}

export async function createUser(
  payload: CreateUserPayload,
): Promise<UserItem> {
  const { data } = await apiClient.post<ApiResponse<UserItem>>(
    '/users',
    payload,
  )

  return data.data
}

export async function updateUser(
  id: number,
  payload: UpdateUserPayload,
): Promise<UserItem> {
  const { data } = await apiClient.put<ApiResponse<UserItem>>(
    `/users/${id}`,
    payload,
  )

  return data.data
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}`)
}

export async function resetUserPassword(
  id: number,
  payload: ResetUserPasswordPayload,
): Promise<void> {
  await apiClient.patch(`/users/${id}/password`, payload)
}

export async function changeMyPassword(
  payload: ChangePasswordPayload,
): Promise<void> {
  await apiClient.patch('/users/change-password', payload)
}