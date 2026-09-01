import { Clock3, Files, Gauge, Timer } from "lucide-react";

import type { DashboardQueueStatus } from "../monitoringVBG.types";

interface QueueStatusCardProps {
  data: DashboardQueueStatus;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${formatNumber(minutes)}:${String(remainingSeconds).padStart(2, "0")}`;
}

function formatTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QueueStatusCard({ data }: QueueStatusCardProps) {
  const items = [
    {
      label: "فایل‌های در صف",
      value: formatNumber(data.queueSize),
      icon: Files,
    },
    {
      label: "نرخ ورود",
      value: `${formatNumber(data.inputRate)} فایل/دقیقه`,
      icon: Gauge,
    },
    {
      label: "نرخ خروج",
      value: `${formatNumber(data.outputRate)} فایل/دقیقه`,
      icon: Gauge,
    },
    {
      label: "طولانی‌ترین انتظار",
      value: formatDuration(data.longestWaitSeconds),
      icon: Timer,
    },
  ];

  return (
    <section className="dashboard-card queue-status-card">
      <h2>
        <Clock3 size={18} />
        وضعیت صف
      </h2>

      <div className="queue-status-list">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="queue-status-item">
            <span>
              <Icon size={15} />
              {label}
            </span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="queue-prediction">
        <span>پیش‌بینی اتمام صف</span>
        <strong>{formatTime(data.estimatedFinishTime)}</strong>
        <small>بر اساس نرخ پردازش فعلی</small>
      </div>
    </section>
  );
}