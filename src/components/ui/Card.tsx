// ------------------------------------------------------------------
// Card — reusable surface with optional hover lift effect
// ------------------------------------------------------------------

import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -3, boxShadow: '0 10px 28px -8px rgba(15, 23, 42, 0.12)' } : undefined}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`card ${hover ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}