export type ThemeId = 'mellat' | 'royal' | 'emerald' | 'golden'

export type ThemeOption = {
  id: ThemeId
  label: string
  description: string
  swatch: string
}

export const THEME_STORAGE_KEY = 'app-theme'

export const DEFAULT_THEME: ThemeId = 'mellat'

export const themeOptions: ThemeOption[] = [
  {
    id: 'mellat',
    label: 'ملت (پیش‌فرض)',
    description: 'قرمز برند بانک ملت',
    swatch: '#ed1c24',
  },
  {
    id: 'royal',
    label: 'آبی سلطنتی',
    description: 'آبی کلاسیک و آرام',
    swatch: '#3b6ef0',
  },
  {
    id: 'emerald',
    label: 'زمردی',
    description: 'سبز آرامش‌بخش',
    swatch: '#10b981',
  },
  {
    id: 'golden',
    label: 'طلایی',
    description: 'نارنجی-طلایی گرم',
    swatch: '#f79009',
  },
]

export function readThemeFromStorage(): ThemeId {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)

    if (stored && themeOptions.some((option) => option.id === stored)) {
      return stored as ThemeId
    }
  } catch {
    // localStorage unavailable — fall through to default
  }

  return DEFAULT_THEME
}

export function applyTheme(theme: ThemeId): void {
  if (theme === DEFAULT_THEME) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export function saveThemeToStorage(theme: ThemeId): void {
  try {
    if (theme === DEFAULT_THEME) {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    }
  } catch {
    // localStorage unavailable — theme still applies for this session
  }
}
