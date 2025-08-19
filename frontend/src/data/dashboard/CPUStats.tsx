// frontend/src/data/dashboard/CPUStats.tsx
import { useEffect, useState } from "react";
import { CPUStatsProps } from "types";

export function useCPUStats() {
  const [stats, setStats] = useState<CPUStatsProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Define API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/reports/cpu_stats`)
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ CPU stats fetch success, data:', data);
        console.log(`${API_BASE_URL}/reports/cpu_stats`);
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ CPU stats failed to load:', err);
        console.log(`${API_BASE_URL}/reports/cpu_stats`);
        setLoading(false)
      });
  }, []);

  return { stats, loading };
}