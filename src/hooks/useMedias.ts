// hooks/useMedias.ts
import { Medias } from '@/app/media-library/page';
import { useState, useEffect, useCallback } from 'react';

interface PaginationData {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UseMediasReturn {
  token: string | null;
  pagination: PaginationData;
  getMedias: (search?: string, page?: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  medias: Medias[];
  setMedias: (medias: Medias[] | ((prev: Medias[]) => Medias[])) => void;
}

export function useMedias(): UseMediasReturn {
  const [token, setToken] = useState<string | null>(null);
  const [medias, setMedias] = useState<Medias[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  // Get token from localStorage or your auth context
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const getMedias = useCallback(async (search: string = '', page: number = 1) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/media?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Failed to fetch medias');

      const data = await res.json();
      
      if (data.success) {
        setMedias(data.data);
        setPagination(data.pagination);
      } else {
        throw new Error(data.message || 'Failed to fetch medias');
      }
    } catch (err) {
      console.error('Error fetching medias:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Load medias on initial mount
  useEffect(() => {
    if (token) {
      getMedias();
    }
  }, [token, getMedias]);

  return {
    token,
    pagination,
    getMedias,
    isLoading,
    setIsLoading,
    medias,
    setMedias,
  };
}