// ------------------------------------------------------------------
// User Profile page — animated tabs
// ------------------------------------------------------------------

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, KeyRound, History } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import PageHeader from '../../components/ui/PageHeader'
import { useAuthStore } from '../../store/authStore'

const TABS = [
  { id: 'personal', label: 'اطلاعات شخصی', icon: User },
  { id: 'password', label: 'تغییر رمز عبور', icon: KeyRound },
  { id: 'activity', label: 'فعالیت‌های اخیر', icon: History },
]

const ACTIVITIES = [
  { id: 1, action: 'ورود به سامانه', ip: '192.168.1.24', time: 'امروز، ۰۹:۱۵' },
  { id: 2, action: 'ویرایش کاربر «سارا کریمی»', ip: '192.168.1.24', time: 'امروز، ۰۸:۴۰' },
  { id: 3, action: 'دانلود گزارش تراکنش‌ها', ip: '192.168.1.24', time: 'دیروز، ۱۷:۰۵' },
  { id: 4, action: 'تغییر رمز عبور', ip: '192.168.1.24', time: 'دیروز، ۱۴:۳۰' },
  { id: 5, action: 'ورود به سامانه', ip: '192.168.1.24', time: 'دیروز، ۰۸:۰۰' },
]

export default function UserProfile() {
  const [tab, setTab] = useState('personal')
  const user = useAuthStore((s) => s.user)
  const [newsletter, setNewsletter] = useState(true)

  const activeTab = TABS.find((t) => t.id === tab)

  return (
    <div>
      <PageHeader title="پروفایل کاربری" subtitle="مشاهده و ویرایش اطلاعات حساب" />

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-surface-200 pb-3">
        {TABS.map((t) => {
          const IconComp = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative cursor-pointer rounded-xl px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-primary-600' : 'text-surface-500 hover:bg-surface-100 hover:text-surface-700'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="profile-tab"
                  className="absolute inset-0 rounded-xl bg-primary-50"
                  style={{ zIndex: -1 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="flex items-center gap-2">
                <IconComp size={16} />
                {t.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="max-w-2xl"
      >
        {tab === 'personal' && (
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-mellat-400 to-mellat-600 text-xl font-bold text-white shadow-lg shadow-primary-500/25">
                {user?.fullName?.[0] || 'م'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-surface-800">{user?.fullName || 'مدیر سیستم'}</h3>
                <p className="text-sm text-surface-500">@{user?.username || 'admin'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="نام کامل" value={user?.fullName || 'مدیر سیستم'} />
              <Field label="نام کاربری" value={user?.username || 'admin'} />
              <Field label="ایمیل" value={user?.email || 'admin@deposit.ir'} />
              <Field label="نقش" value={user?.role || 'مدیر'} />
            </div>
            <div className="mt-6 flex items-center justify-between rounded-xl bg-surface-50 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-surface-700">دریافت خبرنامه</p>
                <p className="text-xs text-surface-400">اطلاع از بروزرسانی‌ها از طریق ایمیل</p>
              </div>
              <Toggle checked={newsletter} onChange={setNewsletter} />
            </div>
            <div className="mt-6 flex justify-start">
              <Button onClick={() => toast.success('اطلاعات پروفایل ذخیره شد.')}>ذخیره تغییرات</Button>
            </div>
          </Card>
        )}

        {tab === 'password' && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">رمز عبور فعلی</label>
                <input type="password" className="input" placeholder="رمز فعلی" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">رمز عبور جدید</label>
                <input type="password" className="input" placeholder="حداقل ۸ کاراکتر" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-surface-600">تکرار رمز جدید</label>
                <input type="password" className="input" placeholder="تکرار رمز جدید" />
              </div>
              <Button onClick={() => toast.success('رمز عبور با موفقیت تغییر کرد.')}>تغییر رمز عبور</Button>
            </div>
          </Card>
        )}

        {tab === 'activity' && (
          <Card className="p-6">
            <div className="space-y-1">
              {ACTIVITIES.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-surface-50"
                >
                  <div>
                    <p className="text-sm font-medium text-surface-700">{a.action}</p>
                    <p className="text-xs text-surface-400">IP: {a.ip}</p>
                  </div>
                  <span className="text-xs text-surface-400">{a.time}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
        <p className="mt-2 text-xs text-surface-400">هم‌اکنون در برگه «{activeTab?.label}» هستید.</p>
      </motion.div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-surface-400">{label}</label>
      <p className="rounded-xl border border-surface-200 px-4 py-2.5 text-sm text-surface-700">{value}</p>
    </div>
  )
}