// ------------------------------------------------------------------
// Icon helper — maps menuConfig icon name strings → lucide-react.
// ------------------------------------------------------------------

import * as Icons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ALIASES: Record<string, string> = {
  Dashboard: 'LayoutDashboard',
  Users: 'Users',
  BarChart3: 'ChartColumnBig', // name changed in newer lucide
  ShieldCheck: 'ShieldCheck',
  Settings: 'Settings',
  Notification: 'Bell',
}

export function resolveIcon(name: string): LucideIcon {
  const key = ALIASES[name] || name
  return (Icons as unknown as Record<string, LucideIcon>)[key] || Icons.Circle
}

export default function Icon({ name, size = 18, className = '' }: { name: string; size?: number; className?: string }) {
  const Cmp = resolveIcon(name)
  return <Cmp size={size} className={className} />
}