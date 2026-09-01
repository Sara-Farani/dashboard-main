// ------------------------------------------------------------------
// Activity / Dashboard shared types
// ------------------------------------------------------------------

export type ActivityIcon =
  | 'arrowDown'
  | 'arrowUp'
  | 'user'
  | 'shield'
  | 'clock'

export interface OverviewStats {
  /**
   * تعداد کل فایل‌ها / کاربران
   */
  totalUsers: number

  /**
   * تعداد تراکنش‌های انجام‌شده در امروز
   */
  todayTransactions: number

  /**
   * میانگین تعداد تراکنش در هر دقیقه
   */
  avgPerMinute: number

  /**
   * تعداد Job یا کاربران فعال
   */
  activeUsers: number
}

export interface ActivityItem {
  /**
   * شناسه یکتا برای استفاده در React key
   */
  id: number | string

  /**
   * عنوان یا متن فعالیت
   */
  text: string

  /**
   * زمان نمایشی فعالیت، مانند «۲ دقیقه پیش»
   */
  time: string

  /**
   * نام آیکون فعالیت
   */
  icon: ActivityIcon
}

export interface TransactionEntry {
  /**
   * شناسه یکتای تراکنش
   */
  id: number | string

  /**
   * زمان ثبت تراکنش.
   * نمونه: 2026-08-20T10:25:00.000Z
   */
  timestamp: string | Date

  /**
   * مبلغ تراکنش؛ در نمودار فعلی استفاده نشده اما برای داده تراکنش کاربرد دارد.
   */
  amount?: number

  /**
   * وضعیت تراکنش
   */
  status?: 'success' | 'failed' | 'pending'

  /**
   * نام فایل، کاربر یا توضیحات تراکنش
   */
  description?: string
}

export interface TimeSeriesPoint {
  /**
   * زمان نمایش روی محور X نمودار.
   * نمونه: 14:35
   */
  time: string

  /**
   * تعداد تراکنش‌های رخ داده در این دقیقه
   */
  count: number
}