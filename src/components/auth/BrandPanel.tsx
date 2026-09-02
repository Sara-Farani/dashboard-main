/**
 * Brand panel displayed on the left side of the login card (desktop only).
 * Shows Bank Mellat branding, tagline, and feature highlights.
 */
export default function BrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden p-10 text-white lg:flex">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(145deg, #FF3038 0%, #ED1C24 28%, #C4141B 55%, #1A1B1F 100%)',
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

        {/* Decorative circles */}
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/15" />
        <div className="absolute -bottom-12 -left-10 h-52 w-52 rounded-full border border-white/15" />
        <div className="absolute right-8 top-24 h-28 w-28 rounded-full border border-white/15" />
        <div className="absolute left-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/15 blur-3xl" />
      </div>

      {/* Logo and title */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/25 bg-black/30 px-3 py-2 shadow-xl shadow-black/30 backdrop-blur-md">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-[0_12px_32px_-10px_rgba(0,0,0,0.65)]">
            <svg viewBox="0 0 48 48" className="relative h-7 w-7" aria-hidden>
              <rect width="48" height="48" rx="10" fill="#ED1C24" />
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

      {/* Feature highlights */}
      <div className="relative z-10 space-y-3">
        {['امنیت بانکی استاندارد', 'دسترسی سریع به خدمات', 'نسخه پرمیوم ۲۰۲۶'].map(
          (item) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-3.5 py-2.5 text-[13px] font-medium text-white/95 shadow-lg shadow-black/10 backdrop-blur-sm transition hover:border-white/35 hover:bg-black/35"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[12px] font-black text-mellat-500 shadow-[0_0_0_4px_rgba(255,255,255,0.1)]">
                ✓
              </span>
              {item}
            </div>
          ),
        )}
      </div>
    </aside>
  )
}
