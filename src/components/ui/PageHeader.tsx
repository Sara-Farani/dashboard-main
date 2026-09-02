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
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-700 shadow-md shadow-mellat-500/40" />
        <div>
          <h1 className="text-2xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(15,17,22,0.45)]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-white/70">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </motion.div>
  )
}