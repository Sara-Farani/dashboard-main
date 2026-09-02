// ------------------------------------------------------------------
// Toggle switch — animated, used for status / settings
// ------------------------------------------------------------------

import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mellat-500 ${
        checked
          ? 'bg-gradient-to-b from-mellat-400 to-mellat-600 shadow-md shadow-mellat-500/40'
          : 'bg-surface-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow-sm ${
          checked ? 'ms-5' : 'ms-1'
        }`}
      />
    </button>
  )
}