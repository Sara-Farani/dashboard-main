import { useEffect, useState } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'

import Sidebar from './Sidebar'
import Header from './Header'
import AppBackground from '../components/layout/AppBackground'
import { useAuthStore } from '../store/authStore'

const DashboardLayout = () => {
  const navigate = useNavigate()

  /*
    Sidebar در شروع برنامه بسته است.
    در این حالت فقط نوار 72 پیکسلی آیکون‌ها نمایش داده می‌شود.
  */
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  const isRestoringSession = useAuthStore(
    (state) => state.isRestoringSession,
  )

  const restoreSession = useAuthStore((state) => state.restoreSession)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    if (hasHydrated && token && !user) {
      void restoreSession()
    }
  }, [hasHydrated, token, user, restoreSession])

  if (!hasHydrated || (token && !user) || isRestoringSession) {
    return (
      <div
        dir="rtl"
        className="flex min-h-screen items-center justify-center bg-[linear-gradient(160deg,#B7BDC6_0%,#9AA1AC_30%,#5B6270_65%,#2E323A_100%)] text-sm text-white/80"
      >
        در حال بررسی اطلاعات کاربر...
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  /*
    این مقادیر باید با عرض Sidebar یکسان باشند:

    Sidebar باز:    w-72       = 288px
    Sidebar بسته:  w-[72px]   = 72px

    در موبایل، Sidebar روی محتوای اصلی قرار می‌گیرد؛
    بنابراین margin فقط در lg اعمال می‌شود.
  */
  const contentRightMarginClass = isSidebarOpen
    ? 'lg:mr-72'
    : 'lg:mr-[72px]'

  const toggleSidebar = () => {
    setIsSidebarOpen((previousIsOpen) => !previousIsOpen)
  }

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen flex-col overflow-x-hidden"
    >
      <AppBackground />

      {/* Header همیشه تمام عرض صفحه است */}
      <Header />

      <Sidebar
        isOpen={isSidebarOpen}
        onOpen={() => setIsSidebarOpen(true)}
        onToggle={toggleSidebar}
        onLogout={handleLogout}
      />

      {/* محتوای صفحات */}
      <main
        className={`flex-1 px-4 pb-10 pt-24 transition-[margin-right] duration-300 ease-in-out sm:px-5 lg:px-8 ${contentRightMarginClass}`}
      >
        <Outlet />
      </main>

      {/* Footer نیز در دسکتاپ کنار Sidebar قرار می‌گیرد */}
      <footer
        className={`border-t border-white/25 bg-[#1E2128]/85 px-5 py-4 text-center text-xs text-white/55 backdrop-blur-xl transition-[margin-right] duration-300 ease-in-out ${contentRightMarginClass}`}
      >
        تمامی حقوق محفوظ است.
      </footer>
    </div>
  )
}

export default DashboardLayout