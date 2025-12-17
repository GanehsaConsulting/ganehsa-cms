import { useEffect, useState } from "react";

// types/counter.ts
export interface Counter {
  id: number;
  refId: number;
  type: "ARTICLE" | "ACTIVITY" | "PROMO";
  count: number;
  createdAt: string;
}

type PeriodFilter = "today" | "1week" | "1month" | "3month" | "6month" | "1year" | "all";

export function useCounters(period: PeriodFilter = "all") {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCounters = async (selectedPeriod: PeriodFilter) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = selectedPeriod !== "all" 
        ? `${process.env.NEXT_PUBLIC_API_URL}/system/counter?period=${selectedPeriod}`
        : `${process.env.NEXT_PUBLIC_API_URL}/system/counter`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch counters: ${res.statusText}`);
      }
        
      const json = await res.json();
      setCounters(json.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch counters";
      console.error(errorMessage, err);
      setError(errorMessage);
      setCounters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounters(period);
  }, [period]);

  return { 
    counters, 
    loading, 
    error,
    refetch: () => fetchCounters(period)
  };
}