// frontend/src/sub-components/dashboard/ReportPieChart.tsx
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ReportPieChartProps } from "types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#d0ed57"];

// interface ReportPieChartProps {
//   reports: Report[];
//   field: keyof Report;
//   title: string;
// }

const ReportPieChart: React.FC<ReportPieChartProps> = ({ reports, field, title }) => {
  const dataMap = reports.reduce((acc, cur) => {
    const key = (cur[field] || "(Empty)").toString();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dataMap).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ width: 400, height: 400 }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>{title}</h5>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, idx) => (
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

export default ReportPieChart;