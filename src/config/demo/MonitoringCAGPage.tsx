import "../../styles/monitoring.css";

export default function MonitoringCAG_Page() {
 
  const isLoading = true;

  if (isLoading) {
    return (
      <div className="dashboard-loading" role="status">
        در حال دریافت اطلاعات داشبورد...
      </div>
    );
  }

}