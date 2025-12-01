import { useEffect, useState } from "react";

// types/counter.ts
export interface Counter {
  id: number;
  refId: number;
  type: "ARTICLE" | "ACTIVITY" | "PROMO";
  count: number;
}

export function useCounters() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCounters = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/system/counter`);
      const json = await res.json();
      setCounters(json.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch counters:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounters();
  }, []);

  return { counters, loading };
}
