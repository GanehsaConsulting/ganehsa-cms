"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectComponent } from "@/components/ui/select";
import { Wrapper } from "@/components/wrapper";
import {
  Plus,
  Calendar,
  Tag,
  Pencil,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate, getToken } from "@/lib/helpers";
import { usePackages } from "@/hooks/usePackages";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { TablePackages } from "@/app/business/packages/page";

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

function SocmedProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // ✅ Ambil data packages hanya untuk service ID 7
  const { packages } = usePackages();
  // const socmedPackages = packages.filter((pkg: any) => pkg.serviceId === 7);
  const socmedPackages = packages.filter((pkg) => {
    const p = pkg as unknown as Record<string, unknown>;
    const serviceIdValue =
      typeof p["serviceId"] === "number"
        ? (p["serviceId"] as number)
        : typeof p["service_id"] === "number"
        ? (p["service_id"] as number)
        : undefined;
    return serviceIdValue === 7;
  }) as TablePackages[];

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        serviceId: "7", // Explicitly request service ID 7
        ...(search && { search }),
        ...(selectedPackage && { packageId: selectedPackage }),
      });

      console.log("Fetch projects params:", params.toString());

      const res = await fetch(`/api/projects?${params.toString()}`);
      const data = await res.json();

      console.log("Projects response:", data);

      if (data.success) {
        // Server may not filter by packageId, so apply robust client-side filtering:
        const filteredProjects = (data.data as Project[]).filter((project) => {
          // ensure project belongs to service 7
          const hasService7 = project.packages.some(
            (pkg) => pkg.package.service?.id === 7
          );
          if (!hasService7) return false;

          // if a package is selected, further filter by that package id
          if (selectedPackage) {
            const selId = Number(selectedPackage);
            if (Number.isNaN(selId)) return false;
            return project.packages.some((pkg) => pkg.package.id === selId);
          }

          return true;
        });

        setProjects(filteredProjects);
        // If backend returns pagination based on unfiltered results, you may want to adjust pagination here.
        setPagination(data.pagination);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedPackage]);

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [page, search, selectedPackage]);

  const handleSearch = () => {
    setPage(1);
    fetchProjects();
  };

  const token = getToken();

  const handleDelete = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project deleted successfully");
        setShowAlertDelete(false);
        setSelectedProject(null);
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const getPackageLabels = (project: Project) => {
    if (!project.packages || project.packages.length === 0) {
      return <span className="text-neutral-400 text-xs">No package</span>;
    }

    // Hanya tampilkan packages dengan service ID 7
    const socmedProjectPackages = project.packages.filter(
      (pkg) => pkg.package.service.id === 7
    );

    if (socmedProjectPackages.length === 0) {
      return (
        <span className="text-neutral-400 text-xs">No socmed package</span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {socmedProjectPackages.map((pkg, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-mainColor/50 backdrop-blur-2xl text-neutral-200 text-xs font-medium"
          >
            <Tag className="w-3 h-3" />
            {pkg.package.type}
          </span>
        ))}
      </div>
    );
  };

  function handleSubmitSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchTerm);
  }

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      setSearch(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(id);
  }, [searchTerm]);

  return (
    <Wrapper className="flex flex-col">
      {/* Header Action */}
      <section className="flex items-center justify-between gap-0 w-full mb-6">
        <div className="flex items-center gap-4 w-full">
          <form
            onSubmit={handleSubmitSearch}
            className="flex items-center gap-2"
          >
            <Input
              className="w-100"
              placeholder="Cari Socmed Management Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmitSearch(e)}
            />
            <Button>Cari</Button>
          </form>
          <div>
            <SelectComponent
              label="Filter By Package"
              placeholder="All Packages"
              options={[
                { label: "All Packages", value: "" },
                ...socmedPackages.map((pkg: TablePackages) => ({
                  label: pkg.type,
                  // ensure option value is string
                  value: String(pkg.id),
                })),
              ]}
              value={selectedPackage}
              onChange={(value) => {
                // Coerce value to string (SelectComponent may emit number)
                const v =
                  value === null || value === undefined ? "" : String(value);
                console.log("Selected package (coerced):", v);
                setSelectedPackage(v);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => router.push("/projects/socmed-management/new")}
          >
            <Plus /> New Socmed Project
          </Button>
        </div>
      </section>

      {/* List View */}
      <section>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-mainColor" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            No socmed projects found
          </div>
        ) : (
          <>
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="border-b border-lightColor/10 dark:border-darkColor/10">
                  <th className="text-left text-sm font-medium text-white p-2">
                    Preview
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Name
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Company
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Packages
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Created At
                  </th>
                  <th className="text-left text-sm font-medium text-white p-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="border-b border-lightColor/10 dark:border-darkColor/10 hover:bg-lightColor/10 dark:hover:bg-darkColor/10 transition-colors"
                  >
                    <td className="p-2">
                      <div className="w-24 h-25 relative rounded-md overflow-hidden bg-neutral-800">
                        {proj.preview ? (
                          <Image
                            fill
                            src={proj.preview}
                            alt={proj.name}
                            className="object-cover object-[50%_85%]"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-neutral-500 text-xs">
                            No preview
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 text-sm text-white font-medium">
                      {proj.name}
                    </td>
                    <td className="p-2 text-sm text-neutral-300">
                      {proj.companyName}
                    </td>
                    <td className="p-2">{getPackageLabels(proj)}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-300">
                        <Calendar className="w-4 h-4" />
                        {formatDate(proj.createdAt)}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(proj.link, "_blank")}
                          title="View Project"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            router.push(
                              `/projects/socmed-management/${proj.id}/edit` // Fixed edit route
                            )
                          }
                          title="Edit Project"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedProject(proj);
                            setShowAlertDelete(true);
                          }}
                          className="text-red-500 hover:text-red-600"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-neutral-400">
                  Showing {(page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(page * pagination.limit, pagination.total)} of{" "}
                  {pagination.total} projects
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      variant={page === i + 1 ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* Alert Dialog for Delete Confirmation */}
      {showAlertDelete && selectedProject && (
        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedProject(null);
            }
          }}
          header="Hapus Project"
          desc={`Apakah Anda yakin ingin menghapus project "${selectedProject.name}"?`}
          continueAction={() =>
            selectedProject && handleDelete(selectedProject)
          }
        />
      )}
    </Wrapper>
  );
}

export default SocmedProjectPage;
