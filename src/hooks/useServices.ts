"use client"

import { PaginationData, Service } from "@/app/business/services/page";
import { getToken } from "@/lib/helpers";
import { useState, useEffect } from "react";
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
  const token = getToken()
  
  const fetchDataService = async () => {

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchQuery && { search: searchQuery }),
      });

      console.log('Making request with token:', token); // Debug
      console.log('API URL:', `${process.env.NEXT_PUBLIC_API_URL}/services?${queryParams}`); // Debug

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/services?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response status:', res.status); // Debug

    //   if (res.status === 401) {
    //     throw new Error('Unauthorized - Please check your token');
    //   }

      if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);

      const data = await res.json();
      console.log('Response data:', data); // Debug
      
      if (data.success) {
        setDataServices(data.data);
        setPagination({
          page: currentPage,
          limit,
          totalCount: data.totalCount || data.data.length,
          totalPages: data.totalPages || Math.ceil(data.data.length / limit),
        });
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error(err instanceof Error ? err.message : 'Gagal memuat data services');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    pagination,
    token,
    fetchDataService,
    currentPage,
    setCurrentPage,
    limit,
    setLimit,
    setSearchQuery,
    dataServices,
  };
};