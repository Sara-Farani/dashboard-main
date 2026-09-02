import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuthStore } from '../../store/authStore'
import { logger } from '../../utils/logger'

import LoginBackground from '../../components/auth/LoginBackground'
import BrandPanel from '../../components/auth/BrandPanel'
import LoginFormCard from '../../components/auth/LoginFormCard'
import LoginInput from '../../components/auth/LoginInput'
import LoginSubmitButton from '../../components/auth/LoginSubmitButton'
import PasswordToggle from '../../components/auth/PasswordToggle'

interface LocationState {
  from?: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const state = location.state as LocationState | null
  const from = state?.from && state.from !== '/login' ? state.from : '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(username.trim(), password)
      logger.debug('from = ', from)
      navigate(from, { replace: true })
    } catch (error) {
      logger.debug('error = ', error)
      setError(getApiErrorMessage(error, 'ورود به سامانه ناموفق بود.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#8F96A1] px-4 py-8"
    >
      <LoginBackground />

      {/* Main card */}
      <div className="relative w-full max-w-[980px]">
        {/* Outer glow and frame */}
        <div className="pointer-events-none absolute -inset-[2px] rounded-[1.95rem] bg-gradient-to-br from-white/70 via-mellat-500/75 to-black/60 opacity-90 blur-[2px]" />
        <div className="pointer-events-none absolute -inset-10 rounded-[2.8rem] bg-black/35 blur-3xl" />
        <div className="pointer-events-none absolute -inset-7 rounded-[2.5rem] bg-mellat-500/25 blur-3xl" />

        <div className="relative grid overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/80 shadow-[0_45px_130px_-30px_rgba(0,0,0,0.82)] backdrop-blur-2xl lg:grid-cols-[1.05fr_1fr]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-l from-transparent via-white to-mellat-500 opacity-90" />

          <BrandPanel />

          <LoginFormCard
            onSubmit={handleSubmit}
            error={error}
            submitting={submitting}
          >
            <LoginInput
              label="نام کاربری"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="نام کاربری خود را وارد کنید"
              autoComplete="username"
              disabled={submitting}
              required
              icon={
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              }
            />

            <LoginInput
              label="کلمه عبور"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={submitting}
              required
              icon={
                <svg
                  className="h-[18px] w-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
              rightIcon={
                <PasswordToggle
                  showPassword={showPassword}
                  onToggle={() => setShowPassword((v) => !v)}
                />
              }
            />

            <LoginSubmitButton loading={submitting} disabled={submitting}>
              ورود به سامانه بانک ملت
            </LoginSubmitButton>
          </LoginFormCard>
        </div>
      </div>
    </main>
  )
}
