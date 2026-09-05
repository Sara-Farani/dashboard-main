import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardJob } from "../monitoringVBG.types";

interface Props {
  jobes: DashboardJob[];
}

export default function JobStatusChart({ jobes }: Props) {
  const data = [...jobes]
    // .filter((branch) => branch.amount > 0)
    // .sort((a, b) => b.amount - a.amount)
    // .slice(0, 7)
    .map((job) => ({
      name: job.name,
      amount: Number((job.countItem).toFixed(1)),
    }));

  return (
    <section className="dashboard-card chart-card">
      <h2>وضعیت صف جاب ها</h2>

      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tick={{dx : -10, "textAnchor" : "start"}}/>
            <Tooltip
              formatter={(value) => [
                `${Number(value).toLocaleString("fa-IR")} فایل`,
                "تعداد",
              ]}
            />
            <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}