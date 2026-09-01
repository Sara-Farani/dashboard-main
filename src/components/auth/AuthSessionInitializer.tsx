import { useEffect } from 'react'

import { useAuthStore } from '../../store/authStore'

export function AuthSessionInitializer() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const restoreSession = useAuthStore((state) => state.restoreSession)

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    void restoreSession()
  }, [hasHydrated, restoreSession])

  return null
}