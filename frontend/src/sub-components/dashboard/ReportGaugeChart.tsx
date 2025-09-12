import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface ReportGaugeChartProps {
  reports: any[];
  groupBy: string; // 依哪個欄位分組
  calcField?: string; // 計算欄位
  calcType?: "sum" | "count"; // 計算方式
  max?: number; // 最大值 (共用)
  thresholds?: { value: number; color: string }[]; // 門檻值
  title?: string;
}

const ReportGaugeChart: React.FC<ReportGaugeChartProps> = ({
  reports,
  groupBy,
  calcField = "duration",
  calcType = "sum",
  max = 100,
  thresholds = [
    { value: 30, color: "#82ca9d" },
    { value: 70, color: "#ffc658" },
    { value: 100, color: "#ff7f50" },
  ],
  title,
}) => {
  if (!reports || !reports.length) return <div>No data</div>;

  // 分組計算數值
  const grouped: Record<string, number> = {};
  reports.forEach((r) => {
    const key = r[groupBy] || "(Empty)";
    if (!grouped[key]) grouped[key] = 0;
    if (calcType === "sum") {
      grouped[key] += Number(r[calcField]) || 0;
    } else {
      grouped[key] += 1;
    }
  });

  // 轉成 array
  const groups = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div style={{ width: "100%", padding: 20 }}>
      {title && (
        <h4 className="text-center fw-bold mb-4" style={{ fontSize: "1.5rem" }}>
          {title}
        </h4>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {groups.map(({ name, value }) => {
          // 找到對應門檻色
          let fillColor = thresholds[0].color;
          for (const th of thresholds) {
            if (value <= th.value) {
              fillColor = th.color;
              break;
            }
          }

          return (
            <div
              key={name}
              style={{
                background: "#f9f9f9",
                borderRadius: "16px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h6 className="text-center mb-2">{name}</h6>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  startAngle={180}
                  endAngle={0}
                  data={[{ name, value, fill: fillColor }]}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, max]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background
                    clockWise
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div
                style={{
                  textAlign: "center",
                  marginTop: "-20px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {value} / {max}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportGaugeChart;
