import { CircleAlert, CircleX } from "lucide-react";

import type { DashboardError } from "../../types/monitoring.types";

interface TodayErrorsCardProps {
  errors: DashboardError[];
  totalTransactions: number;
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

export default function TodayErrorsCard({
  errors,
  totalTransactions,
}: TodayErrorsCardProps) {
  const totalErrors = errors.reduce((sum, item) => sum + item.count, 0);

  const errorRate =
    totalTransactions > 0
      ? ((totalErrors / totalTransactions) * 100).toFixed(2)
      : "0.00";

  return (
    <section className="dashboard-card errors-card">
      <h2>
        <CircleX size={18} />
        خطاهای امروز
      </h2>

      {errors.length === 0 ? (
        <div className="dashboard-empty-state compact success-state">
          <CircleAlert size={30} strokeWidth={1.5} />
          <p>تا این لحظه خطایی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="dashboard-errors-list">
          {errors.map((error) => (
            <div key={error.type} className="dashboard-error-item">
              <span>{error.type}</span>
              <strong>{formatNumber(error.count)}</strong>
            </div>
          ))}
        </div>
      )}

      <footer className="errors-summary">
        <div>
          <span>کل خطاها</span>
          <strong>{formatNumber(totalErrors)}</strong>
        </div>

        <div>
          <span>نرخ خطا</span>
          <strong>{Number(errorRate).toLocaleString("fa-IR")}٪</strong>
        </div>
      </footer>
    </section>
  );
}