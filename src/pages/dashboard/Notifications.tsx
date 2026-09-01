// ------------------------------------------------------------------
// Notifications page — list with mark-as-read
// ------------------------------------------------------------------

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  CheckCheck,
  Info,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { getNotifications, markAllRead, markRead } from '../../services/notificationService'
import PageHeader from '../../components/ui/PageHeader'
import Button from '../../components/ui/Button'
import Skeleton from '../../components/ui/Skeleton'
import { staggerContainer, staggerItem } from '../../animations/animationVariants'
import type { NotificationType } from '../../types/notification'

const typeStyles: Record<NotificationType, { bg: string; icon: LucideIcon; color: string }> = {
  info: { bg: 'bg-primary-50', icon: Info, color: 'text-primary-500' },
  success: { bg: 'bg-success-50', icon: CheckCircle2, color: 'text-success-500' },
  warning: { bg: 'bg-warning-50', icon: AlertTriangle, color: 'text-warning-500' },
  danger: { bg: 'bg-danger-50', icon: AlertCircle, color: 'text-danger-500' },
}

export default function Notifications() {
  const queryClient = useQueryClient()

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  })

  const markAllMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      toast.success('همه اعلان‌ها خوانده شد.')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markOneMutation = useMutation({
    mutationFn: markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const unreadCount = notifications?.filter((n) => !n.read).length || 0

  return (
    <div>
      <PageHeader
        title="اعلان‌ها"
        subtitle={`${unreadCount} اعلان خوانده‌نشده`}
        actions={
          unreadCount > 0 && (
            <Button
              icon={CheckCheck}
              variant="secondary"
              loading={markAllMutation.isPending}
              onClick={() => markAllMutation.mutate()}
            >
              همه خوانده شد
            </Button>
          )
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {notifications?.map((n) => {
            const s = typeStyles[n.type] || typeStyles.info
            const IconComp = s.icon
            return (
              <motion.div
                key={n.id}
                variants={staggerItem}
                layout
                className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                  n.read
                    ? 'border-surface-200 bg-white'
                    : 'border-primary-200 bg-primary-50/40 shadow-sm shadow-primary-500/5'
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg} ${s.color}`}>
                  <IconComp size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-bold ${n.read ? 'text-surface-700' : 'text-surface-800'}`}>
                      {n.title}
                    </h4>
                    {!n.read && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markOneMutation.mutate(n.id)}
                        className="cursor-pointer rounded-lg p-1 text-surface-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary-600"
                        aria-label="خوانده شد"
                      >
                        <CheckCheck size={14} />
                      </motion.button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-surface-500">{n.message}</p>
                  <p className="mt-2 text-xs text-surface-400">{n.time}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}