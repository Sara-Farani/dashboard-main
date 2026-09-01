import { ListChecks } from "lucide-react";

import type {
  BranchStatus,
  DashboardBranch,
} from "../../types/monitoring.types";

interface ActiveTransfersTableProps {
  transfers: DashboardBranch[];
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

function calculateProgress(transfer: DashboardBranch): number {
  if (transfer.validRecords <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(
        (transfer.processedRecords / transfer.validRecords) * 100,
      ),
    ),
  );
}

export default function ActiveTransfersTable({
  transfers,
}: ActiveTransfersTableProps) {
  return (
    <section className="dashboard-card active-transfers-card">
      <h2>
        <ListChecks size={18} />
        تراکنش‌های فعال
      </h2>

      {transfers.length === 0 ? (
        <div className="dashboard-empty-state compact">
          <ListChecks size={30} strokeWidth={1.5} />
          <p>در حال حاضر تراکنش فعالی وجود ندارد.</p>
        </div>
      ) : (
        <div className="dashboard-table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>شعبه</th>
                <th>فایل</th>
                <th>رکورد</th>
                <th>معتبر / نامعتبر</th>
                <th>پردازش</th>
                <th>مبلغ (ریال)</th>
                <th>وضعیت</th>
                <th>شروع</th>
                <th>پیش‌بینی اتمام</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => {
                const progress = calculateProgress(transfer);

                return (
                  <tr key={transfer.id}>
                    <td>
                      <strong>{transfer.name}</strong>
                    </td>

                    <td className="table-file-name">
                      {transfer.fileName ?? "—"}
                    </td>

                    <td>{formatNumber(transfer.records)}</td>

                    <td>
                      <span className="text-success">
                        {formatNumber(transfer.validRecords)}
                      </span>
                      {" / "}
                      <span className="text-danger">
                        {formatNumber(transfer.invalidRecords)}
                      </span>
                    </td>

                    <td>
                      <div className="table-progress-cell">
                        <span>{formatNumber(transfer.processedRecords)}</span>

                        <div className="dashboard-progress-track">
                          <div
                            className="dashboard-progress-fill status-processing"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <small>{formatNumber(progress)}٪</small>
                      </div>
                    </td>

                    <td className="table-amount">
                      {formatNumber(transfer.amount)}
                    </td>

                    <td>
                      <span
                        className={`dashboard-status-badge ${
                          statusClassNames[transfer.status]
                        }`}
                      >
                        {statusLabels[transfer.status]}
                      </span>
                    </td>

                    <td>{formatTime(transfer.startTime)}</td>

                    <td>
                      {transfer.status === "processing"
                        ? formatTime(transfer.estimatedFinishTime)
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}