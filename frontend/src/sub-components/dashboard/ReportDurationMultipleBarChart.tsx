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

interface ReportDurationMultipleBarChartProps {
  reports?: any[];       // 可傳入 filteredReports
  title: string;
  fieldX?: string;       // X 軸欄位，預設 bt_driver
  fieldY?: string;       // 累計欄位，預設 duration
  groupBy?: string;      // 分組欄位，預設 scenario
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];

const ReportDurationMultipleBarChart: React.FC<ReportDurationMultipleBarChartProps> = ({
  reports: externalReports,
  title,
  fieldX = "bt_driver",
  fieldY = "duration",
  groupBy = "scenario",
}) => {
  const { reports: allReports, loading } = useReports();
  const reports = externalReports ?? allReports;

  if (loading && !externalReports) return <div>Loading...</div>;
  if (!reports || !reports.length) return <div>No data</div>;

  // Step 1: 建立二維累計 map
  const dataMap: Record<string, Record<string, number>> = {};
  const groupSet = new Set<string>();

  reports.forEach((r) => {
    const xKey = (r[fieldX] || "(Empty)").toString();
    const groupKey = (r[groupBy] || "(Empty)").toString();
    const value = Number(r[fieldY]) || 0;

    if (!dataMap[xKey]) dataMap[xKey] = {};
    dataMap[xKey][groupKey] = (dataMap[xKey][groupKey] || 0) + value;
    groupSet.add(groupKey);
  });

  const groups = Array.from(groupSet);

  // Step 2: 轉成 Recharts 格式並計算 total
  const data = Object.entries(dataMap).map(([xKey, groupValues]) => {
    const row: Record<string, any> = { name: xKey };
    let total = 0;
    groups.forEach((g) => {
      const val = groupValues[g] || 0;
      row[g] = val;
      total += val;
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
          {groups.map((g, idx) => (
            <Bar key={g} dataKey={g} stackId="a" fill={COLORS[idx % COLORS.length]}>
              {/* 單個 bar 數值 */}
              <LabelList
                dataKey={g}
                content={({ x, y, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) / 2}
                      y={Number(y) + Number(height) / 2}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={14}
                      fontWeight="bold"
                    >
                      {value}
                    </text>
                  );
                }}
              />
              {/* 該列 total */}
              <LabelList
                dataKey="total"
                position="right"
                content={({ x, y, width, height, value }) => {
                  if (!value || value === 0) return null;
                  return (
                    <text
                      x={Number(x) + Number(width) + 10}
                      y={Number(y) + Number(height) / 2}
                      fill="#000"
                      textAnchor="start"
                      dominantBaseline="middle"
                      fontSize={14}
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

export default ReportDurationMultipleBarChart;
