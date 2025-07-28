// frontend/src/sub-components/dashboard/ReportSummary.tsx
import React from "react";
import { Report } from "./ReportTable";
import ReportPieChart from "./ReportPieChart";

interface ReportSummaryProps {
  reports: Report[];
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ reports }) => {
  // 統計各 result 數量
  const passCount = reports.filter(r => r.result?.toUpperCase() === "PASS").length;
  const failCount = reports.filter(r => r.result?.toUpperCase() === "FAIL").length;
  // 你可以再加更多統計

  return (
    // <div className="d-flex gap-3 mb-3">
    //   <div className="card p-3">
    //     <h5>PASS</h5>
    //     <div>{passCount}</div>
    //   </div>
    //   <div className="card p-3">
    //     <h5>FAIL</h5>
    //     <div>{failCount}</div>
    //   </div>
    //   {/* 你可以加更多 summary card */}
    // </div>
    <div className="d-flex gap-4 mb-3 flex-wrap">
      <ReportPieChart reports={reports} field="result" title="Result 分布" />
      <ReportPieChart reports={reports} field="platform" title="Platform 分布" />
      <ReportPieChart reports={reports} field="current_status" title="Status 分布" />
      {/* 你可以再加更多 PieChart */}
    </div>
  );
};

export default ReportSummary;