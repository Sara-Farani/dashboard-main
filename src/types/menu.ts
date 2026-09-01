export type AppMenuItem = {
  id: number
  code: string
  title: string
  iconName: string | null
  routePath: string | null
  parentMenuId: number | null
  sortOrder: number
  children: AppMenuItem[]
}

export type UserMenuResponse = {
  user: {
    userId: string
    fullName: string
    roleCode: string
  }
  menus: AppMenuItem[]
}