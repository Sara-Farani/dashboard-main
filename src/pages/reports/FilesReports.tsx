// ------------------------------------------------------------------
// Transaction Reports — the key highlight feature.
// Live-updating bar + line charts, time-range filters, stat chips.
// ------------------------------------------------------------------

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Layers, TrendingUp, BarChart3, Zap, type LucideIcon } from 'lucide-react'
import Card from '../../components/ui/Card'
import Skeleton from '../../components/ui/Skeleton'
import PageHeader from '../../components/ui/PageHeader'
import {
  getTransactions,
  summarise,
  toTimeSeries,
  filterByMinutes,
} from '../../services/transactionService'
import {
  staggerContainer,
  staggerItem,
  slideUp,
} from '../../animations/animationVariants'
import { formatFaNumber, toFaDigits } from '../../utils/formatters'
import { pulseDot } from '../../animations/animationVariants'

const RANGES = [
  { label: '۱۰ دقیقه اخیر', value: 10 },
  { label: '۳۰ دقیقه اخیر', value: 30 },
  { label: '۱ ساعت اخیر', value: 60 },
]

function StatChip({ icon: Icon, color, label, value }: { icon: LucideIcon; color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-surface-100">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white ${color}`}>
        <Icon size={16} />
      </div>
      <div>
        <p className="text-[11px] text-surface-500">{label}</p>
        <p className="text-base font-bold text-surface-800">{value}</p>
      </div>
    </div>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: { value: number; color?: string }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-3 shadow-lg" dir="rtl">
      <p className="mb-1 text-xs text-surface-500">زمان: {label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {toFaDigits(p.value)} فایل
        </p>
      ))}
    </div>
  )
}

export default function TransactionReports() {
  const [range, setRange] = useState(60)

  const { data: allTx, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    refetchInterval: 7000,
  })

  const filtered = useMemo(() => {
    if (!allTx) return []
    return filterByMinutes(allTx, range)
  }, [allTx, range])

  const timeSeries = useMemo(() => toTimeSeries(filtered), [filtered])
  const stats = useMemo(() => summarise(filtered), [filtered])

  const barColors = ['#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3']

  return (
    <div>
      <PageHeader
        title="گزارش فایل‌ها"
        subtitle="نمودار زنده فایل‌های سامانه به تفکیک دقیقه"
        actions={
          <motion.div
            variants={pulseDot}
            animate="animate"
            className="flex items-center gap-2 rounded-full bg-success-50 px-4 py-2 text-xs font-medium text-success-600 ring-1 ring-success-100"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-success-500" />
            به‌روزرسانی زنده
          </motion.div>
        }
      />

      {/* Range filter buttons */}
      <div className="mb-5 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <motion.button
            key={r.value}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => setRange(r.value)}
            className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
              range === r.value
                ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                : 'bg-white text-surface-600 ring-1 ring-surface-200 hover:bg-surface-50'
            }`}
          >
            {r.label}
          </motion.button>
        ))}
      </div>

      {/* Stat chips */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate="visible"
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        <motion.div variants={staggerItem}>
          <StatChip
            icon={Layers}
            color="bg-primary-600 shadow-primary-600/30"
            label="کل فایل‌ها"
            value={formatFaNumber(stats.count)}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatChip
            icon={Zap}
            color="bg-mellat-500 shadow-mellat-500/30"
            label="بیشترین فایل در دقیقه"
            value={formatFaNumber(stats.maxPerMinute)}
          />
        </motion.div>
        <motion.div variants={staggerItem}>
          <StatChip
            icon={TrendingUp}
            color="bg-success-500 shadow-success-500/30"
            label="میانگین در دقیقه"
            value={formatFaNumber(stats.avgPerMinute)}
          />
        </motion.div>
      </motion.div>

      {/* Charts grid */}
      {isLoading && !allTx ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          {/* Bar chart */}
          <motion.div variants={slideUp}>
            <Card className="p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-surface-700">
                <BarChart3 size={16} className="text-primary-500" />
                تعداد فایل در هر دقیقه
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeSeries} margin={{ top: 8, right: 8, bottom: 0, left: 8 }} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Vazirmatn' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                  >
                    {timeSeries.map((_, i) => (
                      <Cell key={i} fill={barColors[i % barColors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Line chart */}
          <motion.div variants={slideUp}>
            <Card className="p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-surface-700">
                <TrendingUp size={16} className="text-mellat-500" />
                روند فایل‌ها
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeries} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                  <defs>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Vazirmatn' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    dot={{ r: 2, fill: '#6366f1' }}
                    activeDot={{ r: 5, fill: '#4f46e5' }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}