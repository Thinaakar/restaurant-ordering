'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AnalyticsSummary } from '@/data/types';
import { apiJson } from '@/lib/http/client';

export function useAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiJson<AnalyticsSummary>('/api/analytics');
      setSummary(data);
    } catch {
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { summary, loading, refresh };
}
