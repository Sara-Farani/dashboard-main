// ------------------------------------------------------------------
// Skeleton — shimmer placeholder block
// ------------------------------------------------------------------

export default function Skeleton({ className = '', lines = 1 }: { className?: string; lines?: number }) {
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className={`skeleton h-4 ${i === lines - 1 ? 'w-2/3' : ''}`} />
        ))}
      </div>
    )
  }
  return <div className={`skeleton ${className}`} />
}