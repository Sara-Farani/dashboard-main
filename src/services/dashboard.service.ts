
import type { OverviewStats, ActivityItem } from '../types/activity.types'

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function getOverviewStats(): Promise<OverviewStats> {
  await delay(600)
  return {
    totalUsers: 1284,
    todayTransactions: 371,
    avgPerMinute: 12,
    activeUsers: 10,
  }
}

export async function getRecentActivities(): Promise<ActivityItem[]> {
  await delay(450)
  return [
    { id: 1, text: 'واریز حقوق کارکنان', time: '۲ دقیقه پیش', icon: 'arrowDown' },
    { id: 2, text: 'پرداخت یارانه نقدی', time: '۱۵ دقیقه پیش', icon: 'user' },
    { id: 3, text: 'کمک معیشتی خانوار', time: '۲۸ دقیقه پیش', icon: 'arrowUp' },
    { id: 4, text: 'یارانه نان و کالا', time: '۴۵ دقیقه پیش', icon: 'shield' },
    { id: 5, text: 'تسویه مطالبات فرهنگیان', time: '۱ ساعت پیش', icon: 'clock' },
  ]
}
