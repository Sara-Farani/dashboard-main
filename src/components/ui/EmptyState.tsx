// ------------------------------------------------------------------
// EmptyState — for tables / lists with no data
// ------------------------------------------------------------------

import { motion } from 'framer-motion'
import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

export default function EmptyState({ title = 'موردی یافت نشد', subtitle }: { title?: ReactNode; subtitle?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-3 py-14 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-100 text-surface-400">
        <Inbox size={26} />
      </div>
      <p className="font-medium text-surface-600">{title}</p>
      {subtitle && <p className="text-sm text-surface-400">{subtitle}</p>}
    </motion.div>
  )
}