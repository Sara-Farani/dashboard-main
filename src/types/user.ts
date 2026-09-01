export interface RoleItem {
  roleId: number
  roleCode: string
  roleName: string
  description: string | null
  isSystemRole: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UserItem {
  id: number
  userId: string
  firstName: string
  lastName: string
  roleId: number
  roleCode: string
  roleName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  userId: string
  firstName: string
  lastName: string
  roleId: number
  password: string
}

export interface UpdateUserPayload {
  userId: string
  firstName: string
  lastName: string
  roleId: number
  isActive: boolean
}

export interface ResetUserPasswordPayload {
  newPassword: string
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}