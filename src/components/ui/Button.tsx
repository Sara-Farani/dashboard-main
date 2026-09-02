// ------------------------------------------------------------------
// Button — motion-enabled, 3 variants, loading + icon support
// ------------------------------------------------------------------

import { motion, type HTMLMotionProps } from 'framer-motion'
import { Loader2, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white hover:from-mellat-500 hover:to-mellat-700 shadow-md shadow-mellat-500/40',
  secondary:
    'bg-white/85 text-surface-700 hover:bg-white border border-surface-200 backdrop-blur',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-sm shadow-danger-500/30',
  ghost: 'text-surface-600 hover:bg-white/70',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
}

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: LucideIcon
  className?: string
  full?: boolean
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  full = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled || loading ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled || loading ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mellat-500',
        variants[variant],
        sizes[size],
        full && 'w-full',
        (disabled || loading) && 'opacity-50 pointer-events-none',
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} />
      )}
      {children}
    </motion.button>
  )
}