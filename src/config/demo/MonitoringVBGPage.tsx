import { useState } from "react";

import ActiveTransfersTable from "./component/ActiveTransfersTable";
import BranchDepositsChart from "./component/BranchDepositsChart";
import BranchDetailCard from "./component/BranchDetailCard";
import BranchRankingCard from "./component/BranchRankingCard";
import DashboardHeader from "./MonitoringVBGHeader";
import DashboardKpiCards from "./component/DashboardKpiCards";
import HourlyDepositsChart from "./component/HourlyDepositsChart";
import QueueStatusCard from "./component/QueueStatusCard";
import RecentFilesCard from "./component/RecentFilesCard";
import SystemStatusCard from "./component/SystemStatusCard";
import TodayErrorsCard from "./component/TodayErrorsCard";
import JobStatusChart from './component/JobStatusChart'

import { useDashboardData } from "../../hooks/useMonitoringVBGData";
import type { DashboardBranch } from "./monitoringVBG.types";
import IranMapCard from './component/map/IranMap.card';


import "../../styles/monitoring.css";


export default function MonitoringVBG_Page() {
  const { data, isLoading, isError, error, refetch } = useDashboardData();

  if (isLoading) {
    return (
      <div className="dashboard-loading" role="status">
        در حال دریافت اطلاعات داشبورد...
      </div>
    );
  }

  if (isError || !data) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "دریافت اطلاعات داشبورد با خطا مواجه شد.";

    return (
      <div className="dashboard-error" role="alert">
        <p>{errorMessage}</p>

        <button type="button" onClick={() => void refetch()}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <main className="deposit-dashboard">
      <DashboardHeader systemStatus={data.systemStatus ?? []} />

      <DashboardKpiCards overview={data.overview ?? []} />

      <section className="dashboard-main-grid">
        <div className="dashboard-side-charts">
          <IranMapCard />
        </div>
        <div className="dashboard-side-charts">
          <JobStatusChart jobes={data.jobs ?? []} />
          <BranchDepositsChart branches={data.branches ?? []} />
          {/* <BranchDetailCard branch={selectedBranch} /> */}
        </div>
      </section>

      <section className="dashboard-full-width-section">
        <HourlyDepositsChart deposits={data.hourlyDeposits ?? []} />
      </section>

      <section className="dashboard-three-columns">
        <RecentFilesCard files={data.recentFiles ?? []} />

        <TodayErrorsCard
          errors={data.errors ?? []}
          totalTransactions={data.overview.totalTransactions ?? 0}
        />

        <BranchRankingCard rankings={data.rankings ?? []} />
      </section>

      <section className="dashboard-bottom-grid">
        <SystemStatusCard data={data.systemStatus ?? []} />

        <QueueStatusCard data={data.queueStatus ?? []} />

        <ActiveTransfersTable transfers={data.activeTransfers ?? []} />
      </section>
    </main>
  );
}