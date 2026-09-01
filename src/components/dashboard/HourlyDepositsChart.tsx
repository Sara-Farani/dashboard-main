import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardHourlyDeposit } from "../../types/monitoring.types";

interface Props {
  data: DashboardHourlyDeposit[];
}

export default function HourlyDepositsChart({ data }: Props) {
  const chartData = data.map((item) => ({
    ...item,
    amountMillion: Number((item.amount / 1_000_000).toFixed(1)),
  }));

  return (
    <section className="dashboard-card chart-card">
      <h2>روند ساعتی واریزها</h2>

      <div className="dashboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="hour" />
            <YAxis yAxisId="count" />
            <YAxis yAxisId="amount" orientation="left" />
            <Tooltip />
            <Legend />

            <Area
              yAxisId="count"
              type="monotone"
              dataKey="count"
              name="تعداد تراکنش"
              stroke="#6366f1"
              fill="rgba(99,102,241,.14)"
            />

            <Area
              yAxisId="amount"
              type="monotone"
              dataKey="amountMillion"
              name="مبلغ (میلیون ریال)"
              stroke="#06b6d4"
              fill="rgba(6,182,212,.12)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}