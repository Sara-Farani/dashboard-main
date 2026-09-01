import { FileUp, UserRound } from "lucide-react";

import type { DashboardRecentFile } from "../monitoringVBG.types";

interface RecentFilesCardProps {
  files?: DashboardRecentFile[];
}

function formatNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString("fa-IR");
}

function formatTime(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function calculateProgress(file: DashboardRecentFile): number {
  const validRecords = Number(file.validRecords ?? 0);
  const processedRecords = Number(file.processedRecords ?? 0);

  if (validRecords <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((processedRecords / validRecords) * 100)),
  );
}

export default function RecentFilesCard({
  files = [],
}: RecentFilesCardProps) {
  return (
    <section className="dashboard-card recent-files-card">
      <h2>
        <FileUp size={18} />
        فایل‌های اخیر
      </h2>

      {files.length === 0 ? (
        <div className="dashboard-empty-state compact">
          <FileUp size={30} strokeWidth={1.5} />
          <p>فایلی برای امروز ثبت نشده است.</p>
        </div>
      ) : (
        <div className="recent-files-list">
          {files.map((file) => {
            const progress = calculateProgress(file);

            return (
              <article key={file.id} className="recent-file-item">
                <div className="recent-file-top">
                  <strong title={file.fileName ?? undefined}>
                    {file.fileName ?? "بدون نام"}
                  </strong>

                  <time>{formatTime(file.uploadTime)}</time>
                </div>

                <div className="recent-file-meta">
                  <span>
                    <UserRound size={13} />
                    {file.operatorName ?? "نامشخص"}
                  </span>

                  <span>{formatNumber(file.records)} رکورد</span>
                </div>

                <div className="recent-file-amount">
                  {formatNumber(file.amount)} ریال
                </div>

                <div className="recent-file-progress">
                  <div className="dashboard-progress-track">
                    <div
                      className="dashboard-progress-fill status-processing"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <span>{formatNumber(progress)}٪</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}