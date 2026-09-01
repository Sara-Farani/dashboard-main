import { useEffect, useState, type ReactNode } from 'react'
import { useAuthStore } from '../store/authStore'
import * as authService from '../services/authService'

function LoadingScreen() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-surface-50"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600" />
        <span className="text-sm text-surface-500">در حال بررسی نشست کاربری...</span>
      </div>
    </div>
  )
}

export default function AppBootstrap({
  children,
}: {
  children: ReactNode
}) {
  const [ready, setReady] = useState(false)
  const token = useAuthStore((state) => state.token)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    let mounted = true

    async function bootstrap() {
      if (!token) {
        if (mounted) {
          setUser(null)
          setReady(true)
        }

        return
      }

      try {
        const user = await authService.getCurrentUser()

        if (mounted) {
          setUser(user)
        }
      } catch {
        logout()
      } finally {
        if (mounted) {
          setReady(true)
        }
      }
    }

    void bootstrap()

    return () => {
      mounted = false
    }
  }, [token, setUser, logout])

  if (!ready) {
    return <LoadingScreen />
  }

  return <>{children}</>
}