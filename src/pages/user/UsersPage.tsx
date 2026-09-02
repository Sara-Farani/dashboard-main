import { type FormEvent, useEffect, useMemo, useState } from 'react'
import {
  Edit3,
  KeyRound,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import {
  createUser,
  deleteUser,
  getRoles,
  getUsers,
  resetUserPassword,
  updateUser,
} from '../../services/userService'
import type { RoleItem, UserItem } from '../../types/user'

type UserFormData = {
  userId: string
  firstName: string
  lastName: string
  roleId: string
  password: string
  confirmPassword: string
}

type ResetPasswordFormData = {
  password: string
  confirmPassword: string
}

const initialFormData: UserFormData = {
  userId: '',
  firstName: '',
  lastName: '',
  roleId: '',
  password: '',
  confirmPassword: '',
}

const initialResetPasswordFormData: ResetPasswordFormData = {
  password: '',
  confirmPassword: '',
}

const defaultRoleLabels: Record<string, string> = {
  SYSTEM_ADMIN: 'مدیر سیستم',
  ADMIN: 'مدیر',
  USER: 'کاربر عادی',
}

const getErrorMessage = (
  error: unknown,
  defaultMessage: string,
): string => {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response &&
    error.response.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return defaultMessage
}

const getRoleLabel = (role: RoleItem): string => {
  return role.name || defaultRoleLabels[role.code] || role.code
}

const getUserRoleLabel = (user: UserItem): string => {
  return (
    user.roleName ||
    defaultRoleLabels[user.roleCode] ||
    user.roleCode ||
    'بدون نقش'
  )
}

const UsersPage = () => {
  const [users, setUsers] = useState<UserItem[]>([])
  const [roles, setRoles] = useState<RoleItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [formData, setFormData] = useState<UserFormData>(initialFormData)

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordUser, setPasswordUser] = useState<UserItem | null>(null)
  const [passwordFormData, setPasswordFormData] =
    useState<ResetPasswordFormData>(initialResetPasswordFormData)

  const loadPageData = async () => {
    try {
      setIsLoading(true)
      setErrorMessage('')

      const [usersData, rolesData] = await Promise.all([getUsers(), getRoles()])

      setUsers(usersData)
      setRoles(rolesData)
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          'خطا در دریافت اطلاعات کاربران و نقش‌های سامانه.',
        ),
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadPageData()
  }, [])

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    if (!normalizedSearch) {
      return users
    }

    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
      const roleName = getUserRoleLabel(user).toLowerCase()

      return (
        user.userId.toLowerCase().includes(normalizedSearch) ||
        fullName.includes(normalizedSearch) ||
        roleName.includes(normalizedSearch)
      )
    })
  }, [searchTerm, users])

  const closeUserForm = () => {
    if (isSaving) {
      return
    }

    setIsFormOpen(false)
    setEditingUser(null)
    setFormData(initialFormData)
    setErrorMessage('')
  }

  const openCreateForm = () => {
    setSuccessMessage('')
    setErrorMessage('')
    setEditingUser(null)

    setFormData({
      ...initialFormData,
      roleId: roles[0]?.id ? String(roles[0].id) : '',
    })

    setIsFormOpen(true)
  }

  const openEditForm = (user: UserItem) => {
    setSuccessMessage('')
    setErrorMessage('')
    setEditingUser(user)

    setFormData({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    roleId: user.roleId ? String(user.roleId) : '',
    password: '',
    confirmPassword: '',
    })

    setIsFormOpen(true)
  }

  const updateFormField = (
    field: keyof UserFormData,
    value: string,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const validateUserForm = (): string | null => {
    if (!formData.userId.trim()) {
      return 'شناسه کاربر الزامی است.'
    }

    if (!formData.firstName.trim()) {
      return 'نام کاربر الزامی است.'
    }

    if (!formData.lastName.trim()) {
      return 'نام خانوادگی کاربر الزامی است.'
    }

    if (!formData.roleId) {
      return 'انتخاب نقش کاربر الزامی است.'
    }

    if (!editingUser && !formData.password) {
      return 'کلمه عبور برای کاربر جدید الزامی است.'
    }

    if (!editingUser && formData.password.length < 6) {
      return 'کلمه عبور باید حداقل ۶ کاراکتر باشد.'
    }

    if (!editingUser && formData.password !== formData.confirmPassword) {
      return 'کلمه عبور و تکرار آن یکسان نیستند.'
    }

    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationError = validateUserForm()

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      const basePayload = {
        userId: formData.userId.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        roleId: Number(formData.roleId),
      }

      if (editingUser) {
        await updateUser(editingUser.id, basePayload)

        setSuccessMessage('اطلاعات کاربر با موفقیت ویرایش شد.')
      } else {
        await createUser({
          ...basePayload,
          password: formData.password,
        })

        setSuccessMessage('کاربر جدید با موفقیت ایجاد شد.')
      }

      setIsFormOpen(false)
      setEditingUser(null)
      setFormData(initialFormData)

      await loadPageData()
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'ذخیره اطلاعات کاربر با خطا مواجه شد.'),
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: UserItem) => {
    const confirmed = window.confirm(
      `آیا از حذف کاربر «${user.firstName} ${user.lastName}» مطمئن هستید؟`,
    )

    if (!confirmed) {
      return
    }

    try {
      setIsDeletingId(user.id)
      setErrorMessage('')
      setSuccessMessage('')

      await deleteUser(user.id)

      setUsers((previousUsers) =>
        previousUsers.filter((currentUser) => currentUser.id !== user.id),
      )

      setSuccessMessage('کاربر با موفقیت حذف شد.')
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'حذف کاربر با خطا مواجه شد.'),
      )
    } finally {
      setIsDeletingId(null)
    }
  }

  const openResetPasswordModal = (user: UserItem) => {
    setSuccessMessage('')
    setErrorMessage('')
    setPasswordUser(user)
    setPasswordFormData(initialResetPasswordFormData)
    setIsPasswordModalOpen(true)
  }

  const closeResetPasswordModal = () => {
    if (isResettingPassword) {
      return
    }

    setIsPasswordModalOpen(false)
    setPasswordUser(null)
    setPasswordFormData(initialResetPasswordFormData)
    setErrorMessage('')
  }

  const validatePasswordForm = (): string | null => {
    if (!passwordFormData.password) {
      return 'کلمه عبور جدید الزامی است.'
    }

    if (passwordFormData.password.length < 6) {
      return 'کلمه عبور باید حداقل ۶ کاراکتر باشد.'
    }

    if (passwordFormData.password !== passwordFormData.confirmPassword) {
      return 'کلمه عبور و تکرار آن یکسان نیستند.'
    }

    return null
  }

  const handleResetPassword = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    if (!passwordUser) {
      return
    }

    const validationError = validatePasswordForm()

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    try {
      setIsResettingPassword(true)
      setErrorMessage('')
      setSuccessMessage('')

      await resetUserPassword(passwordUser.id, {
        password: passwordFormData.password,
      })

      setIsPasswordModalOpen(false)
      setPasswordUser(null)
      setPasswordFormData(initialResetPasswordFormData)

      setSuccessMessage('کلمه عبور کاربر با موفقیت تغییر کرد.')
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'تغییر کلمه عبور کاربر با خطا مواجه شد.'),
      )
    } finally {
      setIsResettingPassword(false)
    }
  }

  return (
    <div dir="rtl" className="min-h-full space-y-6">
      <section className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 text-white">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-surface-800">
                مدیریت کاربران
              </h1>

              <p className="mt-2 text-sm leading-6 text-surface-500">
                ایجاد، ویرایش، حذف و تغییر کلمه عبور کاربران سامانه
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            disabled={isLoading || roles.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:from-mellat-500 hover:to-mellat-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UserPlus className="h-5 w-5" />
            ایجاد کاربر جدید
          </button>
        </div>
      </section>

      {successMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      {errorMessage && !isFormOpen && !isPasswordModalOpen && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-surface-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-surface-400" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="جستجو بر اساس شناسه، نام یا نقش..."
              className="w-full rounded-xl border border-surface-200 py-2.5 pl-4 pr-11 text-sm text-surface-700 outline-none transition placeholder:text-surface-400 focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15"
            />
          </div>

          <button
            type="button"
            onClick={() => void loadPageData()}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-medium text-surface-600 transition hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            بروزرسانی
          </button>
        </div>

        {isLoading && (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3 text-sm text-surface-500">
            <LoaderCircle className="h-7 w-7 animate-spin text-mellat-600" />
            در حال دریافت کاربران...
          </div>
        )}

        {!isLoading && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-right">
              <thead className="bg-surface-50 text-xs text-surface-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">شناسه کاربر</th>
                  <th className="px-5 py-4 font-semibold">
                    نام و نام خانوادگی
                  </th>
                  <th className="px-5 py-4 font-semibold">نقش کاربر</th>
                  <th className="px-5 py-4 font-semibold">وضعیت</th>
                  <th className="px-5 py-4 text-center font-semibold">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="transition hover:bg-surface-50/70"
                  >
                    <td className="px-5 py-4 text-sm font-medium text-surface-700">
                      {user.userId}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-surface-700">
                        {user.firstName} {user.lastName}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-mellat-50 px-2.5 py-1 text-xs font-medium text-mellat-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {getUserRoleLabel(user)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {user.isActive === false ? (
                        <span className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                          غیرفعال
                        </span>
                      ) : (
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          فعال
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-mellat-600 transition hover:bg-mellat-50"
                          title="ویرایش کاربر"
                          aria-label="ویرایش کاربر"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => openResetPasswordModal(user)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                          title="تغییر کلمه عبور"
                          aria-label="تغییر کلمه عبور"
                        >
                          <KeyRound className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(user)}
                          disabled={isDeletingId === user.id}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          title="حذف کاربر"
                          aria-label="حذف کاربر"
                        >
                          {isDeletingId === user.id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center text-sm text-surface-500"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Users className="h-9 w-9 text-surface-300" />

                        <span>
                          {searchTerm
                            ? 'کاربری مطابق عبارت جستجو پیدا نشد.'
                            : 'هنوز هیچ کاربری تعریف نشده است.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mellat-50 text-mellat-600">
                  {editingUser ? (
                    <Edit3 className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-surface-800">
                    {editingUser ? 'ویرایش کاربر' : 'ایجاد کاربر جدید'}
                  </h2>

                  <p className="mt-1 text-xs text-surface-500">
                    اطلاعات کاربر را با دقت وارد کنید.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeUserForm}
                disabled={isSaving}
                className="rounded-lg p-2 text-surface-500 transition hover:bg-surface-100 hover:text-surface-700 disabled:opacity-50"
                aria-label="بستن فرم"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(event) => void handleSubmit(event)}>
              <div className="space-y-5 p-5 sm:p-6">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="userId"
                      className="mb-2 block text-sm font-semibold text-surface-700"
                    >
                      شناسه کاربر
                    </label>

                    <input
                      id="userId"
                      type="text"
                      value={formData.userId}
                      onChange={(event) =>
                        updateFormField('userId', event.target.value)
                      }
                      placeholder="مثال: system.admin"
                      disabled={isSaving}
                      className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition placeholder:text-surface-400 focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-semibold text-surface-700"
                    >
                      نام
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(event) =>
                        updateFormField('firstName', event.target.value)
                      }
                      disabled={isSaving}
                      className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-semibold text-surface-700"
                    >
                      نام خانوادگی
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(event) =>
                        updateFormField('lastName', event.target.value)
                      }
                      disabled={isSaving}
                      className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="roleId"
                      className="mb-2 block text-sm font-semibold text-surface-700"
                    >
                      نقش کاربر
                    </label>

                    <select
                      id="roleId"
                      value={formData.roleId}
                      onChange={(event) =>
                        updateFormField('roleId', event.target.value)
                      }
                      disabled={isSaving}
                      className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                    >
                      <option value="">انتخاب نقش کاربر</option>

                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {getRoleLabel(role)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {!editingUser && (
                    <>
                      <div>
                        <label
                          htmlFor="password"
                          className="mb-2 block text-sm font-semibold text-surface-700"
                        >
                          کلمه عبور
                        </label>

                        <input
                          id="password"
                          type="password"
                          autoComplete="new-password"
                          value={formData.password}
                          onChange={(event) =>
                            updateFormField('password', event.target.value)
                          }
                          disabled={isSaving}
                          className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-semibold text-surface-700"
                        >
                          تکرار کلمه عبور
                        </label>

                        <input
                          id="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          value={formData.confirmPassword}
                          onChange={(event) =>
                            updateFormField(
                              'confirmPassword',
                              event.target.value,
                            )
                          }
                          disabled={isSaving}
                          className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                        />
                      </div>
                    </>
                  )}
                </div>

                {editingUser && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
                    برای تغییر کلمه عبور این کاربر، پس از ذخیره اطلاعات از
                    دکمه کلید در ستون عملیات استفاده کنید.
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-surface-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeUserForm}
                  disabled={isSaving}
                  className="rounded-xl border border-surface-200 px-5 py-3 text-sm font-medium text-surface-600 transition hover:bg-surface-50 disabled:opacity-60"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-mellat-400 via-mellat-500 to-mellat-600 px-5 py-3 text-sm font-bold text-white transition hover:from-mellat-500 hover:to-mellat-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  )}

                  {isSaving
                    ? 'در حال ذخیره...'
                    : editingUser
                      ? 'ذخیره تغییرات'
                      : 'ایجاد کاربر'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPasswordModalOpen && passwordUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <KeyRound className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-surface-800">
                    تغییر کلمه عبور
                  </h2>

                  <p className="mt-1 text-xs text-surface-500">
                    {passwordUser.firstName} {passwordUser.lastName} (
                    {passwordUser.userId})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeResetPasswordModal}
                disabled={isResettingPassword}
                className="rounded-lg p-2 text-surface-500 transition hover:bg-surface-100 hover:text-surface-700 disabled:opacity-50"
                aria-label="بستن فرم"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(event) => void handleResetPassword(event)}>
              <div className="space-y-5 p-5 sm:p-6">
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-semibold text-surface-700"
                  >
                    کلمه عبور جدید
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordFormData.password}
                    onChange={(event) =>
                      setPasswordFormData((previous) => ({
                        ...previous,
                        password: event.target.value,
                      }))
                    }
                    disabled={isResettingPassword}
                    className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmNewPassword"
                    className="mb-2 block text-sm font-semibold text-surface-700"
                  >
                    تکرار کلمه عبور جدید
                  </label>

                  <input
                    id="confirmNewPassword"
                    type="password"
                    autoComplete="new-password"
                    value={passwordFormData.confirmPassword}
                    onChange={(event) =>
                      setPasswordFormData((previous) => ({
                        ...previous,
                        confirmPassword: event.target.value,
                      }))
                    }
                    disabled={isResettingPassword}
                    className="w-full rounded-xl border border-surface-200 px-4 py-3 text-sm outline-none transition focus:border-mellat-500 focus:ring-4 focus:ring-mellat-500/15 disabled:bg-surface-50"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-surface-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeResetPasswordModal}
                  disabled={isResettingPassword}
                  className="rounded-xl border border-surface-200 px-5 py-3 text-sm font-medium text-surface-600 transition hover:bg-surface-50 disabled:opacity-60"
                >
                  انصراف
                </button>

                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isResettingPassword && (
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                  )}

                  {isResettingPassword
                    ? 'در حال تغییر...'
                    : 'تغییر کلمه عبور'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage