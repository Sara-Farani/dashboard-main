import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  Bell,
  CheckCircle2,
  Clock3,
  Globe2,
  MonitorCog,
  Moon,
  Palette,
  RotateCcw,
  Save,
  Settings2,
} from 'lucide-react'

import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Toggle from '../../components/ui/Toggle'
import PageHeader from '../../components/ui/PageHeader'
import {
  staggerContainer,
  staggerItem,
} from '../../animations/animationVariants'

type GeneralSettingsState = {
  darkMode: boolean
  notifications: boolean
  autoRefresh: boolean
  rtl: boolean
}

type SettingItem = {
  key: keyof GeneralSettingsState
  label: string
  description: string
  icon: typeof Palette
}

const STORAGE_KEY = 'general-settings'

const defaultSettings: GeneralSettingsState = {
  darkMode: false,
  notifications: true,
  autoRefresh: true,
  rtl: true,
}

const displaySettings: SettingItem[] = [
  {
    key: 'darkMode',
    label: 'حالت تاریک',
    description:
      'استفاده از پوسته تاریک در بخش‌های پشتیبانی‌شده سامانه.',
    icon: Moon,
  },
  {
    key: 'notifications',
    label: 'اعلان‌های دسکتاپ',
    description:
      'نمایش اعلان‌های مهم سامانه در مرورگر، در صورت تأیید دسترسی.',
    icon: Bell,
  },
  {
    key: 'autoRefresh',
    label: 'به‌روزرسانی خودکار',
    description:
      'به‌روزرسانی خودکار اطلاعات و داده‌های داشبورد در بازه‌های زمانی مشخص.',
    icon: Clock3,
  },
  {
    key: 'rtl',
    label: 'چیدمان راست‌به‌چپ',
    description:
      'نمایش رابط کاربری با جهت نوشتار راست‌به‌چپ برای زبان فارسی.',
    icon: Globe2,
  },
]

const readSettingsFromStorage = (): GeneralSettingsState => {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY)

    if (!storedValue) {
      return defaultSettings
    }

    const parsedValue = JSON.parse(storedValue) as Partial<GeneralSettingsState>

    return {
      ...defaultSettings,
      ...parsedValue,
    }
  } catch {
    return defaultSettings
  }
}

const applyVisualSettings = (settings: GeneralSettingsState) => {
  document.documentElement.dir = settings.rtl ? 'rtl' : 'ltr'
  document.documentElement.lang = settings.rtl ? 'fa' : 'en'

  document.documentElement.classList.toggle(
    'dark',
    settings.darkMode,
  )
}

export default function GeneralSettings() {
  const [settings, setSettings] = useState<GeneralSettingsState>(
    readSettingsFromStorage,
  )

  const [savedSettings, setSavedSettings] =
    useState<GeneralSettingsState>(settings)

  useEffect(() => {
    applyVisualSettings(settings)
  }, [settings])

  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings)
  }, [settings, savedSettings])

  const handleToggleChange = (
    key: keyof GeneralSettingsState,
    value: boolean,
  ) => {
    setSettings((previousSettings) => ({
      ...previousSettings,
      [key]: value,
    }))
  }

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))

      setSavedSettings(settings)

      toast.success('تنظیمات عمومی با موفقیت ذخیره شد.')
    } catch {
      toast.error('ذخیره تنظیمات در مرورگر با خطا مواجه شد.')
    }
  }

  const handleReset = () => {
    setSettings(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)

    toast.success('تنظیمات به حالت پیش‌فرض بازگردانده شد.')
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        title="تنظیمات عمومی"
        subtitle="مدیریت تنظیمات نمایش، اعلان‌ها و رفتار کلی سامانه"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              icon={RotateCcw}
              variant="secondary"
              onClick={handleReset}
            >
              بازگردانی پیش‌فرض
            </Button>

            <Button
              icon={Save}
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
            >
              ذخیره تغییرات
            </Button>
          </div>
        }
      />

      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="space-y-5"
      >
        {/* کارت راهنما و وضعیت تنظیمات */}
        <motion.div variants={staggerItem}>
          <Card className="overflow-hidden p-0">
            <div className="flex flex-col gap-4 bg-gradient-to-l from-mellat-50 via-white to-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white shadow-lg shadow-mellat-500/30">
                  <Settings2 className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-surface-800">
                    شخصی‌سازی محیط سامانه
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-surface-500">
                    تغییرات پس از انتخاب گزینه «ذخیره تغییرات» در مرورگر شما
                    نگهداری می‌شوند.
                  </p>
                </div>
              </div>

              <div
                className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-medium sm:self-auto ${
                  hasUnsavedChanges
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />

                {hasUnsavedChanges
                  ? 'تغییرات ذخیره نشده است'
                  : 'تنظیمات ذخیره شده است'}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* تنظیمات نمایش */}
        <motion.div variants={staggerItem}>
          <Card className="p-0">
            <div className="flex items-center gap-3 border-b border-surface-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mellat-50 text-mellat-600">
                <MonitorCog className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-surface-800">
                  نمایش و رابط کاربری
                </h3>

                <p className="mt-1 text-xs text-surface-400">
                  تنظیمات مربوط به ظاهر و جهت نمایش سامانه
                </p>
              </div>
            </div>

            <div className="divide-y divide-surface-100">
              {displaySettings
                .filter(
                  (setting) =>
                    setting.key === 'darkMode' || setting.key === 'rtl',
                )
                .map((setting) => {
                  const Icon = setting.icon

                  return (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-surface-800">
                            {setting.label}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-surface-400">
                            {setting.description}
                          </p>
                        </div>
                      </div>

                      <Toggle
                        checked={settings[setting.key]}
                        onChange={(value) =>
                          handleToggleChange(setting.key, value)
                        }
                      />
                    </div>
                  )
                })}
            </div>
          </Card>
        </motion.div>

        {/* تنظیمات رفتار سامانه */}
        <motion.div variants={staggerItem}>
          <Card className="p-0">
            <div className="flex items-center gap-3 border-b border-surface-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mellat-50 text-mellat-600">
                <Bell className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-surface-800">
                  اعلان‌ها و به‌روزرسانی
                </h3>

                <p className="mt-1 text-xs text-surface-400">
                  مدیریت نحوه اطلاع‌رسانی و دریافت اطلاعات جدید
                </p>
              </div>
            </div>

            <div className="divide-y divide-surface-100">
              {displaySettings
                .filter(
                  (setting) =>
                    setting.key === 'notifications' ||
                    setting.key === 'autoRefresh',
                )
                .map((setting) => {
                  const Icon = setting.icon

                  return (
                    <div
                      key={setting.key}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-surface-800">
                            {setting.label}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-surface-400">
                            {setting.description}
                          </p>
                        </div>
                      </div>

                      <Toggle
                        checked={settings[setting.key]}
                        onChange={(value) =>
                          handleToggleChange(setting.key, value)
                        }
                      />
                    </div>
                  )
                })}
            </div>
          </Card>
        </motion.div>

        {/* نوار ذخیره پایین صفحه برای موبایل */}
        <motion.div
          variants={staggerItem}
          className="flex justify-end sm:hidden"
        >
          <Button
            icon={Save}
            onClick={handleSave}
            disabled={!hasUnsavedChanges}
          >
            ذخیره تغییرات
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}