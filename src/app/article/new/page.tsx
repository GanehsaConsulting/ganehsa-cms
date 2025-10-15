"use client"

import { PaginationData, Service } from "@/app/business/services/page";
import { getToken } from "@/lib/helpers";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export const useServices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [dataServices, setDataServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  
  const token = getToken();

  // Wrap fetchDataService in useCallback to prevent unnecessary recreations
  const fetchDataService = useCallback(async () => {
    if (!token) {
      console.warn('No token available, skipping fetch');
      return;
    }

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      console.log('Making request with token:', token);
      console.log('API URL:', `/api/services?${queryParams}`);

      const res = await fetch(
        `/api/services?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', res.status);

      if (!res.ok) {
        throw new Error(`Failed to fetch services: ${res.status}`);
      }

      const data = await res.json();
      console.log('Response data:', data);
      
      if (data.success) {
        setDataServices(data.data);
        setPagination({
          page: currentPage,
          limit,
          totalCount: data.totalCount || data.data.length,
          totalPages: data.totalPages || Math.ceil(data.data.length / limit),
        });
      } else {
        throw new Error(data.message || 'Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal memuat data services');
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, limit, searchQuery]);

  // Automatically fetch data when the hook is used
  useEffect(() => {
    fetchDataService();
  }, [fetchDataService]);

  // Function to manually refresh data
  const refreshData = useCallback(() => {
    fetchDataService();
  }, [fetchDataService]);

  return {
    isLoading,
    pagination,
    token,
    fetchDataService: refreshData, // Return the refresh function
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    setSearchQuery,
    dataServices,
    refreshData, // Also return as refreshData for clarity
  };
};