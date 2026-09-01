import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import type { DashboardBranch } from "../../types/monitoring.types";

interface Props {
  branches: DashboardBranch[];
  selectedBranchId?: number;
  onBranchSelect: (branch: DashboardBranch) => void;
}

const statusColors = {
  idle: "#cbd5e1",
  queued: "#06b6d4",
  processing: "#f59e0b",
  done: "#10b981",
  error: "#ef4444",
};

const statusLabels = {
  idle: "غیرفعال",
  queued: "در صف",
  processing: "در حال واریز",
  done: "تکمیل شده",
  error: "خطا",
};

export default function IranBranchesMap({
  branches,
  selectedBranchId,
  onBranchSelect,
}: Props) {
  return (
    <section className="dashboard-card dashboard-map-card">
      <h2>شعب فعال روی نقشه</h2>

      <MapContainer
        center={[32.5, 53.5]}
        zoom={5}
        scrollWheelZoom
        className="iran-map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {branches.map((branch) => {
          const isSelected = branch.id === selectedBranchId;

          return (
            <CircleMarker
              key={branch.id}
              center={[branch.latitude, branch.longitude]}
              radius={isSelected ? 11 : branch.status === "idle" ? 5 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: statusColors[branch.status],
                fillOpacity: 1,
              }}
              eventHandlers={{
                click: () => onBranchSelect(branch),
              }}
            >
              <Popup>
                <strong>{branch.name}</strong>
                <br />
                وضعیت: {statusLabels[branch.status]}
                <br />
                رکورد: {branch.records.toLocaleString("fa-IR")}
                <br />
                مبلغ: {branch.amount.toLocaleString("fa-IR")} ریال
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </section>
  );
}