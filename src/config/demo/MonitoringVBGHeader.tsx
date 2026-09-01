import { useEffect, useState } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  Landmark,
  Layers3,
  ServerCog,
} from "lucide-react";

import type { DashboardSystemStatus } from "./monitoringVBG.types";

interface DashboardHeaderProps {
  systemStatus: DashboardSystemStatus;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

export default function DashboardHeader({
  systemStatus,
}: DashboardHeaderProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, []);

  const bankIsOnline = systemStatus.bankConnection === "online";

  return (
    <header className="dashboard-header">
      <div className="dashboard-header-brand">
        <div className="dashboard-header-logo">
          <Layers3 size={25} />
        </div>

        <div>
          <h1>وضعیت جاب های واریز/برداشت گروهی</h1>
          <p>مانیتورینگ لحظه‌ای شعب</p>
        </div>
      </div>

      <div className="dashboard-header-status">
        <div className="dashboard-header-top-info">
          <span className="dashboard-live-badge">
            <i />
            LIVE
          </span>

          <time>{now.toLocaleString("fa-IR")}</time>
        </div>

        <div className="dashboard-system-chips">
          <span className="dashboard-system-chip">
            <Cpu size={14} />
            CPU: {formatNumber(systemStatus.cpu)}٪
          </span>

          <span className="dashboard-system-chip">
            <HardDrive size={14} />
            RAM: {formatNumber(systemStatus.ram)}٪
          </span>

          <span
            className={`dashboard-system-chip ${
              bankIsOnline ? "is-online" : "is-offline"
            }`}
          >
            <Landmark size={14} />
            بانک مرکزی: {bankIsOnline ? "متصل" : "قطع"}
          </span>

          <span className="dashboard-system-chip">
            <ServerCog size={14} />
            {formatNumber(systemStatus.activeThreads)} نخ فعال
          </span>

          <span className="dashboard-system-chip">
            <Activity size={14} />
            {formatNumber(systemStatus.concurrentRequests)} درخواست
          </span>
        </div>
      </div>
    </header>
  );
}