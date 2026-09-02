import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  FolderTree,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  User,
  UserCog,
  Users,
  MonitorCloud,
  Landmark,
  LayersPlus,
  type LucideIcon,
} from 'lucide-react'

import { getMyMenus } from '../services/menuService'
import type { AppMenuItem } from '../types/menu'

type SidebarProps = {
  isOpen: boolean
  onOpen: () => void
  onToggle: () => void
  onLogout?: () => void
}

/*
  شناسه داخلی و یکتای هر منو در ساختار Sidebar.
  این مقدار به شناسه دیتابیس وابسته نیست.
*/
type SidebarMenuItem = AppMenuItem & {
  sidebarKey: string
  children: SidebarMenuItem[]
}

type OpenSubmenusState = Record<string, boolean>

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  BarChart3,
  ShieldCheck,
  UserCog,
  KeyRound,
  Bell,
  Settings,
  SlidersHorizontal,
  Lock,
  User,
  FolderTree,
  MonitorCloud,
  Landmark,
  LayersPlus,
}

const getMenuIcon = (iconName: string | null): LucideIcon => {
  if (!iconName) {
    return CircleHelp
  }

  return iconMap[iconName] ?? CircleHelp
}

const createSidebarMenuTree = (
  items: AppMenuItem[],
  parentKey = 'root',
): SidebarMenuItem[] => {
  return items.map((item, index) => {
    const sidebarKey = `${parentKey}-${index}`

    return {
      ...item,
      sidebarKey,
      children: createSidebarMenuTree(item.children ?? [], sidebarKey),
    }
  })
}

const isRouteActive = (
  currentPath: string,
  routePath: string | null,
): boolean => {
  if (!routePath) {
    return false
  }

  if (routePath === '/dashboard') {
    return currentPath === '/dashboard'
  }

  return (
    currentPath === routePath ||
    currentPath.startsWith(`${routePath}/`)
  )
}

const hasActiveChild = (
  menu: SidebarMenuItem,
  currentPath: string,
): boolean => {
  if (isRouteActive(currentPath, menu.routePath)) {
    return true
  }

  return menu.children.some((child) =>
    hasActiveChild(child, currentPath),
  )
}

const Sidebar = ({
  isOpen,
  onOpen,
  onToggle,
  onLogout,
}: SidebarProps) => {
  const location = useLocation()

  const [menus, setMenus] = useState<SidebarMenuItem[]>([])
  const [isLoadingMenus, setIsLoadingMenus] = useState(true)
  const [menuError, setMenuError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const [openSubmenus, setOpenSubmenus] =
    useState<OpenSubmenusState>({})

  const isGeneralSettingsActive =
    location.pathname === '/settings/general'

  useEffect(() => {
    let isMounted = true

    const loadMenus = async () => {
      try {
        setIsLoadingMenus(true)
        setMenuError('')

        const response = await getMyMenus()

        if (!isMounted) {
          return
        }

        setMenus(createSidebarMenuTree(response.menus))
      } catch (error) {
        if (!isMounted) {
          return
        }

        setMenus([])

        setMenuError(
          error instanceof Error
            ? error.message
            : 'خطا در دریافت منوهای برنامه.',
        )
      } finally {
        if (isMounted) {
          setIsLoadingMenus(false)
        }
      }
    }

    void loadMenus()

    return () => {
      isMounted = false
    }
  }, [])

  const toggleCurrentSubmenu = (sidebarKey: string) => {
    setOpenSubmenus((previousState) => ({
      ...previousState,
      [sidebarKey]: !previousState[sidebarKey],
    }))
  }

  /*
    در حالت بسته، کلیک روی منوی دارای زیرمنو:
    - Sidebar را باز می‌کند.
    - همان زیرمنو را باز می‌کند.
  */
  const openCurrentSubmenuFromCollapsedSidebar = (
    sidebarKey: string,
  ) => {
    setOpenSubmenus((previousState) => ({
      ...previousState,
      [sidebarKey]: true,
    }))

    onOpen()
  }

  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024 && isOpen) {
      onToggle()
    }
  }

  const handleLogout = () => {
    if (!onLogout || isLoggingOut) {
      return
    }

    setIsLoggingOut(true)
    onLogout()
  }

  const renderExpandedMenuItem = (
    menu: SidebarMenuItem,
    level = 0,
  ) => {
    const Icon = getMenuIcon(menu.iconName)
    const hasChildren = menu.children.length > 0
    const isCurrentMenuOpen =
      openSubmenus[menu.sidebarKey] === true

    const isActive = hasActiveChild(menu, location.pathname)
    const paddingRight = 12 + level * 16

    if (hasChildren) {
      return (
        <li key={menu.sidebarKey}>
          <button
            type="button"
            aria-expanded={isCurrentMenuOpen}
            onClick={() => toggleCurrentSubmenu(menu.sidebarKey)}
            className={`flex w-full items-center justify-between rounded-xl py-3 pl-3 text-sm font-medium transition ${
              isActive
                ? 'bg-mellat-50 text-mellat-700'
                : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`}
            style={{ paddingRight }}
          >
            <span className="flex min-w-0 items-center gap-3">
              <Icon className="h-5 w-5 shrink-0" />

              <span className="truncate">{menu.title}</span>
            </span>

            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                isCurrentMenuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCurrentMenuOpen && (
            <ul className="mt-1 space-y-1 border-r-2 border-surface-100 py-1">
              {menu.children.map((child) =>
                renderExpandedMenuItem(child, level + 1),
              )}
            </ul>
          )}
        </li>
      )
    }

    if (!menu.routePath) {
      return (
        <li key={menu.sidebarKey}>
          <div
            className="flex items-center gap-3 rounded-xl py-3 pl-3 text-sm text-surface-400"
            style={{ paddingRight }}
          >
            <Icon className="h-5 w-5 shrink-0" />

            <span className="truncate">{menu.title}</span>
          </div>
        </li>
      )
    }

    return (
      <li key={menu.sidebarKey}>
        <NavLink
          to={menu.routePath}
          onClick={closeSidebarOnMobile}
          style={{ paddingRight }}
          className={() => {
            const itemIsActive = isRouteActive(
              location.pathname,
              menu.routePath,
            )

            return `flex items-center rounded-xl py-3 pl-3 text-sm font-medium transition ${
              itemIsActive
                ? 'bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white shadow-md shadow-mellat-500/40'
                : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
            }`
          }}
        >
          <span className="flex min-w-0 items-center gap-3">
            <Icon className="h-5 w-5 shrink-0" />

            <span className="truncate">{menu.title}</span>
          </span>
        </NavLink>
      </li>
    )
  }

  const renderCollapsedMenuItem = (menu: SidebarMenuItem) => {
    const Icon = getMenuIcon(menu.iconName)
    const hasChildren = menu.children.length > 0
    const isActive = hasActiveChild(menu, location.pathname)

    const itemClassName = `flex h-11 w-11 items-center justify-center rounded-xl transition ${
      isActive
        ? 'bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white shadow-md shadow-mellat-500/40'
        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
    }`

    if (hasChildren) {
      return (
        <li key={menu.sidebarKey}>
          <button
            type="button"
            title={menu.title}
            aria-label={menu.title}
            onClick={() =>
              openCurrentSubmenuFromCollapsedSidebar(menu.sidebarKey)
            }
            className={itemClassName}
          >
            <Icon className="h-5 w-5" />
          </button>
        </li>
      )
    }

    if (!menu.routePath) {
      return (
        <li key={menu.sidebarKey}>
          <div
            title={menu.title}
            aria-label={menu.title}
            className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl text-surface-400"
          >
            <Icon className="h-5 w-5" />
          </div>
        </li>
      )
    }

    return (
      <li key={menu.sidebarKey}>
        <NavLink
          to={menu.routePath}
          title={menu.title}
          aria-label={menu.title}
          onClick={closeSidebarOnMobile}
          className={itemClassName}
        >
          <Icon className="h-5 w-5" />
        </NavLink>
      </li>
    )
  }

  return (
    <>
      {/* Overlay فقط در موبایل و فقط هنگام باز بودن Sidebar نمایش داده می‌شود. */}
      {isOpen && (
        <button
          type="button"
          aria-label="بستن منوی کناری"
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/45 lg:hidden"
        />
      )}

      <aside
        dir="rtl"
        className={`fixed right-0 top-16 z-40 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden border-l border-surface-200 bg-white/95 shadow-xl transition-[width] duration-300 ease-in-out ${
          isOpen ? 'w-72' : 'w-[72px]'
        }`}
      >
        {/* نوار بالای Sidebar */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-surface-100 ${
            isOpen ? 'justify-between px-3' : 'justify-center px-3'
          }`}
        >
          {isOpen ? (
            <>
              {/* رفتن به تنظیمات عمومی فقط در Sidebar باز */}
              <NavLink
                to="/settings/general"
                onClick={closeSidebarOnMobile}
                title="تنظیمات عمومی"
                aria-label="تنظیمات عمومی"
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition focus:outline-none focus:ring-2 focus:ring-mellat-400 ${
                  isGeneralSettingsActive
                    ? 'bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white shadow-md shadow-mellat-500/40'
                    : 'text-surface-600 hover:bg-mellat-50 hover:text-mellat-700'
                }`}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </NavLink>

              <span className="mx-2 flex-1 truncate text-center text-sm font-bold text-surface-700">
                منوی سامانه
              </span>

              {/* بستن Sidebar */}
              <button
                type="button"
                onClick={onToggle}
                aria-label="بستن منوی کناری"
                aria-expanded="true"
                title="بستن منوی کناری"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-surface-600 transition hover:bg-mellat-50 hover:text-mellat-700 focus:outline-none focus:ring-2 focus:ring-mellat-400"
              >
                <ChevronsRight className="h-5 w-5" />
              </button>
            </>
          ) : (
            /* باز کردن Sidebar در حالت بسته */
            <button
              type="button"
              onClick={onToggle}
              aria-label="باز کردن منوی کناری"
              aria-expanded="false"
              title="باز کردن منوی کناری"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-surface-600 transition hover:bg-mellat-50 hover:text-mellat-700 focus:outline-none focus:ring-2 focus:ring-mellat-400"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav
          className={`flex-1 overflow-y-auto py-4 ${
            isOpen ? 'px-3' : 'px-[14px]'
          }`}
        >
          {isLoadingMenus && (
            <div
              className={`flex items-center justify-center text-surface-500 ${
                isOpen ? 'flex-col gap-3 py-10 text-sm' : 'py-4'
              }`}
            >
              <LoaderCircle className="h-6 w-6 animate-spin text-mellat-500" />

              {isOpen && <span>در حال دریافت منوها...</span>}
            </div>
          )}

          {!isLoadingMenus && menuError && (
            <>
              {isOpen ? (
                <div className="rounded-xl border border-mellat-200 bg-mellat-50 p-3 text-center text-xs leading-6 text-mellat-600">
                  {menuError}
                </div>
              ) : (
                <div
                  title={menuError}
                  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-mellat-600"
                >
                  <CircleHelp className="h-5 w-5" />
                </div>
              )}
            </>
          )}

          {!isLoadingMenus &&
            !menuError &&
            menus.length === 0 &&
            isOpen && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center text-xs leading-6 text-amber-700">
                هیچ منوی فعالی برای نقش این کاربر تعریف نشده است.
              </div>
            )}

          {!isLoadingMenus && !menuError && menus.length > 0 && (
            <ul className={isOpen ? 'space-y-1.5' : 'space-y-2'}>
              {isOpen
                ? menus.map((menu) => renderExpandedMenuItem(menu))
                : menus.map((menu) => renderCollapsedMenuItem(menu))}
            </ul>
          )}
        </nav>

        {/* <div
          className={`border-t border-surface-100 ${
            isOpen ? 'p-3' : 'px-[14px] py-3'
          }`}
        >
          <button
            type="button"
            title="خروج از حساب"
            aria-label="خروج از حساب"
            onClick={handleLogout}
            disabled={!onLogout || isLoggingOut}
            className={`flex rounded-xl text-mellat-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 ${
              isOpen
                ? 'w-full items-center gap-3 px-3 py-3 text-sm font-medium'
                : 'h-11 w-11 items-center justify-center'
            }`}
          >
            {isLoggingOut ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <LogOut className="h-5 w-5" />
            )}

            {isOpen &&
              (isLoggingOut ? 'در حال خروج...' : 'خروج از حساب')}
          </button>
        </div> */}
      </aside>
    </>
  )
}

export default Sidebar