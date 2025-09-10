// frontend/src/hooks/useReports.ts
import { useEffect, useState } from "react";

export function useReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/reports`)
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Failed to load reports:", err))
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading };
}
