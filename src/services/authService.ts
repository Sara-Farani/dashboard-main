import { apiClient } from '../lib/apiClient'
import type { AuthUser, LoginResponse } from '../types/auth'

type ApiUserResponse = {
  id: number
  userName?: string
  username?: string
  firstName?: string
  lastName?: string
  isActive?: number | boolean
  createdAt?: string
  updatedAt?: string | null
  passwordChangedAt?: string | null
  roleId?: number
  roleCode?: string
  role?: string
  roleName?: string
  roleIsActive?: number | boolean
  permissions?: string[]
}

type LoginApiResponse = {
  token: string
  user: ApiUserResponse
}

function mapApiUserToAuthUser(user: ApiUserResponse): AuthUser {
  return {
    id: String(user.id),

    username: user.userName ?? user.username ?? '',

    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',

    role: user.roleCode ?? user.role ?? '',

    /*
      Backend مقدار 0 یا 1 برمی‌گرداند.
      Boolean(0) = false و Boolean(1) = true است،
      ولی این روش برای حالت boolean هم کاملاً صریح است.
    */
    isActive: user.isActive === true || user.isActive === 1,

    permissions: user.permissions ?? [],
  }
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginApiResponse>('/auth/login', {
    username,
    password,
  })

  return {
    token: data.token,
    user: mapApiUserToAuthUser(data.user),
  }
}

export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await apiClient.get<ApiUserResponse>(
    '/auth/getCurrentUser',
  )

  return mapApiUserToAuthUser(data)
}

/*
  توکن به‌صورت صریح دریافت می‌شود تا در logout بتوانیم:
  1. ابتدا state و storage محلی را پاک کنیم.
  2. سپس همان token قبلی را برای logout سمت Backend ارسال کنیم.
*/
export async function logout(token?: string): Promise<void> {
  await apiClient.post(
    '/auth/logout',
    undefined,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined,
  )
}