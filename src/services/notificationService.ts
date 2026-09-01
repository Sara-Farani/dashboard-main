// ------------------------------------------------------------------
// Mock notifications service
// ------------------------------------------------------------------

import type { NotificationItem, NotificationType } from '../types/notification'

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

let notifications: NotificationItem[] = [
  { id: 1, title: 'افزایش حجم تراکنش‌ها', message: 'حجم تراکنش‌های امروز نسبت به میانگین هفته ۱۸٪ افزایش داشته است.', type: 'info', read: false, time: '۱۲ دقیقه پیش' },
  { id: 2, title: 'کاربر جدید ثبت‌نام کرد', message: 'یک کاربر جدید (حسین موسوی) در سامانه ثبت‌نام کرد.', type: 'success', read: false, time: '۴۵ دقیقه پیش' },
  { id: 3, title: 'خرابی احتمالی سرویس', message: 'کاهش مقطعی سرعت در سرویس پرداخت گزارش شده است.', type: 'warning', read: false, time: '۲ ساعت پیش' },
  { id: 4, title: 'خطای برداشت ناموفق', message: 'برداشت با کد خطای TIMEOUT ناموفق بود — بررسی لازم است.', type: 'danger', read: true, time: '۵ ساعت پیش' },
  { id: 5, title: 'بروزرسانی امنیتی', message: 'به‌روزرسانی امنیتی نسخه ۲.۴.۱ با موفقیت اعمال شد.', type: 'info', read: true, time: 'دیروز' },
  { id: 6, title: 'گزارش هفتگی آماده است', message: 'گزارش هفتگی تراکنش‌ها آماده دانلود می‌باشد.', type: 'success', read: true, time: 'دیروز' },
]

export async function getNotifications(): Promise<NotificationItem[]> {
  await delay(600)
  return notifications.map((n) => ({ ...n }))
}

export async function markAllRead(): Promise<{ success: true }> {
  await delay(400)
  notifications = notifications.map((n) => ({ ...n, read: true }))
  return { success: true }
}

export async function markRead(id: number): Promise<{ success: true }> {
  await delay(300)
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  return { success: true }
}

export type { NotificationType }
