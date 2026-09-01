// ------------------------------------------------------------------
// Notification types
// ------------------------------------------------------------------

export type NotificationType = 'info' | 'success' | 'warning' | 'danger'

export interface NotificationItem {
  id: number
  title: string
  message: string
  type: NotificationType
  read: boolean
  time: string
}