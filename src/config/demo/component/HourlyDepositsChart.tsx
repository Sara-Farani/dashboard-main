import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardHourlyDeposit } from "../monitoringVBG.types";

interface HourlyDepositsChartProps {
  deposits?: DashboardHourlyDeposit[];
}

interface ChartItem {
  hour: string;
  count: number;
  amount: number;
}

function formatAmount(value: number): string {
  return new Intl.NumberFormat("fa-IR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fa-IR").format(value);
}

export default function HourlyDepositsChart({
  deposits = [],
}: HourlyDepositsChartProps) {
  const chartData: ChartItem[] = Array.isArray(deposits)
    ? deposits.map((item) => ({
        hour: item.hour,
        count: Number(item.count ?? 0),
        amount: Number(item.amount ?? 0),
      }))
    : [];

  return (
    <section className="dashboard-card hourly-deposits-chart">
      <div className="dashboard-card__header">
        <div>
          <h2>روند ساعتی واریزها</h2>
          <p>مبلغ و تعداد تراکنش‌های ثبت‌شده در ساعات امروز</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="dashboard-empty-state">
          اطلاعاتی برای روند ساعتی واریزها وجود ندارد.
        </div>
      ) : (
        <div className="dashboard-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 15,
                left: 5,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="hourlyDepositAmountGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.25)"
              />

              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={formatAmount}
                tickLine={false}
                axisLine={false}
                width={56}
                tick={{ fontSize: 11 }}
              />

              <Tooltip
                formatter={(value, name) => {
                  const numericValue = Number(value ?? 0);

                  if (name === "amount") {
                    return [
                      `${formatNumber(numericValue)} ریال`,
                      "مبلغ واریز",
                    ];
                  }

                  return [formatNumber(numericValue), "تعداد تراکنش"];
                }}
                labelFormatter={(label) => `ساعت ${label}`}
              />

              <Area
                type="monotone"
                dataKey="amount"
                name="amount"
                stroke="#2563eb"
                strokeWidth={3}
                fill="url(#hourlyDepositAmountGradient)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}