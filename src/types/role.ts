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