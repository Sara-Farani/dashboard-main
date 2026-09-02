// ------------------------------------------------------------------
// Dashboard / Overview page — stat cards, recent activity, mini chart
// ------------------------------------------------------------------

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import PageHeader from '../../components/ui/PageHeader'
import useCountUp from '../../hooks/useCountUp'
import {
  staggerContainer,
  staggerItem,
} from '../../animations/animationVariants'
import * as dashboardService from '../../services/dashboard.service'
import * as txService from '../../services/transactionService'
import type { OverviewStats, ActivityItem, TransactionEntry, TimeSeriesPoint } from '../../types/activity.types'
import type { LucideIcon } from 'lucide-react'

// Format timestamps to HH:mm for the sparkline
function txToMinuteData(txns: TransactionEntry[]): TimeSeriesPoint[] {
  const map: Record<string, number> = {}
  txns.forEach((t) => {
    const d = new Date(t.timestamp)
    const key = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
    map[key] = (map[key] || 0) + 1
  })
  return Object.entries(map)
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => a.time.localeCompare(b.time))
}

function StatCard({ icon: Icon, color, label, value }: { icon: LucideIcon; color: string; label: string; value: string }) {
  const numericVal = parseInt(value.replace(/[^\d]/g, ''), 10) || 0
  const { value: animated } = useCountUp(numericVal, 1800)

  return (
    <motion.div variants={staggerItem}>
      <Card hover className="flex items-center gap-4 p-5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${color} text-white shadow-md`}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-xs text-surface-500">{label}</p>
          <p className="mt-0.5 text-xl font-extrabold text-surface-800">{animated}</p>
        </div>
      </Card>
    </motion.div>
  )
}

const activityIcons: Record<string, LucideIcon> = {
  arrowDown: ArrowDown,
  arrowUp: ArrowUp,
  user: Users,
  shield: Activity,
  clock: Clock,
}

const activityColors: Record<string, string> = {
  arrowDown: 'text-success-500 bg-success-50',
  arrowUp: 'text-danger-500 bg-danger-50',
  user: 'text-primary-500 bg-primary-50',
  shield: 'text-warning-500 bg-warning-50',
  clock: 'text-surface-500 bg-surface-100',
}

export default function Dashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null)
  const [recent, setRecent] = useState<ActivityItem[]>([])
  const [miniData, setMiniData] = useState<TimeSeriesPoint[]>([])

  useEffect(() => {
    dashboardService.getOverviewStats().then(setStats)
    dashboardService.getRecentActivities().then(setRecent)
    txService.getTransactions().then((tx) => setMiniData(txToMinuteData(tx).slice(-20)))
  }, [])

  if (!stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px]" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64 lg:col-span-2" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="داشبورد" subtitle="نمای کلی مدیریت فایل ها" />

      {/* Stat cards */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={Users}
          color="bg-primary-600 shadow-primary-600/30"
          label="تعداد فایل ها"
          value={String(stats.totalUsers)}
        />
        <StatCard
          icon={Wallet}
          color="bg-mellat-500 shadow-mellat-500/30"
          label="تراکنش‌های امروز"
          value={String(stats.todayTransactions)}
        />
        <StatCard
          icon={Activity}
          color="bg-success-500 shadow-success-500/30"
          label="میانگین تراکنش در دقیقه"
          value={String(stats.avgPerMinute)}
        />
        <StatCard
          icon={Zap}
          color="bg-warning-500 shadow-warning-500/30"
          label="تعداد جاب فعال"
          value={String(stats.activeUsers)}
        />
      </motion.div>

      {/* Charts + recent activity */}
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        animate="visible"
        className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3"
      >
        {/* Sparkline chart */}
        <motion.div variants={staggerItem}>
          <Card className="h-full p-5">
            <h3 className="mb-4 text-sm font-bold text-surface-700">روند تراکنش‌های اخیر</h3>
            {miniData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={miniData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ED1C24" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#ED1C24" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      direction: 'rtl',
                      borderRadius: 12,
                      fontSize: 12,
                      fontFamily: 'Vazirmatn',
                    }}
                    formatter={(v) => [`${v} تراکنش`, 'تعداد']}
                    labelFormatter={(l) => `زمان: ${l}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#ED1C24"
                    strokeWidth={2}
                    fill="url(#g1)"
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[200px] items-center justify-center text-sm text-surface-400">
                در حال بارگذاری…
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent activity list */}
        <motion.div variants={staggerItem}>
          <Card className="h-full p-5 lg:col-span-2">
            <h3 className="mb-4 text-sm font-bold text-surface-700">فایل های اخیر</h3>
            <div className="space-y-3">
              {recent.map((act, i) => {
                const IconComp = activityIcons[act.icon] || Activity
                const colorCls = activityColors[act.icon] || 'text-surface-500 bg-surface-100'
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors duration-150 hover:bg-surface-50"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorCls}`}>
                      <IconComp size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-surface-700">{act.text}</p>
                      <p className="text-[11px] text-surface-400">{act.time}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}