// ------------------------------------------------------------------
// Roles management page
// ------------------------------------------------------------------

import { motion } from 'framer-motion'
import { ShieldCheck, Plus, Pencil, Trash2 } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import PageHeader from '../../components/ui/PageHeader'
import { staggerContainer, staggerItem } from '../../animations/animationVariants'
import { useState } from 'react'

interface Role {
  id: number
  name: string
  description: string
  count: number
}

const ROLES: Role[] = [
  { id: 1, name: 'مدیر', description: 'دسترسی کامل به تمامی بخش‌ها', count: 3 },
  { id: 2, name: 'کارشناس', description: 'مدیریت کاربران و گزارش‌گیری', count: 12 },
  { id: 3, name: 'کاربر', description: 'مشاهده و تراکنش محدود', count: 84 },
  { id: 4, name: 'بیننده', description: 'فقط مشاهده اطلاعات', count: 29 },
]

const COLORS = [
  'from-primary-500 to-primary-600',
  'from-mellat-500 to-mellat-600',
  'from-success-500 to-success-600',
  'from-warning-500 to-warning-600',
]

export default function Roles() {
  const [confirmDelete, setConfirmDelete] = useState<Role | null>(null)

  return (
    <div>
      <PageHeader
        title="نقش‌ها"
        subtitle="مدیریت نقش‌های دسترسی سامانه"
        actions={<Button icon={Plus}>افزودن نقش جدید</Button>}
      />
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {ROLES.map((role, i) => (
          <motion.div key={role.id} variants={staggerItem}>
            <Card hover className="flex h-full flex-col p-6">
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${COLORS[i % COLORS.length]} text-white shadow-md`}>
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-bold text-surface-800">{role.name}</h3>
              <p className="mt-1 flex-1 text-sm text-surface-500">{role.description}</p>
              <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
                <span className="text-xs text-surface-400">{role.count} کاربر</span>
                <div className="flex gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer rounded-lg p-1.5 text-surface-400 hover:bg-primary-50 hover:text-primary-600"
                  >
                    <Pencil size={14} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setConfirmDelete(role)}
                    className="cursor-pointer rounded-lg p-1.5 text-surface-400 hover:bg-danger-50 hover:text-danger-600"
                  >
                    <Trash2 size={14} />
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="حذف نقش" size="sm">
        <p className="text-sm text-surface-600">
          آیا از حذف نقش «<span className="font-bold">{confirmDelete?.name}</span>» اطمینان دارید؟
        </p>
        <div className="mt-6 flex gap-3">
          <Button variant="danger" onClick={() => setConfirmDelete(null)}>بله، حذف شود</Button>
          <Button variant="secondary" onClick={() => setConfirmDelete(null)}>انصراف</Button>
        </div>
      </Modal>
    </div>
  )
}