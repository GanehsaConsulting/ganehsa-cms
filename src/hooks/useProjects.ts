import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";

export interface Project {
  id: number;
  name: string;
  companyName: string;
  link: string;
  preview: string;
  previewPublicId?: string;
  createdAt: string;
  updatedAt: string;
  packages: {
    package: {
      id: number;
      type: string;
      service: {
        id: number;
        name: string;
      };
    };
  }[];
}

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface UseProjectsOptions {
  serviceId: number;
  initialLimit?: number;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedPackage: string;
  setSelectedPackage: (packageId: string) => void;
  page: number;
  setPage: (page: number) => void;
  pagination: Pagination;
  fetchProjects: () => Promise<void>;
  deleteProject: (project: Project) => Promise<void>;
  handleSubmitSearch: (e: React.FormEvent) => void;
  handlePackageFilterChange: (value: string) => void;
}

export function useProjects({
  serviceId,
  initialLimit = 10,
}: UseProjectsOptions): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: initialLimit,
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const params = new URLSearchParams({
        page: page.toString(),
        limit: initialLimit.toString(),
        serviceId: serviceId.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(selectedPackage && { packageId: selectedPackage }),
      });

      console.log(`Fetching projects with params:`, params.toString());

      const res = await fetch(`/api/projects?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.success) {
        console.log("Fetched projects data:", data.data);

        // Additional client-side filtering to ensure only correct service projects
        const filteredProjects = data.data.filter((project: Project) =>
          project.packages.some((pkg) => pkg.package.service.id === serviceId)
        );

        setProjects(filteredProjects);
        setPagination(
          data.pagination || {
            total: filteredProjects.length,
            totalPages: Math.ceil(filteredProjects.length / initialLimit),
            currentPage: page,
            limit: initialLimit,
          }
        );
      } else {
        throw new Error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
      setProjects([]);
      setPagination({
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: initialLimit,
      });
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedPackage, serviceId, initialLimit]);

  // Fetch projects when dependencies change
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "" || page === 1) {
        fetchProjects();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, page, fetchProjects]);

  const deleteProject = async (project: Project) => {
    try {
      const token = getToken();
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        await fetchProjects();
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handlePackageFilterChange = (value: string) => {
    setSelectedPackage(value);
    setPage(1);
  };

  return {
    projects,
    loading,
    searchTerm,
    setSearchTerm,
    selectedPackage,
    setSelectedPackage,
    page,
    setPage,
    pagination,
    fetchProjects,
    deleteProject,
    handleSubmitSearch,
    handlePackageFilterChange,
  };
}