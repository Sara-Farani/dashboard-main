// ------------------------------------------------------------------
// Transaction report page
// ------------------------------------------------------------------

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  BarChart3,
  CircleAlert,
  Clock3,
  RefreshCw,
  WalletCards,
} from 'lucide-react'

import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'

import {
  filterByMinutes,
  getTransactions,
  summarise,
  toTimeSeries,
} from '../../services/transactionService'

import type {
  TransactionEntry,
  TransactionStatus,
} from '../../types/transaction'

type TimeRange = 5 | 15 | 30 | 60
type StatusFilter = 'all' | TransactionStatus

const PAGE_SIZE = 10

const statusConfig: Record<
  TransactionStatus,
  {
    label: string
    icon: typeof ArrowDownToLine
    badgeClass: string
  }
> = {
  deposit: {
    label: 'واریز',
    icon: ArrowDownToLine,
    badgeClass: 'bg-success-50 text-success-600',
  },
  transfer: {
    label: 'انتقال',
    icon: ArrowLeftRight,
    badgeClass: 'bg-primary-50 text-primary-600',
  },
  withdraw: {
    label: 'برداشت',
    icon: ArrowUpFromLine,
    badgeClass: 'bg-danger-50 text-danger-600',
  },
}

const timeRangeOptions: { value: TimeRange; label: string }[] = [
  { value: 5, label: '۵ دقیقه اخیر' },
  { value: 15, label: '۱۵ دقیقه اخیر' },
  { value: 30, label: '۳۰ دقیقه اخیر' },
  { value: 60, label: '۱ ساعت اخیر' },
]

function formatAmount(amount: number): string {
  return new Intl.NumberFormat('fa-IR', {
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatTime(timestamp: string): string {
  return new Intl.DateTimeFormat('fa-IR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(timestamp))
}

function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
}: {
  title: string
  value: string | number
  icon: typeof BarChart3
  colorClass: string
}) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-surface-500">{title}</p>
          <p className="mt-2 text-2xl font-black text-surface-800">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  )
}

export default function TransactionReport() {
  const [timeRange, setTimeRange] = useState<TimeRange>(60)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: transactions = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
    refetchOnWindowFocus: false,
  })

  const filteredTransactions = useMemo(() => {
    const timeFiltered = filterByMinutes(transactions, timeRange)

    if (statusFilter === 'all') {
      return timeFiltered
    }

    return timeFiltered.filter((transaction) => transaction.status === statusFilter)
  }, [transactions, timeRange, statusFilter])

  const summary = useMemo(
    () => summarise(filteredTransactions),
    [filteredTransactions],
  )

  const timeSeries = useMemo(
    () => toTimeSeries(filteredTransactions),
    [filteredTransactions],
  )

  const maxChartValue = useMemo(() => {
    if (!timeSeries.length) return 1
    return Math.max(...timeSeries.map((item) => item.count), 1)
  }, [timeSeries])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))

  const paginatedTransactions = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages)
    const start = (safePage - 1) * PAGE_SIZE

    return filteredTransactions.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredTransactions, totalPages])

  function handleTimeRangeChange(value: TimeRange) {
    setTimeRange(value)
    setCurrentPage(1)
  }

  function handleStatusChange(value: StatusFilter) {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <div>
      <PageHeader
        title="گزارش تراکنش‌ها"
        subtitle="نمایش و تحلیل تراکنش‌های یک ساعت اخیر"
        actions={
          <Button
            icon={RefreshCw}
            variant="secondary"
            loading={isFetching}
            onClick={() => refetch()}
          >
            بروزرسانی
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </div>

          <Skeleton className="h-72" />
          <Skeleton className="h-96" />
        </div>
      ) : isError ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-danger-200 bg-danger-50 p-6 text-center">
          <CircleAlert className="text-danger-500" size={34} />
          <h3 className="mt-3 font-bold text-danger-700">
            دریافت اطلاعات تراکنش‌ها ناموفق بود
          </h3>
          <p className="mt-1 text-sm text-danger-600">
            لطفاً اتصال را بررسی کرده و مجدداً تلاش کنید.
          </p>

          <div className="mt-5">
            <Button icon={RefreshCw} onClick={() => refetch()}>
              تلاش مجدد
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex flex-col gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="ml-2 flex items-center gap-2 text-sm font-bold text-surface-700">
                <Clock3 size={17} className="text-primary-500" />
                بازه زمانی:
              </div>

              {timeRangeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleTimeRangeChange(option.value)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    timeRange === option.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-surface-50 text-surface-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="ml-2 text-sm font-bold text-surface-700">
                نوع تراکنش:
              </span>

              <button
                type="button"
                onClick={() => handleStatusChange('all')}
                className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-surface-700 text-white'
                    : 'bg-surface-50 text-surface-600 hover:bg-surface-100'
                }`}
              >
                همه
              </button>

              {(Object.keys(statusConfig) as TransactionStatus[]).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-primary-500 text-white'
                      : 'bg-surface-50 text-surface-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {statusConfig[status].label}
                </button>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="تعداد تراکنش‌ها"
              value={`${summary.count.toLocaleString('fa-IR')} تراکنش`}
              icon={WalletCards}
              colorClass="bg-primary-50 text-primary-500"
            />

            <StatCard
              title="بیشترین تراکنش در یک دقیقه"
              value={`${summary.maxPerMinute.toLocaleString('fa-IR')} تراکنش`}
              icon={BarChart3}
              colorClass="bg-warning-50 text-warning-500"
            />

            <StatCard
              title="میانگین تراکنش در دقیقه"
              value={`${summary.avgPerMinute.toLocaleString('fa-IR')} تراکنش`}
              icon={Clock3}
              colorClass="bg-success-50 text-success-500"
            />
          </div>

          {/* Simple chart */}
          <section className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-surface-800">
                  تعداد تراکنش‌ها بر اساس دقیقه
                </h2>
                <p className="mt-1 text-sm text-surface-500">
                  روند تراکنش‌های ثبت‌شده در بازه انتخابی
                </p>
              </div>

              <span className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-600">
                {filteredTransactions.length.toLocaleString('fa-IR')} رکورد
              </span>
            </div>

            {timeSeries.length === 0 ? (
              <div className="flex h-52 items-center justify-center text-sm text-surface-400">
                در بازه انتخاب‌شده تراکنشی وجود ندارد.
              </div>
            ) : (
              <div className="h-56 overflow-x-auto">
                <div className="flex h-full min-w-max items-end gap-1.5 px-1">
                  {timeSeries.map((point) => {
                    const height = Math.max((point.count / maxChartValue) * 100, 4)

                    return (
                      <div
                        key={point.time}
                        className="group flex h-full w-8 flex-col items-center justify-end"
                        title={`${point.time} - ${point.count.toLocaleString('fa-IR')} تراکنش`}
                      >
                        <span className="mb-1 text-xs font-bold text-primary-600 opacity-0 transition-opacity group-hover:opacity-100">
                          {point.count.toLocaleString('fa-IR')}
                        </span>

                        <div
                          className="w-full rounded-t-md bg-primary-400 transition-all duration-300 hover:bg-primary-600"
                          style={{ height: `${height}%` }}
                        />

                        <span className="mt-2 -rotate-45 whitespace-nowrap text-[10px] text-surface-400">
                          {point.time}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Transactions table */}
          <section className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
            <div className="flex flex-col gap-2 border-b border-surface-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold text-surface-800">آخرین تراکنش‌ها</h2>
                <p className="mt-1 text-sm text-surface-500">
                  فهرست تراکنش‌های منطبق با فیلترهای انتخاب‌شده
                </p>
              </div>

              <span className="text-sm text-surface-500">
                {filteredTransactions.length.toLocaleString('fa-IR')} تراکنش
              </span>
            </div>

            {paginatedTransactions.length === 0 ? (
              <div className="flex min-h-52 items-center justify-center text-sm text-surface-400">
                هیچ تراکنشی برای نمایش وجود ندارد.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-175 text-right">
                    <thead className="bg-surface-50 text-xs text-surface-500">
                      <tr>
                        <th className="px-5 py-3 font-bold">شناسه تراکنش</th>
                        <th className="px-5 py-3 font-bold">نوع</th>
                        <th className="px-5 py-3 font-bold">مبلغ (ریال)</th>
                        <th className="px-5 py-3 font-bold">زمان ثبت</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-surface-100">
                      {paginatedTransactions.map((transaction: TransactionEntry) => {
                        const config = statusConfig[transaction.status]
                        const StatusIcon = config.icon

                        return (
                          <tr
                            key={transaction.id}
                            className="transition-colors hover:bg-surface-50"
                          >
                            <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-surface-600">
                              {transaction.id}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${config.badgeClass}`}
                              >
                                <StatusIcon size={14} />
                                {config.label}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-surface-700">
                              {formatAmount(transaction.amount)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-surface-500">
                              {formatTime(transaction.timestamp)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-surface-100 px-5 py-4">
                    <p className="text-sm text-surface-500">
                      صفحه {currentPage.toLocaleString('fa-IR')} از{' '}
                      {totalPages.toLocaleString('fa-IR')}
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage((page) => page - 1)}
                        className="cursor-pointer rounded-lg border border-surface-200 px-3 py-1.5 text-sm text-surface-600 transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        قبلی
                      </button>

                      <button
                        type="button"
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((page) => page + 1)}
                        className="cursor-pointer rounded-lg border border-surface-200 px-3 py-1.5 text-sm text-surface-600 transition-colors hover:bg-surface-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        بعدی
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      )}
    </div>
  )
}