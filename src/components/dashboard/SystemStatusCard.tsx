import {
  Activity,
  Cpu,
  HardDrive,
  Network,
  ServerCog,
  Wifi,
} from "lucide-react";

import type { DashboardSystemStatus } from "../../types/monitoring.types";

interface SystemStatusCardProps {
  data: DashboardSystemStatus;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

export default function SystemStatusCard({ data }: SystemStatusCardProps) {
  const bankIsOnline = data.bankConnection === "online";

  const items = [
    {
      label: "CPU",
      value: `${formatNumber(data.cpu)}٪`,
      icon: Cpu,
    },
    {
      label: "حافظه",
      value: `${formatNumber(data.ram)}٪`,
      icon: HardDrive,
    },
    {
      label: "نخ‌های فعال",
      value: formatNumber(data.activeThreads),
      icon: ServerCog,
    },
    {
      label: "پهنای باند",
      value: `${formatNumber(data.bandwidth)} MB/s`,
      icon: Network,
    },
    {
      label: "درخواست هم‌زمان",
      value: formatNumber(data.concurrentRequests),
      icon: Activity,
    },
  ];

  return (
    <section className="dashboard-card system-status-card">
      <h2>
        <ServerCog size={18} />
        وضعیت سیستم
      </h2>

      <div className="system-status-list">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="system-status-item">
            <span>
              <Icon size={15} />
              {label}
            </span>

            <strong>{value}</strong>
          </div>
        ))}

        <div className="system-status-item">
          <span>
            <Wifi size={15} />
            اتصال بانک مرکزی
          </span>

          <strong
            className={
              bankIsOnline
                ? "system-connection-online"
                : "system-connection-offline"
            }
          >
            <i />
            {bankIsOnline ? "متصل" : "قطع"}
          </strong>
        </div>
      </div>
    </section>
  );
}