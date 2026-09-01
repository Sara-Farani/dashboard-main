import { Clock3, FileText, Info, MapPin, UserRound } from "lucide-react";

import type {
  BranchStatus,
  DashboardBranch,
} from "../monitoringVBG.types";

interface BranchDetailCardProps {
  branch: DashboardBranch | null;
}

const statusLabels: Record<BranchStatus, string> = {
  idle: "غیرفعال",
  queued: "در صف",
  processing: "در حال واریز",
  done: "تکمیل شده",
  error: "دارای خطا",
};

const statusClassNames: Record<BranchStatus, string> = {
  idle: "status-idle",
  queued: "status-queued",
  processing: "status-processing",
  done: "status-done",
  error: "status-error",
};

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("fa-IR");
}

function calculateProgress(branch: DashboardBranch): number {
  if (branch.validRecords <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round((branch.processedRecords / branch.validRecords) * 100),
    ),
  );
}

export default function BranchDetailCard({
  branch,
}: BranchDetailCardProps) {
  if (!branch) {
    return (
      <section className="dashboard-card branch-detail-card">
        <h2>
          <Info size={18} />
          جزئیات شعبه
        </h2>

        <div className="dashboard-empty-state">
          <MapPin size={34} strokeWidth={1.5} />
          <p>برای مشاهده جزئیات، یک شعبه را از روی نقشه انتخاب کنید.</p>
        </div>
      </section>
    );
  }

  const progress = calculateProgress(branch);

  return (
    <section className="dashboard-card branch-detail-card">
      <h2>
        <Info size={18} />
        جزئیات شعبه
      </h2>

      <div className="branch-detail-title">
        <div>
          <strong>{branch.name}</strong>
          <span>
            <MapPin size={13} />
            {branch.city}
          </span>
        </div>

        <span
          className={`dashboard-status-badge ${
            statusClassNames[branch.status]
          }`}
        >
          {statusLabels[branch.status]}
        </span>
      </div>

      <div className="branch-detail-grid">
        <div className="branch-detail-row">
          <span>تعداد کل رکوردها</span>
          <strong>{formatNumber(branch.records)}</strong>
        </div>

        <div className="branch-detail-row">
          <span>رکوردهای معتبر</span>
          <strong className="text-success">
            {formatNumber(branch.validRecords)}
          </strong>
        </div>

        <div className="branch-detail-row">
          <span>رکوردهای نامعتبر</span>
          <strong className="text-danger">
            {formatNumber(branch.invalidRecords)}
          </strong>
        </div>

        <div className="branch-detail-row">
          <span>رکوردهای پردازش‌شده</span>
          <strong>{formatNumber(branch.processedRecords)}</strong>
        </div>

        <div className="branch-detail-row branch-detail-row-full">
          <span>مبلغ واریز</span>
          <strong>{formatNumber(branch.amount)} ریال</strong>
        </div>
      </div>

      <div className="branch-progress-section">
        <div className="branch-progress-label">
          <span>میزان پیشرفت پردازش</span>
          <strong>{formatNumber(progress)}٪</strong>
        </div>

        <div className="dashboard-progress-track">
          <div
            className={`dashboard-progress-fill ${
              statusClassNames[branch.status]
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="branch-detail-meta">
        <div>
          <FileText size={15} />
          <span>{branch.fileName ?? "فایلی برای این شعبه ثبت نشده است"}</span>
        </div>

        <div>
          <UserRound size={15} />
          <span>{branch.operatorName ?? "اپراتور نامشخص"}</span>
        </div>

        <div>
          <Clock3 size={15} />
          <span>بارگذاری: {formatDateTime(branch.uploadTime)}</span>
        </div>

        {branch.status === "processing" && (
          <div className="branch-estimated-finish">
            <Clock3 size={15} />
            <span>
              پیش‌بینی اتمام: {formatDateTime(branch.estimatedFinishTime)}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}