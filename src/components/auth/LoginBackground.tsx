/**
 * Premium background effects for the login page.
 * Contains gradient layers, glows, grid patterns, and texture overlays.
 */
export default function LoginBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Main gradient layer */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#A9B0BA_0%,#737B87_35%,#30343B_70%,#15171B_100%)]" />

      {/* Large red glow - top */}
      <div className="absolute -top-[280px] left-[42%] h-[780px] w-[1000px] -translate-x-1/2 rounded-full bg-mellat-500/35 blur-[170px]" />

      {/* White/silver light glow */}
      <div className="absolute -left-40 top-[-180px] h-[650px] w-[700px] rounded-full bg-white/35 blur-[160px]" />

      {/* Black glow - right side */}
      <div className="absolute -right-44 top-[8%] h-[650px] w-[650px] rounded-full bg-black/55 blur-[145px]" />

      {/* Red glow - bottom */}
      <div className="absolute -bottom-56 -right-36 h-[680px] w-[720px] rounded-full bg-mellat-500/28 blur-[180px]" />

      {/* Dark glow - bottom left */}
      <div className="absolute -bottom-44 -left-44 h-[620px] w-[650px] rounded-full bg-[#0A0B0D]/60 blur-[160px]" />

      {/* Silver glow - center */}
      <div className="absolute left-[30%] top-[40%] h-[320px] w-[460px] rounded-full bg-[#DCE1E8]/25 blur-[125px]" />

      {/* Dark overlay for color cohesion */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.34)_100%)]" />

      {/* Subtle grid lines */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '58px 58px',
          maskImage: 'radial-gradient(ellipse at center, black 8%, transparent 76%)',
        }}
      />

      {/* Very soft texture */}
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(125deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 14px)',
        }}
      />
    </div>
  )
}
