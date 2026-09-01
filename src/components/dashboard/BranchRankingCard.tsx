import { Trophy } from "lucide-react";

import type { DashboardBranch } from "../../types/monitoring.types";

interface BranchRankingCardProps {
  branches: DashboardBranch[];
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

export default function BranchRankingCard({
  branches,
}: BranchRankingCardProps) {
  return (
    <section className="dashboard-card branch-ranking-card">
      <h2>
        <Trophy size={18} />
        رتبه‌بندی شعب
      </h2>

      {branches.length === 0 ? (
        <div className="dashboard-empty-state compact">
          <Trophy size={30} strokeWidth={1.5} />
          <p>اطلاعاتی برای رتبه‌بندی وجود ندارد.</p>
        </div>
      ) : (
        <ol className="branch-ranking-list">
          {branches.map((branch, index) => (
            <li key={branch.id} className="branch-ranking-item">
              <div className="branch-ranking-name">
                <span
                  className={`branch-ranking-number rank-${Math.min(
                    index + 1,
                    4,
                  )}`}
                >
                  {formatNumber(index + 1)}
                </span>

                <div>
                  <strong>{branch.name}</strong>
                  <small>{branch.city}</small>
                </div>
              </div>

              <strong className="branch-ranking-amount">
                {formatNumber(branch.amount)}
              </strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}