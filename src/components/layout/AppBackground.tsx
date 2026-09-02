/**
 * Premium ambient background for the main dashboard shell.
 * A softer variant of the login page background: silver/gray base
 * with subtle Mellat-red glows, keeping the content readable.
 */
export default function AppBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient layer */}
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#B7BDC6_0%,#9AA1AC_30%,#5B6270_65%,#2E323A_100%)]" />

      {/* Soft Mellat-red glow — top */}
      <div className="absolute -top-[240px] left-[40%] h-[560px] w-[820px] -translate-x-1/2 rounded-full bg-mellat-500/20 blur-[160px]" />

      {/* Silver light glow */}
      <div className="absolute -left-32 top-[-140px] h-[480px] w-[560px] rounded-full bg-white/30 blur-[140px]" />

      {/* Dark glow — right side */}
      <div className="absolute -right-40 top-[6%] h-[520px] w-[520px] rounded-full bg-black/35 blur-[130px]" />

      {/* Mellat-red glow — bottom */}
      <div className="absolute -bottom-48 -right-28 h-[520px] w-[560px] rounded-full bg-mellat-500/16 blur-[150px]" />

      {/* Deep dark glow — bottom left */}
      <div className="absolute -bottom-40 -left-40 h-[480px] w-[500px] rounded-full bg-[#0A0B0D]/45 blur-[140px]" />

      {/* Dark vignette for contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.06)_45%,rgba(0,0,0,0.28)_100%)]" />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          maskImage: 'radial-gradient(ellipse at center, black 8%, transparent 76%)',
        }}
      />
    </div>
  )
}
