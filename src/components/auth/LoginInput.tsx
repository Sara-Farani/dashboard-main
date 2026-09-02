import { type InputHTMLAttributes, type ReactNode } from 'react'

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon: ReactNode
  rightIcon?: ReactNode
}

/**
 * Styled input field for the login form with icon support.
 */
export default function LoginInput({
  label,
  icon,
  rightIcon,
  ...inputProps
}: LoginInputProps) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-bold text-login-900">
        {label}
      </label>

      <div className="group relative">
        {/* Left icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-login-500 transition group-focus-within:text-mellat-500">
          {icon}
        </div>

        <input
          {...inputProps}
          className="w-full rounded-2xl border border-login-200 bg-white/90 py-3.5 pl-4 pr-11 text-[15px] text-login-900 outline-none shadow-[0_5px_15px_-12px_rgba(0,0,0,0.25)] transition-all placeholder:text-login-400 focus:border-mellat-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(237,28,36,0.12)] disabled:bg-login-100 disabled:opacity-60"
        />

        {/* Right action button (e.g., password toggle) */}
        {rightIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  )
}
