// ------------------------------------------------------------------
// Modal — centered dialog with backdrop, used app-wide.
// Accepts any width via className (e.g. "max-w-lg").
// ------------------------------------------------------------------

import { AnimatePresence, motion } from 'framer-motion'
import { backdropFade, modalPop } from '../../animations/animationVariants'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  className?: string
  size?: ModalSize
}

export default function Modal({ open, onClose, title, children, className = '', size = 'md' }: ModalProps) {
  const sizes: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={backdropFade}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalPop}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-full ${sizes[size]} ${className} max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-surface-800">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg p-1.5 text-surface-500 transition-colors duration-150 hover:bg-surface-100 hover:text-surface-700"
                aria-label="بستن"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}