// ------------------------------------------------------------------
// PageHeader — consistent title + subtitle + optional actions row
// ------------------------------------------------------------------

import { motion } from 'framer-motion'
import { fadeIn } from '../../animations/animationVariants'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="mb-6 flex flex-wrap items-center justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-extrabold text-surface-800">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-surface-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  )
}