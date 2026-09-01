import { apiClient } from "../../lib/apiClient";

import type {
  ApiResponse,
  DashboardData,
  DashboardError,
  DashboardHourlyDeposit,
} from "./monitoringVBG.types";

export async function getMonitoringVBGData(
  signal?: AbortSignal,
): Promise<DashboardData> {
  const response = await apiClient.get<ApiResponse<DashboardData>>(
    "/dashboard",
    { signal },
  );

  if (!response.data.success) {
    throw new Error(
      response.data.message ?? "دریافت اطلاعات داشبورد با خطا مواجه شد.",
    );
  }

  return response.data.data;
}

/**
 * داده‌های روند ساعتی از خروجی یکپارچه dashboard استخراج می‌شوند.
 * در صورت ایجاد endpoint مستقل در backend، می‌توان این تابع را
 * با GET /dashboard/hourly-deposits جایگزین کرد.
 */
export async function getMonitoringVBGHourlyDeposits(
  signal?: AbortSignal,
): Promise<DashboardHourlyDeposit[]> {
  const dashboard = await getMonitoringVBGData(signal);

  return dashboard.hourlyDeposits;
}

/**
 * داده‌های خطا از خروجی یکپارچه dashboard استخراج می‌شوند.
 * در صورت ایجاد endpoint مستقل در backend، می‌توان این تابع را
 * با GET /dashboard/errors جایگزین کرد.
 */
export async function getMonitoringVBGErrors(
  signal?: AbortSignal,
): Promise<DashboardError[]> {
  const dashboard = await getMonitoringVBGData(signal);

  return dashboard.errors;
}