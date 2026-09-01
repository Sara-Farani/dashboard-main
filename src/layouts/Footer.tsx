// src/layouts/Footer.tsx

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Footer() {
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-20px' })

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 16 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 bottom-0 z-[60] h-16 border-t border-surface-200/70 bg-white/95 px-6 py-2 backdrop-blur"
    >
      <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-surface-400 sm:flex-row sm:justify-between">
        <p>کلیه حقوق محفوظ است © ۱۴۰۵ — deposit-fileMng-dashboard</p>

        <p className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-success-500" />
          تمام سرویس‌ها فعال هستند
        </p>
      </div>
    </motion.footer>
  )
}