import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { useReports } from "../../hooks/useReports";

interface ReportDurationChartProps {
  reports?: any[];   // ⬅️ 可傳入 filteredReports
  title: string;
}

const ReportDurationChart: React.FC<ReportDurationChartProps> = ({ reports: externalReports, title }) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;  // ⬅️ 優先用外部傳的

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  // Step 1: 累計每個 bt_driver 的 duration (轉數字)
  const durationMap: Record<string, number> = {};
  reports.forEach((r) => {
    const driver = (r["bt_driver"] || "(Empty)").toString();
    const duration = Number(r["duration"]);
    durationMap[driver] = (durationMap[driver] || 0) + (isNaN(duration) ? 0 : duration);
  });

  // Step 2: 轉成 Recharts 格式
  const data = Object.entries(durationMap).map(([driver, totalDuration]) => ({
    name: driver,
    totalDuration,
  }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>
        {title}
      </h5>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip />
          <Bar dataKey="totalDuration" fill="#82ca9d">
            <LabelList
              dataKey="totalDuration"
              position="right"
              style={{ fontSize: 14, fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportDurationChart;
