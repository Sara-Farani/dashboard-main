import { create } from 'zustand'

export type Theme = 'light' | 'dark'

export interface UiState {
  /** desktop: collapsed icon-only mode */
  collapsed: boolean
  /** mobile: drawer visible */
  mobileOpen: boolean
  theme: Theme

  toggleCollapsed: () => void
  setMobileOpen: (v: boolean) => void
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

/**
 * uiStore — sidebar collapsed state (desktop), mobile drawer state, theme.
 */
export const useUiStore = create<UiState>()((set) => ({
  collapsed: false,
  mobileOpen: false,
  theme: 'light',

  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setMobileOpen: (v) => set({ mobileOpen: v }),
  toggleTheme: () =>
    set((s) => {
      const theme: Theme = s.theme === 'light' ? 'dark' : 'light'
      document.documentElement.classList.toggle('dark', theme === 'dark')
      return { theme }
    }),
  setTheme: (theme: Theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },
}))
