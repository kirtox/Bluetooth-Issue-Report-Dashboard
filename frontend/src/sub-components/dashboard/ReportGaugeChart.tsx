import React from "react";
import { PieChart, Pie, Cell } from "recharts";

interface Report {
  [key: string]: any;
}

interface ReportGaugeChartProps {
  reports: Report[];
  driver: string;
  valueField?: string; // 預設 "duration"
  title?: string;
  max?: number;        // 可選，固定最大值
}

const COLORS = ["#8884d8", "#82ca9d"]; // 填充與背景顏色

const ReportGaugeChart: React.FC<ReportGaugeChartProps> = ({
  reports,
  driver,
  valueField = "duration",
  title,
  max,
}) => {
  if (!reports || !reports.length) return <div>No data</div>;

  // 計算累積數值
  const cumulative = reports
    .filter(r => r.bt_driver === driver)
    .reduce((acc, r) => acc + Number(r[valueField] || 0), 0);

  const total = max ?? reports.reduce((acc, r) => acc + Number(r[valueField] || 0), 0);
  const percent = Math.min((cumulative / total) * 100, 100);

  const data = [
    { name: "Filled", value: percent },
    { name: "Remaining", value: 100 - percent }
  ];

  return (
    <div style={{ textAlign: "center", width: 220 }}>
      {title && <h5 style={{ marginBottom: 8 }}>{title}</h5>}
      <PieChart width={200} height={120}>
        <Pie
          startAngle={180}
          endAngle={0}
          data={data}
          innerRadius={50}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div style={{ fontSize: 18, fontWeight: "bold" }}>
        {cumulative}/{total}
      </div>
    </div>
  );
};

export default ReportGaugeChart;
