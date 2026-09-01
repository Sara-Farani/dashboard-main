import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  LogOut,
  Settings,
  User,
  UserRound,
} from 'lucide-react'

import { useAuthStore } from '../store/authStore'
import Dropdown, { DropdownItem } from '../components/ui/Dropdown'
import Modal from '../components/ui/Modal'
import { fadeIn } from '../animations/animationVariants'
import mellatLogo from '../assets/images/mellat-logo-02.png'

export default function Header() {
  const [confirmOpen, setConfirmOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const navigate = useNavigate()

  /*
    ابتدا نام و نام خانوادگی نمایش داده می‌شود.
    اگر موجود نبود، username و در نهایت متن پیش‌فرض نمایش داده می‌شود.
  */
  const fullName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() ||
    user?.username ||
    'مدیر سیستم'

  const avatarLetter = fullName.charAt(0) || 'م'

  const handleLogout = () => {
    logout()

    toast.success('با موفقیت خارج شدید.')
    navigate('/login', { replace: true })
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center border-b border-surface-200/70 bg-white/90 px-3 backdrop-blur-xl sm:px-5 lg:px-8 sm:pr-3 lg:pr-3">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex w-full items-center justify-between"
        >
          {/* سمت راست در RTL: لوگو و عنوان */}
          <div className="flex items-center gap-3">
            <img
              src={mellatLogo}
              alt="لوگوی بانک ملت"
              className="h-10 w-10 shrink-0 self-center object-contain"
            />

            <div>
              <h2 className="text-sm font-bold text-surface-800">
                داشبورد مدیریت پردازش های گروهی
              </h2>

              <p className="hidden text-xs text-surface-400 sm:block">
                مدیریت فایل‌ها
              </p>
            </div>
          </div>

          {/* سمت چپ در RTL: منوی کاربر */}
          <div className="flex items-center gap-2">
            <Dropdown
              align="end"
              triggerClassName="cursor-pointer rounded-xl outline-none focus:ring-2 focus:ring-primary-400"
              trigger={
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 text-xs font-bold text-white shadow-md shadow-primary-500/30">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-surface-700">
                      {fullName}
                    </p>

                    <p className="text-xs text-surface-400">
                      {user?.username || 'کاربر سامانه'}
                    </p>
                  </div>
                </div>
              }
            >
              <Link to="/profile">
                <DropdownItem icon={User}>پروفایل کاربری</DropdownItem>
              </Link>

              <Link to="/settings/general">
                <DropdownItem icon={Settings}>تنظیمات</DropdownItem>
              </Link>

              <hr className="my-1 border-surface-100" />

              <DropdownItem
                icon={LogOut}
                danger
                onClick={() => setConfirmOpen(true)}
              >
                خروج از حساب
              </DropdownItem>
            </Dropdown>
          </div>
        </motion.div>
      </header>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="تأیید خروج"
      >
        <p className="text-sm text-surface-600">
          آیا از خروج از حساب کاربری خود اطمینان دارید؟
        </p>

        <div className="mt-6 flex justify-start gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl bg-danger-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-danger-600"
          >
            بله، خارج شو
          </button>

          <button
            type="button"
            onClick={() => setConfirmOpen(false)}
            className="rounded-xl bg-surface-100 px-5 py-2 text-sm font-medium text-surface-700 transition-colors hover:bg-surface-200"
          >
            انصراف
          </button>
        </div>
      </Modal>
    </>
  )
}