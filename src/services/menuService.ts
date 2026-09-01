import { apiClient } from '../lib/apiClient'
import type { AppMenuItem } from '../types/menu'

interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
}

export interface MyMenusResponse {
  menus: AppMenuItem[]
}

export async function getMyMenus(): Promise<MyMenusResponse> {
  const { data } = await apiClient.get<ApiResponse<AppMenuItem[]>>('/menus/my')

  return {
    menus: data,
  }
}