export type BranchStatus = "idle" | "queued" | "processing" | "done" | "error";

export interface DashboardBranch {
  id: number;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  status: BranchStatus;
  records: number;
  validRecords: number;
  invalidRecords: number;
  processedRecords: number;
  amount: number;
  fileName: string | null;
  operatorName: string | null;
  fileSizeMb: number | null;
  uploadTime: string | null;
  startTime: string | null;
  estimatedFinishTime: string | null;
}

export interface DashboardHourlyDeposit {
  hour: string;
  count: number;
  amount: number;
}

export interface DashboardError {
  type: string;
  count: number;
}

export interface DashboardOverview {
  totalAmount: number;
  totalTransactions: number;
  totalValidTransactions: number;
  totalErrors: number;
  successRate: number;
  queueSize: number;
  processingSpeed: number;
  averageProcessingSeconds: number;
}

export interface DashboardSystemStatus {
  cpu: number;
  ram: number;
  activeThreads: number;
  bandwidth: number;
  concurrentRequests: number;
  bankConnection: "online" | "offline";
}

export interface DashboardQueueStatus {
  queueSize: number;
  inputRate: number;
  outputRate: number;
  longestWaitSeconds: number;
  estimatedFinishTime: string | null;
}

export interface DashboardData {
  overview: DashboardOverview;
  branches: DashboardBranch[];
  hourlyDeposits: DashboardHourlyDeposit[];
  errors: DashboardError[];
  recentFiles: DashboardBranch[];
  rankings: DashboardBranch[];
  activeTransfers: DashboardBranch[];
  systemStatus: DashboardSystemStatus;
  queueStatus: DashboardQueueStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}