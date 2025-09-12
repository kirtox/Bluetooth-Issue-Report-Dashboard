import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Customized,
} from "recharts";

interface Threshold {
  value: number;
  color: string;
  label?: string;
}

interface ReportGaugeAreaChartProps {
  reports: any[];
  groupBy: string;
  calcField?: string;
  calcType?: "sum" | "count";
  max?: number;
  thresholds?: Threshold[];
  title?: string;
}

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

  const groups = Object.entries(grouped).map(([name, value]) => ({ name, value }));

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
          // 轉換 thresholds → Pie 資料
          const data = thresholds.map((t, i) => {
            const prev = thresholds[i - 1]?.value || 0;
            return {
              name: t.label || t.value.toString(),
              value: t.value - prev,
              color: t.color,
            };
          });

          // 計算指針角度 (180度範圍)
          const angle = 180 * (value / max);
          const cx = 125;
          const cy = 125;
          const r = 100;
          const rad = ((180 - angle) * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy - r * Math.sin(rad);

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
              <h6 className="text-center mb-2">{name}</h6>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={100}
                    cx={125}
                    cy={125}
                    stroke="none"
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Customized>
                    {() => (
                      <g>
                        <line
                          x1={cx}
                          y1={cy}
                          x2={x}
                          y2={y}
                          stroke="#000"
                          strokeWidth={4}
                          strokeLinecap="round"
                        />
                        <circle cx={cx} cy={cy} r={6} fill="#000" />
                      </g>
                    )}
                  </Customized>
                </PieChart>
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

export default ReportGaugeAreaChart;
