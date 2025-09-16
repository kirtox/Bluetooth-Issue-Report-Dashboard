import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Customized,
} from "recharts";
import { ReportGaugeAreaChartProps } from "types";

// interface Threshold {
//     value: number;
//     color: string;
//     label?: string;
// }

// interface ReportGaugeAreaChartProps {
//   reports: any[];
//   groupBy: string;
//   calcField?: string;
//   calcType?: "sum" | "count";
//   max?: number;
//   thresholds?: Threshold[];
//   title?: string;
// }

// ✅ 指針元件 (含動畫)
const Needle: React.FC<{
  value: number;
  max: number;
  cx: number;
  cy: number;
  outerRadius: number;
}> = ({ value, max, cx, cy, outerRadius }) => {
  const clampedValue = Math.max(0, Math.min(value, max));
  const angle = 180 * (clampedValue / max);
  const rad = ((180 - angle) * Math.PI) / 180;

  const r = outerRadius * 0.9;
  const x = cx + r * Math.cos(rad);
  const y = cy - r * Math.sin(rad);

  return (
    <g>
      <line
        x1={cx}
        y1={cy}
        x2={x}
        y2={y}
        stroke="#000"
        strokeWidth={4}
        strokeLinecap="round"
        style={{
          transition: "all 0.8s ease-out", // ✅ 動畫
        }}
      />
      <circle cx={cx} cy={cy} r={6} fill="#000" />
    </g>
  );
};

// ✅ 依據圖表寬高自動計算中心與半徑，讓百分比定位下仍可正確繪製指針
// const NeedleFromChart: React.FC<{
//   value: number;
//   max: number;
//   chartWidth: number;
//   chartHeight: number;
// }> = ({ value, max, chartWidth, chartHeight }) => {
//   const cx = chartWidth / 2; // 與 cx="50%" 對齊
//   const cy = chartHeight; // 與 cy="100%" 對齊（在底部）
//   const outerRadius = Math.min(chartHeight, chartWidth / 2); // 避免超出左右邊界

//   return <Needle value={value} max={max} cx={cx} cy={cy} outerRadius={outerRadius} />;
// };

const ReportGaugeAreaChart: React.FC<ReportGaugeAreaChartProps> = ({
  reports,
  groupBy,
  calcField = "duration",
  calcType = "sum",
  max = 100,
  thresholds = [
    { value: 30, color: "#ff4d4f", label: "Poor" },
    { value: 70, color: "#ffc658", label: "OK" },
    { value: 100, color: "#82ca9d", label: "Great" },
  ],
  title,
}) => {
  if (!reports || !reports.length) return <div>No data</div>;

  // 分組計算
  const grouped: Record<string, number> = {};
  reports.forEach((r) => {
    const key = r[groupBy] || "(Empty)";
    if (!grouped[key]) grouped[key] = 0;
    if (calcType === "sum") grouped[key] += Number(r[calcField]) || 0;
    else grouped[key] += 1;
  });

  const groups = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div style={{ width: "100%", padding: 20 }}>
      {title && (
        <h3 className="text-center fw-bold mb-4" style={{ fontSize: "1.5rem" }}>
          {title}
        </h3>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {groups.map(({ name, value }) => {
          // 轉換 thresholds → Pie 資料
          const data = thresholds.map((t, i) => {
            const prev = thresholds[i - 1]?.value || 0;
            return {
              name: t.label || t.value.toString(),
              value: t.value - prev,
              color: t.color,
            };
          });

          return (
            <div
              key={name}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              }}
            >
              <h4 className="text-center mb-2">{name}</h4>
              <div style={{ width: 300, margin: "0 auto" }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                    <Pie
                      data={data}
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={70}
                      outerRadius={100}
                      cx={150}
                      cy={150}
                      stroke="none"
                      label={({ name }) => name}
                      labelLine={false}
                    >
                      {data.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>

                    {/* ✅ 指針 */}
                    <Customized
                      component={
                        <Needle
                          value={value}
                          max={max}
                          cx={150}
                          cy={150}
                          outerRadius={100}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div
                style={{
                  textAlign: "center",
                  marginTop: "-20px",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                {value} hrs
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportGaugeAreaChart;
