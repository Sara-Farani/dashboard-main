import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardBranch } from "../monitoringVBG.types";

interface Props {
  branches: DashboardBranch[];
}

export default function BranchDepositsChart({ branches }: Props) {
  const data = [...branches]
    .filter((branch) => branch.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 7)
    .map((branch) => ({
      name: branch.name,
      amount: Number((branch.amount / 1_000_000).toFixed(1)),
    }));

  return (
    <section className="dashboard-card chart-card">
      <h2>واریز بر اساس شعبه</h2>

      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tick={{dx : -10, "textAnchor" : "start"}}/>
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString("fa-IR")} میلیون ریال`,
                "مبلغ",
              ]}
            />
            <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}