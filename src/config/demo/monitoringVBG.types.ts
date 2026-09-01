export type BranchStatus =
  | "idle"
  | "queued"
  | "processing"
  | "done"
  | "error";

export type SystemHealthStatus = "healthy" | "warning" | "critical";

export type QueueHealthStatus =
  | "normal"
  | "busy"
  | "recovering"
  | "critical";

export type BankConnectionStatus = "online" | "offline";

export type ActiveTransferStatus = "queued" | "processing";

export interface ActiveTransfer {
  id: number;
  trackingCode: string;
  branchName: string;
  amount: number;
  status: ActiveTransferStatus;
  startedAt: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardMeta {
  sequenceNumber: number;
  totalSnapshots: number;
  updatedAt: string;
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

export interface DashboardBranch {
  id: number;
  code: string;
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

export interface RecentFile {
  id: number;
  fileName: string;
  branchName: string;
  recordsCount: number;
  amount: number;
  status: Exclude<BranchStatus, "idle">;
  uploadedAt: string;
}

export interface BranchRanking {
  id: number;
  code: string;
  name: string;
  city: string;
  amount: number;
  records: number;
  validRecords: number;
  successRate: number;
  status: BranchStatus;
}

export interface ActiveTransfer {
  id: number;
  trackingCode: string;
  branchName: string;
  amount: number;
  status: Extract<BranchStatus, "queued" | "processing">;
  startedAt: string;
}

export interface DashboardSystemStatus {
  status: SystemHealthStatus;
  cpu: number;
  ram: number;
  activeThreads: number;
  bandwidth: number;
  concurrentRequests: number;
  bankConnection: BankConnectionStatus;
}

export interface DashboardQueueStatus {
  status: QueueHealthStatus;
  queueSize: number;
  inputRate: number;
  outputRate: number;
  longestWaitSeconds: number;
  estimatedFinishTime: string | null;
}

export interface DashboardRecentFile {
  id: number | string;
  fileName: string | null;
  uploadTime: string | null;
  operatorName: string | null;
  records: number;
  validRecords: number;
  processedRecords: number;
  amount: number;
}

export interface DashboardJob {
  name: string;
  countItem: number;
}
export interface DashboardData {
  meta: DashboardMeta;
  overview: DashboardOverview;

  branches: DashboardBranch[];
  hourlyDeposits: DashboardHourlyDeposit[];
  errors: DashboardError[];
  recentFiles: DashboardRecentFile[];
  rankings: BranchRanking[];
  activeTransfers: ActiveTransfer[];
  jobs: DashboardJob[];

  systemStatus: DashboardSystemStatus;
  queueStatus: DashboardQueueStatus;
}
