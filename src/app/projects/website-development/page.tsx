"use client";

import { useState, useEffect } from "react";
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
import { formatDate } from "@/lib/helpers";
import { usePackages } from "@/hooks/usePackages";

interface Project {
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

interface Package {
  id: number;
  type: string;
  serviceId: number;
}

function WebProjectPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  });

  // Fetch projects
  useEffect(() => {
    fetchProjects();
  }, [page, search, selectedPackage]);

  // ✅ Ambil data packages
  const { packages } = usePackages();
  const websitePackages = packages.filter((pkg: any) => pkg.serviceId === 3);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
        ...(selectedPackage && { packageId: selectedPackage }),
      });

      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();

      if (data.success) {
        console.log("INI EGE", data.data);
        
        setProjects(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Project deleted successfully");
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

    return (
      <div className="flex flex-wrap gap-1">
        {project.packages.map((pkg, idx) => (
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

  return (
    <Wrapper className="flex flex-col">
      {/* Header Action */}
      <section className="flex items-center justify-between gap-0 w-full mb-6">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input
              className="w-100"
              placeholder="Cari Website..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch}>Cari</Button>
          </div>
          <div>
            <SelectComponent
              label="Filter By Package"
              placeholder="All Packages"
              options={[
                { label: "All Packages", value: "" },
                ...packages.map((pkg) => ({
                  label: pkg.type,
                  value: pkg.id.toString(),
                })),
              ]}
              value={selectedPackage}
              onChange={(value) => {
                setSelectedPackage(value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => router.push("/projects/website-development/new")}
          >
            <Plus /> Tambah Website
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
            No projects found
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
                      <div className="w-24 h-16 relative rounded-md overflow-hidden bg-neutral-800">
                        {proj.preview ? (
                          <Image
                            fill
                            src={proj.preview}
                            alt={proj.name}
                            className="object-cover"
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
                            router.push(`/projects/website-development/${proj.id}/edit`)
                          }
                          title="Edit Project"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(proj.id)}
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
    </Wrapper>
  );
}

export default WebProjectPage;
