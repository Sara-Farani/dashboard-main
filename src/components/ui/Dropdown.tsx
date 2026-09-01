// ------------------------------------------------------------------
// Dropdown — click-outside close + spring pop animation.
// RTL-aware: menu grows from the inline end of the trigger.
// ------------------------------------------------------------------

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'end'
  triggerClassName?: string
}

export default function Dropdown({
  trigger,
  children,
  align = 'end', // 'start' | 'end' (RTL-aware inline positioning)
  triggerClassName = '',
}: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex cursor-pointer items-center gap-2 ${triggerClassName}`}
      >
        {trigger}
        <ChevronDown
          size={16}
          className={`text-surface-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className={`absolute top-full z-50 mt-2 min-w-44 rounded-xl border border-surface-200 bg-white p-1.5 shadow-xl shadow-surface-900/10 ${
              align === 'end' ? 'end-0' : 'start-0'
            }`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface DropdownItemProps {
  icon?: LucideIcon
  children: ReactNode
  onClick?: () => void
  danger?: boolean
}

export function DropdownItem({ icon: Icon, children, onClick, danger = false }: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
        danger ? 'text-danger-600 hover:bg-danger-50' : 'text-surface-700 hover:bg-surface-100'
      }`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}