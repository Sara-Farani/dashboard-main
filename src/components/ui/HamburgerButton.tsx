// src/components/HamburgerButton.tsx
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUiStore } from '../../store/uiStore'

export default function HamburgerButton() {
  const mobileOpen = useUiStore((s) => s.mobileOpen)
  const setMobileOpen = useUiStore((s) => s.setMobileOpen)

  return (
    <motion.button
      type="button"
      onClick={() => setMobileOpen(!mobileOpen)}
      className="fixed top-16 right-4 z-45 lg:hidden flex items-center justify-center
                 w-10 h-10 rounded-lg bg-white shadow-md border border-surface-200
                 hover:bg-surface-50 transition-colors"
      aria-label="باز کردن منو"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.span
        initial={false}
        animate={{ rotate: mobileOpen ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="inline-flex"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </motion.span>
    </motion.button>
  )
}