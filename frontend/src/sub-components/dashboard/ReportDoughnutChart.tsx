// frontend/src/sub-components/dashboard/ReportBTDriverDoughnutChart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { Report } from "./ReportTable";
import { ReportDoughnutChartProps } from "types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#d0ed57", "#FF69B4", "#A52A2A"];

// interface ReportDoughnutChartProps {
//   reports: Report[];
//   field: keyof Report;
//   title: string;
// }

const ReportDoughnutChart: React.FC<ReportDoughnutChartProps> = ({ reports, field, title }) => {
  const dataMap = reports.reduce((acc, cur) => {
    const key = (cur[field] || "(Empty)").toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center fw-bold mb-4" style={{ fontSize: "1.5rem" }}>{title}</h5>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="55%"
            cy="50%"
            // cy="62%"
            // outerRadius={150}
            outerRadius={130}
            innerRadius={80} // 這裡設定圓環
            label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
            labelLine={{ stroke: '#666', strokeWidth: 1 }}
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {/* <Legend /> */}
          <Legend wrapperStyle={{ marginTop: 30 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportDoughnutChart;