// frontend/src/sub-components/dashboard/ReportBTDriverDoughnutChart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Report } from "./ReportTable";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#d0ed57", "#FF69B4", "#A52A2A"];

interface Props {
  reports: Report[];
  title?: string;
}

const ReportBTDriverDoughnutChart: React.FC<Props> = ({ reports, title = "BT Driver 圓環圖" }) => {
  // 統計各 BT driver 筆數
  const dataMap = reports.reduce((acc, cur) => {
    const key = cur.bt_driver || "(Empty)";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>{title}</h5>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            innerRadius={80} // 這裡設定圓環
            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
            labelLine={{ stroke: '#666', strokeWidth: 1 }}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportBTDriverDoughnutChart;