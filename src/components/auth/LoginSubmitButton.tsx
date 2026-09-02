import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface LoginSubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  children: ReactNode
}

/**
 * Styled submit button for the login form with loading state and shine effect.
 */
export default function LoginSubmitButton({
  loading = false,
  loadingText = 'در حال ورود...',
  children,
  ...buttonProps
}: LoginSubmitButtonProps) {
  return (
    <button
      {...buttonProps}
      type="submit"
      disabled={loading || buttonProps.disabled}
      className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-[15px] text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55 bg-mellat-500 shadow-[0_18px_42px_-14px_rgba(237,28,36,0.9),inset_0_1px_0_rgba(255,255,255,0.32)] hover:bg-mellat-600"
    >
      {/* Gradient overlay */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20" />

      {/* Shine effect */}
      <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />

      {loading ? (
        <>
          <svg className="relative h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-90"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          <span className="relative">{loadingText}</span>
        </>
      ) : (
        <span className="relative">{children}</span>
      )}
    </button>
  )
}
