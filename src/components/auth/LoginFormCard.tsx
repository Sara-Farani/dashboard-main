import { type FormEvent, type ReactNode } from 'react'

interface LoginFormCardProps {
  children: ReactNode
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  error?: string
  submitting?: boolean
}

/**
 * The form panel displayed on the right side of the login card.
 * Contains mobile header, form title, and form content.
 */
export default function LoginFormCard({
  children,
  onSubmit,
  error,
  submitting,
}: LoginFormCardProps) {
  return (
    <section className="relative bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(246,247,249,0.97)_55%,rgba(229,232,237,0.98)_100%)] p-7 sm:p-10">
      {/* Top gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg, #17181C, #9B1016, #ED1C24, #FF7A7F, #ED1C24)',
        }}
      />

      {/* Background glows */}
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-mellat-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-[#1B1D22]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[15%] top-[18%] h-32 w-32 rounded-full bg-white/90 blur-3xl" />

      {/* Mobile header */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-mellat-500 text-white shadow-[0_14px_34px_-12px_rgba(237,28,36,0.85)]">
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/25 to-white/20" />
          <svg
            viewBox="0 0 24 24"
            className="relative h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 4l9 6.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 10v8.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V10"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-5h4v5" />
          </svg>
        </div>

        <div>
          <p className="text-lg font-black text-login-950">بانک ملت</p>
          <p className="text-xs text-login-600">سامانه الکترونیکی</p>
        </div>
      </div>

      {/* Form title */}
      <div className="relative mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-login-200 bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wide text-login-800 shadow-[0_10px_22px_-14px_rgba(0,0,0,0.35)]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mellat-500 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-mellat-500" />
          </span>
          BANK MELLAT · PREMIUM 2026
        </div>

        <h1 className="text-[1.9rem] font-black tracking-tight text-login-950">
          ورود به سامانه
        </h1>

        <p className="mt-2 text-sm text-login-600">اطلاعات کاربری خود را وارد کنید</p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-mellat-200 bg-mellat-50 px-4 py-3 text-sm text-mellat-800 shadow-sm">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white bg-mellat-500">
            !
          </span>
          <span className="leading-relaxed">{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="relative space-y-5">
        {children}
      </form>

      {/* Footer text */}
      <div className="flex items-center justify-center gap-2 pt-4 text-[11px] text-login-600">
        <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm bg-mellat-500">
          ملت
        </span>
        <span>ورود به منزله پذیرش شرایط خدمات الکترونیکی است</span>
      </div>
    </section>
  )
}
