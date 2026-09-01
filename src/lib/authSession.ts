type PersistedAuthState = {
  state?: {
    token?: string | null
  }
}

export function getPersistedToken(): string | null {
  try {
    const persistedValue = sessionStorage.getItem('auth-session')

    if (!persistedValue) {
      return null
    }

    const persistedState = JSON.parse(
      persistedValue,
    ) as PersistedAuthState

    return persistedState.state?.token ?? null
  } catch {
    /*
      اگر داده‌ی sessionStorage خراب یا غیرقابل parse باشد،
      درخواست بدون token ارسال می‌شود.
    */
    return null
  }
}