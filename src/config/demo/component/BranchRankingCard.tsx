import { Trophy } from "lucide-react";

import type { BranchRanking } from "../monitoringVBG.types";

interface BranchRankingCardProps {
  rankings: BranchRanking[];
}

function formatNumber(value: number): string {
  return value.toLocaleString("fa-IR");
}

export default function BranchRankingCard({
  rankings,
}: BranchRankingCardProps) {
  return (
    <section className="dashboard-card branch-ranking-card">
      <h2>
        <Trophy size={18} />
        رتبه‌بندی شعب
      </h2>

      {rankings.length === 0 ? (
        <div className="dashboard-empty-state compact">
          <Trophy size={30} strokeWidth={1.5} />
          <p>اطلاعاتی برای رتبه‌بندی وجود ندارد.</p>
        </div>
      ) : (
        <ol className="branch-ranking-list">
          {rankings.map((branch, index) => (
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
                  <small>
                    {branch.city} · {branch.code}
                  </small>
                </div>
              </div>

              <div className="branch-ranking-details">
                <strong className="branch-ranking-amount">
                  {formatNumber(branch.amount)} ریال
                </strong>

                <small>
                  {formatNumber(branch.records)} تراکنش · موفقیت{" "}
                  {branch.successRate.toLocaleString("fa-IR")}٪
                </small>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}