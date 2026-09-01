import { useState, type FormEvent } from 'react'
import { getApiErrorMessage } from '../../lib/apiClient'
import { changeMyPassword } from '../../services/userService'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setError('')
    setSuccess('')

    if (newPassword !== repeatPassword) {
      setError('کلمه عبور جدید و تکرار آن یکسان نیستند.')
      return
    }

    if (newPassword.length < 8) {
      setError('کلمه عبور جدید باید حداقل ۸ کاراکتر باشد.')
      return
    }

    setSubmitting(true)

    try {
      await changeMyPassword({
        currentPassword,
        newPassword,
      })

      setCurrentPassword('')
      setNewPassword('')
      setRepeatPassword('')
      setSuccess('کلمه عبور با موفقیت تغییر کرد.')
    } catch (error) {
      setError(getApiErrorMessage(error, 'تغییر کلمه عبور ناموفق بود.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      dir="rtl"
      className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-sm"
    >
      <h1 className="mb-6 text-lg font-bold text-surface-800">
        تغییر کلمه عبور
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2 block text-sm">کلمه عبور فعلی</label>
          <input
            type="password"
            className="w-full rounded-lg border border-surface-300 px-3 py-2"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm">کلمه عبور جدید</label>
          <input
            type="password"
            className="w-full rounded-lg border border-surface-300 px-3 py-2"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm">تکرار کلمه عبور جدید</label>
          <input
            type="password"
            className="w-full rounded-lg border border-surface-300 px-3 py-2"
            value={repeatPassword}
            onChange={(event) => setRepeatPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm text-white disabled:opacity-60"
        >
          {submitting ? 'در حال ذخیره...' : 'ثبت کلمه عبور جدید'}
        </button>
      </form>
    </section>
  )
}