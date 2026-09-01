export type AuthUser = {
  id: string
  username: string
  firstName: string
  lastName: string
  isActive: boolean
  role: string
  permissions: string[]
}

export type LoginResponse = {
  token: string
  user: AuthUser
}

export type AuthState = {
  token: string | null
  user: AuthUser | null

  hasHydrated: boolean
  isRestoringSession: boolean

  login: (username: string, password: string) => Promise<LoginResponse>
  restoreSession: () => Promise<void>
  logout: () => void

  setUser: (user: AuthUser | null) => void
  setHasHydrated: (hasHydrated: boolean) => void
}