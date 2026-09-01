// ------------------------------------------------------------------
// Security Settings page
// ------------------------------------------------------------------

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Save, Shield, KeyRound, Fingerprint, Timer } from 'lucide-react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import PageHeader from '../../components/ui/PageHeader'
import { staggerContainer, staggerItem } from '../../animations/animationVariants'

export default function SecuritySettings() {
  const [twoFactor, setTwoFactor] = useState(true)
  const [sessionLock, setSessionLock] = useState(false)
  const [ipFilter, setIpFilter] = useState(true)

  const toggles = [
    { key: 'twoFactor', label: 'ورود دو مرحله‌ای', description: 'ارسال کد تأیید پیامکی هنگام ورود', icon: Shield, value: twoFactor, setter: setTwoFactor },
    { key: 'session', label: 'قفل جلسه پس از بیکاری', description: 'خروج خودکار پس از ۱۵ دقیقه عدم فعالیت', icon: Timer, value: sessionLock, setter: setSessionLock },
    { key: 'ip', label: 'محدودسازی IP مجاز', description: 'پذیرش اتصال فقط از آدرس‌های لیست سفید', icon: Fingerprint, value: ipFilter, setter: setIpFilter },
  ]

  return (
    <div>
      <PageHeader
        title="تنظیمات امنیتی"
        subtitle="مدیریت سیاست‌های امنیتی سامانه"
        actions={
          <Button icon={Save} onClick={() => toast.success('تنظیمات امنیتی ذخیره شد.')}>
            ذخیره تغییرات
          </Button>
        }
      />

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {toggles.map((t) => {
          const IconComp = t.icon
          return (
            <motion.div key={t.key} variants={staggerItem}>
              <Card className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-danger-50 text-danger-600">
                    <IconComp size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-surface-800">{t.label}</p>
                    <p className="text-xs text-surface-400">{t.description}</p>
                  </div>
                </div>
                <Toggle checked={t.value} onChange={t.setter} />
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      <motion.div variants={staggerItem} initial="hidden" animate="visible" className="mt-6">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
              <KeyRound size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-surface-800">سیاست رمز عبور</p>
              <p className="text-xs text-surface-400">حداقل ۸ کاراکتر شامل حروف بزرگ، کوچک و عدد</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-600">حداقل طول رمز</label>
              <input type="number" defaultValue={8} min={4} max={32} className="input" dir="ltr" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-surface-600">انقضای رمز (روز)</label>
              <input type="number" defaultValue={90} min={1} max={365} className="input" dir="ltr" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}