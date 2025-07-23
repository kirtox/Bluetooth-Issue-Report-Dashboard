// frontend/src/data/dashboard/CPUStats.tsx
import { useEffect, useState } from "react";
import { CPUStatsProps } from "types";

export function useCPUStats() {
  const [stats, setStats] = useState<CPUStatsProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/reports/cpu_stats")
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ CPU stats fetch success, data:', data);
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ CPU stats failed to load:', err);
        setLoading(false)
      });
  }, []);

  return { stats, loading };
}