import { ListChecks } from "lucide-react";

import type {
  ActiveTransfer,
  ActiveTransferStatus,
} from "../monitoringVBG.types";

interface ActiveTransfersTableProps {
  transfers: ActiveTransfer[];
}

const statusLabels: Record<ActiveTransferStatus, string> = {
  queued: "در صف",
  processing: "در حال واریز",
};

const statusClassNames: Record<ActiveTransferStatus, string> = {
  queued: "status-queued",
  processing: "status-processing",
};

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

function formatTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
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
                <th>کد رهگیری</th>
                <th>شعبه</th>
                <th>مبلغ (ریال)</th>
                <th>وضعیت</th>
                <th>زمان شروع</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td className="tracking-code">
                    <strong>{transfer.trackingCode}</strong>
                  </td>

                  <td>{transfer.branchName}</td>

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

                  <td>{formatTime(transfer.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}