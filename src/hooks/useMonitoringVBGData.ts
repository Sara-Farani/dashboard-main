import { useQuery } from "@tanstack/react-query";

import { getMonitoringVBGData } from "../config/demo/monitoringVBG.service";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],

    queryFn: ({ signal }) => getMonitoringVBGData(signal),

    refetchInterval: 10_000,
    refetchIntervalInBackground: false,

    staleTime: 5_000,
    retry: 1,
  });
}