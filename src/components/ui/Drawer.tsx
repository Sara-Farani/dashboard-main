// ------------------------------------------------------------------
// Drawer — slide-in panel from the inline end (right in RTL).
// ------------------------------------------------------------------

import { AnimatePresence, motion } from 'framer-motion'
import { backdropFade, slideInRight } from '../../animations/animationVariants'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  width?: string
}

export default function Drawer({ open, onClose, title, children, width = 'max-w-md' }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-surface-900/50 backdrop-blur-sm"
          />
          <motion.aside
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: 80, transition: { duration: 0.2 } }}
            className={`fixed inset-y-0 end-0 z-50 flex w-full ${width} flex-col bg-white shadow-2xl`}
          >
            <div className="flex items-center justify-between border-b border-surface-200 p-5">
              <h3 className="text-lg font-bold text-surface-800">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg p-1.5 text-surface-500 transition-colors duration-150 hover:bg-surface-100"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}