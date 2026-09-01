// ------------------------------------------------------------------
// Permissions management page
// ------------------------------------------------------------------

import { motion } from 'framer-motion'
import { KeyRound, Check, X } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import PageHeader from '../../components/ui/PageHeader'

const PERMISSIONS = [
  { module: 'مدیریت کاربران', create: true, read: true, update: true, delete: false },
  { module: 'گزارش تراکنش‌ها', create: false, read: true, update: false, delete: false },
  { module: 'نقش‌ها و دسترسی‌ها', create: true, read: true, update: true, delete: true },
  { module: 'اعلان‌ها', create: true, read: true, update: true, delete: false },
  { module: 'تنظیمات سیستم', create: false, read: true, update: true, delete: false },
  { module: 'پروفایل کاربری', create: false, read: true, update: true, delete: false },
]

function PermIcon({ value }: { value: boolean }) {
  return value ? (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-success-100 text-success-600"><Check size={14} /></span>
  ) : (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-surface-100 text-surface-400"><X size={14} /></span>
  )
}

export default function Permissions() {
  return (
    <div>
      <PageHeader
        title="دسترسی‌ها"
        subtitle="مدیریت سطوح دسترسی هر نقش در سامانه"
        actions={<Button icon={KeyRound}>ذخیره تغییرات</Button>}
      />
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-50/70 text-xs text-surface-500">
                <th className="px-6 py-3.5 text-start font-medium">ماژول</th>
                <th className="px-6 py-3.5 text-center font-medium">ایجاد</th>
                <th className="px-6 py-3.5 text-center font-medium">مشاهده</th>
                <th className="px-6 py-3.5 text-center font-medium">ویرایش</th>
                <th className="px-6 py-3.5 text-center font-medium">حذف</th>
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p, i) => (
                <motion.tr
                  key={p.module}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-surface-800">{p.module}</td>
                  <td className="px-6 py-4 text-center"><PermIcon value={p.create} /></td>
                  <td className="px-6 py-4 text-center"><PermIcon value={p.read} /></td>
                  <td className="px-6 py-4 text-center"><PermIcon value={p.update} /></td>
                  <td className="px-6 py-4 text-center"><PermIcon value={p.delete} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}