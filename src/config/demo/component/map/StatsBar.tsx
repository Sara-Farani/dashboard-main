import { formatNumber, formatToman } from '../../../../utils/format'

type StatKey = 'today' | 'processing' | 'activeProvinces' | 'volume'

interface DashboardTotals {
  today: number
  processing: number
  activeProvinces: number
  volume: number
}

interface StatsBarProps {
  totals: DashboardTotals
}

interface StatCard {
  key: StatKey
  label: string
  tone: 'cyan' | 'gold' | 'mint' | 'violet'
}

const CARDS: StatCard[] = [
  { key: 'today', label: 'درخواست امروز', tone: 'cyan' },
  { key: 'processing', label: 'در حال واریز', tone: 'gold' },
  { key: 'activeProvinces', label: 'استان فعال', tone: 'mint' },
  { key: 'volume', label: 'حجم کل (تومان)', tone: 'violet' },
]

export default function StatsBar({ totals }: StatsBarProps) {
  const values: Record<StatKey, string> = {
    today: formatNumber(totals.today),
    processing: formatNumber(totals.processing),
    activeProvinces: formatNumber(totals.activeProvinces),
    volume: formatToman(totals.volume),
  }

  return (
    <section className="stats-bar">
      {CARDS.map((card) => (
        <article key={card.key} className={`stat-card tone-${card.tone}`}>
          <span className="stat-label">{card.label}</span>
          <strong className="stat-value">{values[card.key]}</strong>
        </article>
      ))}
    </section>
  )
}