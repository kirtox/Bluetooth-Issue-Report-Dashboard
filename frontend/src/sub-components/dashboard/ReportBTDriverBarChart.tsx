// frontend/src/sub-components/dashboard/ReportBTDriverBarChart.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { Report } from "./ReportTable";

interface Props {
  reports: Report[];
  title?: string;
}

const ReportBTDriverBarChart: React.FC<Props> = ({ reports, title = "BT Driver 分布" }) => {
  // 統計各 BT driver 筆數
  const dataMap = reports.reduce((acc, cur) => {
    const key = cur.bt_driver || "(Empty)";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 轉成 recharts 需要的陣列格式
  const data = Object.entries(dataMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // 依數量排序

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h5 className="text-center fw-bold mb-3" style={{ fontSize: "1.5rem" }}>{title}</h5>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportBTDriverBarChart;