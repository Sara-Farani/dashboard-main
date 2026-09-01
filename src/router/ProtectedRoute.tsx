import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'

function AuthLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen items-center justify-center bg-surface-50"
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary-200 border-t-primary-600"
          aria-hidden="true"
        />
        <p
          className="text-sm text-surface-500"
          style={{ fontFamily: 'Vazirmatn, sans-serif' }}
        >
          در حال بارگذاری...
        </p>
      </div>
    </motion.div>
  )
}

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode
}) {
  const [hydrated, setHydrated] = useState(useAuthStore.persist.hasHydrated())
  const token = useAuthStore((state) => state.token)
  const location = useLocation()

  useEffect(() => {
    if (hydrated) {
      return
    }

    return useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
  }, [hydrated])

  if (!hydrated) {
    return <AuthLoading />
  }

  if (!token) {
    const from = `${location.pathname}${location.search}${location.hash}`

    return (
      <Navigate
        to="/login"
        replace
        state={{ from }}
      />
    )
  }

  return children
}