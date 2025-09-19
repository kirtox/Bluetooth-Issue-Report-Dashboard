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
import { ReportDurationMultipleBarChartProps } from "types";

// interface ReportDurationMultipleBarChartProps {
//   reports?: any[];       // Load filteredReports
//   title: string;
//   fieldX?: string;       // X-axis field, default is bt_driver
//   fieldY?: string;       // Cumulative field, default is duration
//   groupBy?: string;      // Grouping field, default is scenario
// }

// const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57"];
const COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff7f50", // Coral orange
  "#a4de6c", // Light green
  "#d0ed57", // Light yellow-green
  "#8dd1e1", // Light blue
  "#83a6ed", // Blue-purple
  "#8e4585", // Lilac
  "#ffb6b9", // Light pink
  "#ffd700", // Golden
  "#7fc8a9", // Blue-green
];

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

  // Step 1: Create a two-dimensional cumulative map
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

  // Step 2: Convert to Recharts format and calculate total
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
          margin={{ top: 20, right: 30, left: 40, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} label={{ value: "(hr)", position: "insideBottomRight", offset: -5 }} />
          <YAxis type="category" dataKey="name" width={120} />
          <Tooltip wrapperStyle={{ zIndex: 1000 }} />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: 8 }} />
          {groups.map((g, idx) => (
            <Bar key={g} dataKey={g} stackId="a" fill={COLORS[idx % COLORS.length]}>
              {/* Single bar value */}
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

              {/* The column total */}
              {/* <LabelList
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
              /> */}
              
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportDurationMultipleBarChart;
