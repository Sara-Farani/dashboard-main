import {
  AlertTriangle,
  CheckCheck,
  Clock3,
  Gauge,
  ListChecks,
  WalletCards,
} from "lucide-react";

import type { DashboardOverview } from "../../../types/monitoring.types";

interface Props {
  overview: DashboardOverview;
}

function toPersianNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${String(sec).padStart(2, "0")}`;
}

export default function DashboardKpiCards({ overview }: Props) {
  const cards = [
    {
      title: "مجموع واریز امروز",
      value: toPersianNumber(overview.totalAmount),
      subtitle: "ریال",
      icon: WalletCards,
      variant: "primary",
    },
    {
      title: "نرخ موفقیت",
      value: `${overview.successRate.toLocaleString("fa-IR")}%`,
      subtitle: "واریزهای معتبر",
      icon: CheckCheck,
      variant: "success",
    },
    {
      title: "میانگین زمان پردازش",
      value: formatDuration(overview.averageProcessingSeconds),
      subtitle: "دقیقه : ثانیه",
      icon: Clock3,
      variant: "warning",
    },
    {
      title: "خطاهای امروز",
      value: toPersianNumber(overview.totalErrors),
      subtitle: "خطا",
      icon: AlertTriangle,
      variant: "danger",
    },
    {
      title: "سرعت پردازش",
      value: toPersianNumber(overview.processingSpeed),
      subtitle: "رکورد پردازش‌شده",
      icon: Gauge,
      variant: "info",
    },
    {
      title: "صف انتظار",
      value: toPersianNumber(overview.queueSize),
      subtitle: "فایل در صف",
      icon: ListChecks,
      variant: "purple",
    },
  ];

  return (
    <section className="dashboard-kpi-grid">
      {cards.map(({ title, value, subtitle, icon: Icon, variant }) => (
        <article key={title} className={`dashboard-kpi-card ${variant}`}>
          <div className="dashboard-kpi-icon">
            <Icon size={20} />
          </div>

          <p>{title}</p>
          <strong>{value}</strong>
          <small>{subtitle}</small>
        </article>
      ))}
    </section>
  );
}