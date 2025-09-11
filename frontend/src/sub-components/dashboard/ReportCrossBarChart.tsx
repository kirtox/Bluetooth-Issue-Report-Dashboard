import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import { useReports } from "../../hooks/useReports";

interface ReportCrossBarChartProps {
  reports?: any[];   // ⬅️ 可傳入 filteredReports
  fieldX: string;
  fieldY: string;
  title: string;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

const ReportCrossBarChart: React.FC<ReportCrossBarChartProps> = ({
  reports: externalReports,
  fieldX,
  fieldY,
  title,
}) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;  // ⬅️ 優先用外部傳的

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  // Step 1: 建立二維統計
  const dataMap: Record<string, Record<string, number>> = {};
  reports.forEach((r) => {
    const xKey = (r[fieldX] || "(Empty)").toString();
    const yKey = (r[fieldY] || "(Empty)").toString();

    if (!dataMap[xKey]) dataMap[xKey] = {};
    dataMap[xKey][yKey] = (dataMap[xKey][yKey] || 0) + 1;
  });

  // Step 2: 收集所有 Y 分類
  const yCategories = Array.from(
    new Set(reports.map((r) => (r[fieldY] || "(Empty)").toString()))
  );

  // Step 3: 轉成 Recharts 格式
  const data = Object.entries(dataMap).map(([xKey, yCounts]) => {
    const row: Record<string, any> = { name: xKey };
    let total = 0;
    yCategories.forEach((y) => {
      const count = yCounts[y] || 0;
      row[y] = count;
      total += count;
    });
    row.total = total;
    return row;
  });

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
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip />
          <Legend />
          {yCategories.map((y, idx) => (
            <Bar key={y} dataKey={y} stackId="a" fill={COLORS[idx % COLORS.length]}>
              <LabelList
                dataKey={y}
                content={({ x, y: yCoord, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(yCoord) + Number(height) / 2}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={16}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              />
              <LabelList
                dataKey="total"
                position="right"
                content={({ x, y: yCoord, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) + 10}
                      y={Number(yCoord) + Number(height) / 2}
                      fill="#000"
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={16}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              />
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportCrossBarChart;
