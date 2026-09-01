import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../../lib/apiClient'
import { useAuthStore } from '../../store/authStore'
import { logger } from '../../utils/logger'

interface LocationState {
  from?: string
}

const MELLAT_RED = '#ED1C24'
const MELLAT_RED_DARK = '#C4141B'
const MELLAT_RED_DEEP = '#9B1016'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((state) => state.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const state = location.state as LocationState | null
  const from = state?.from && state.from !== '/login' ? state.from : '/dashboard'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await login(username.trim(), password)
      logger.debug('from = ', from)
      navigate(from, { replace: true })
    } catch (error) {
      logger.debug('error = ', error)
      setError(getApiErrorMessage(error, 'ورود به سامانه ناموفق بود.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#8F96A1] px-4 py-8"
    >
      {/* پس‌زمینه پرمیوم طوسی، مشکی و قرمز */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* لایه اصلی گرادیانی */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#A9B0BA_0%,#737B87_35%,#30343B_70%,#15171B_100%)]" />

        {/* هاله بزرگ قرمز بالا */}
        <div className="absolute -top-[280px] left-[42%] h-[780px] w-[1000px] -translate-x-1/2 rounded-full bg-[#ED1C24]/35 blur-[170px]" />

        {/* هاله نور سفید / نقره‌ای */}
        <div className="absolute -left-40 top-[-180px] h-[650px] w-[700px] rounded-full bg-white/35 blur-[160px]" />

        {/* هاله مشکی در سمت راست */}
        <div className="absolute -right-44 top-[8%] h-[650px] w-[650px] rounded-full bg-black/55 blur-[145px]" />

        {/* هاله قرمز پایین */}
        <div className="absolute -bottom-56 -right-36 h-[680px] w-[720px] rounded-full bg-[#ED1C24]/28 blur-[180px]" />

        {/* هاله تیره پایین سمت چپ */}
        <div className="absolute -bottom-44 -left-44 h-[620px] w-[650px] rounded-full bg-[#0A0B0D]/60 blur-[160px]" />

        {/* نور نقره‌ای وسط */}
        <div className="absolute left-[30%] top-[40%] h-[320px] w-[460px] rounded-full bg-[#DCE1E8]/25 blur-[125px]" />

        {/* لایه تیره برای انسجام بیشتر رنگ‌ها */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.34)_100%)]" />

        {/* خطوط شبکه‌ای ظریف */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
            backgroundSize: '58px 58px',
            maskImage: 'radial-gradient(ellipse at center, black 8%, transparent 76%)',
          }}
        />

        {/* بافت بسیار نرم */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(125deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 14px)',
          }}
        />
      </div>

      {/* کارت اصلی */}
      <div className="relative w-full max-w-[980px]">
        {/* نور و قاب بیرونی */}
        <div className="pointer-events-none absolute -inset-[2px] rounded-[1.95rem] bg-gradient-to-br from-white/70 via-[#ED1C24]/75 to-black/60 opacity-90 blur-[2px]" />
        <div className="pointer-events-none absolute -inset-10 rounded-[2.8rem] bg-black/35 blur-3xl" />
        <div className="pointer-events-none absolute -inset-7 rounded-[2.5rem] bg-[#ED1C24]/25 blur-3xl" />

        <div className="relative grid overflow-hidden rounded-[1.75rem] border border-white/30 bg-white/80 shadow-[0_45px_130px_-30px_rgba(0,0,0,0.82)] backdrop-blur-2xl lg:grid-cols-[1.05fr_1fr]">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-l from-transparent via-white to-[#ED1C24] opacity-90" />

          {/* پنل برند */}
          <aside className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
            <div className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(145deg, #FF3038 0%, ${MELLAT_RED} 28%, ${MELLAT_RED_DARK} 55%, #1A1B1F 100%)`,
                }}
              />

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_13%,_rgba(255,255,255,0.38),_transparent_38%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_94%,_rgba(0,0,0,0.65),_transparent_48%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_15%,_rgba(255,255,255,0.12),_transparent_32%)]" />

              <div
                className="absolute inset-0 opacity-[0.16]"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 16px)',
                }}
              />

              <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/15" />
              <div className="absolute -bottom-12 -left-10 h-52 w-52 rounded-full border border-white/15" />
              <div className="absolute right-8 top-24 h-28 w-28 rounded-full border border-white/15" />
              <div className="absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/15 blur-3xl" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-black/30 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-md">
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_12px_32px_-10px_rgba(0,0,0,0.65)]">
                  <svg viewBox="0 0 48 48" className="relative h-7 w-7" aria-hidden>
                    <rect width="48" height="48" rx="10" fill={MELLAT_RED} />
                    <path
                      d="M10 30V18.5L24 10l14 8.5V30"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18 30v-7h12v7"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M10 30h28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="leading-tight">
                  <p className="text-[17px] font-black tracking-tight">بانک ملت</p>
                  <p className="text-[11px] text-white/75">Bank Mellat</p>
                </div>
              </div>

              <h2 className="mt-10 text-[2.4rem] font-black leading-[1.12] tracking-tight drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
                سامانه یکپارچه
                <span className="mt-1 block text-white/95">خدمات الکترونیکی</span>
              </h2>

              <p className="mt-4 max-w-sm text-[15px] leading-8 text-white/80">
                تجربه‌ای امن، سریع و پرمیوم با هویت بصری بانک ملت.
              </p>
            </div>

            <div className="relative z-10 space-y-3">
              {['امنیت بانکی استاندارد', 'دسترسی سریع به خدمات', 'نسخه پرمیوم ۲۰۲۶'].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-3.5 py-2.5 text-[13px] font-medium text-white/95 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-white/35 hover:bg-black/35"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] font-black text-[#ED1C24] shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
                      ✓
                    </span>
                    {item}
                  </div>
                ),
              )}
            </div>
          </aside>

          {/* پنل فرم */}
          <section className="relative bg-[linear-gradient(145deg,rgba(255,255,255,0.98)_0%,rgba(246,247,249,0.97)_55%,rgba(229,232,237,0.98)_100%)] p-7 sm:p-10">
            <div
              className="absolute inset-x-0 top-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, #17181C, ${MELLAT_RED_DEEP}, ${MELLAT_RED}, #FF7A7F, ${MELLAT_RED})`,
              }}
            />

            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#ED1C24]/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-[#1B1D22]/10 blur-3xl" />
            <div className="pointer-events-none absolute right-[15%] top-[18%] h-32 w-32 rounded-full bg-white/90 blur-3xl" />

            {/* هدر موبایل */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-[0_14px_34px_-12px_rgba(237,28,36,0.85)]"
                style={{ backgroundColor: MELLAT_RED }}
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/25 to-white/20" />
                <svg
                  viewBox="0 0 24 24"
                  className="relative h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5 12 4l9 6.5" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 10v8.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V10"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20v-5h4v5" />
                </svg>
              </div>

              <div>
                <p className="text-lg font-black text-[#111216]">بانک ملت</p>
                <p className="text-xs text-[#626975]">سامانه الکترونیکی</p>
              </div>
            </div>

            <div className="relative mb-8">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9DDE3] bg-white/90 px-3 py-1 text-[11px] font-bold tracking-wide text-[#353A43] shadow-[0_10px_22px_-14px_rgba(0,0,0,0.35)]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ED1C24] opacity-40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ED1C24]" />
                </span>
                BANK MELLAT · PREMIUM 2026
              </div>

              <h1 className="text-[1.9rem] font-black tracking-tight text-[#111216]">
                ورود به سامانه
              </h1>

              <p className="mt-2 text-sm text-[#626975]">اطلاعات کاربری خود را وارد کنید</p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-5">
              {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B] shadow-sm">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ backgroundColor: MELLAT_RED }}
                  >
                    !
                  </span>
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-[13px] font-bold text-[#17181C]">
                  نام کاربری
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8E96A3] transition group-focus-within:text-[#ED1C24]">
                    <svg
                      className="h-[18px] w-[18px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>

                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="w-full rounded-2xl border border-[#D9DDE3] bg-white/90 py-3.5 pl-4 pr-11 text-[15px] text-[#17181C] outline-none shadow-[0_5px_15px_-12px_rgba(0,0,0,0.25)] transition-all placeholder:text-[#9AA1AC] focus:border-[#ED1C24] focus:bg-white focus:shadow-[0_0_0_4px_rgba(237,28,36,0.12)] disabled:bg-[#F0F1F3] disabled:opacity-60"
                    placeholder="نام کاربری خود را وارد کنید"
                    autoComplete="username"
                    disabled={submitting}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-bold text-[#17181C]">
                  کلمه عبور
                </label>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8E96A3] transition group-focus-within:text-[#ED1C24]">
                    <svg
                      className="h-[18px] w-[18px]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-[#D9DDE3] bg-white/90 py-3.5 pl-12 pr-11 text-[15px] text-[#17181C] outline-none shadow-[0_5px_15px_-12px_rgba(0,0,0,0.25)] transition-all placeholder:text-[#9AA1AC] focus:border-[#ED1C24] focus:bg-white focus:shadow-[0_0_0_4px_rgba(237,28,36,0.12)] disabled:bg-[#F0F1F3] disabled:opacity-60"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={submitting}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8E96A3] transition hover:text-[#ED1C24]"
                    tabIndex={-1}
                    aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                  >
                    {showPassword ? (
                      <svg
                        className="h-[18px] w-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-[18px] w-[18px]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-4 py-[15px] text-[15px] font-bold text-white transition-all hover:-translate-y-0.5 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55"
                style={{
                  background: `linear-gradient(180deg, #FF4C53 0%, ${MELLAT_RED} 45%, ${MELLAT_RED_DARK} 78%, #8F0B11 100%)`,
                  boxShadow:
                    '0 18px 42px -14px rgba(237,28,36,0.9), inset 0 1px 0 rgba(255,255,255,0.32)',
                }}
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/20" />
                <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[320%]" />

                {submitting ? (
                  <>
                    <svg className="relative h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
                      />
                    </svg>
                    <span className="relative">در حال ورود...</span>
                  </>
                ) : (
                  <span className="relative">ورود به سامانه بانک ملت</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-[#626975]">
                <span
                  className="rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: MELLAT_RED }}
                >
                  ملت
                </span>
                <span>ورود به منزله پذیرش شرایط خدمات الکترونیکی است</span>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}