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
import { formatDate } from "@/lib/helpers";
import { usePackages } from "@/hooks/usePackages";
import { useProjects, Project } from "@/hooks/useProjects";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { TablePackages } from "@/app/business/packages/page";

function WebProjectPage() {
  const router = useRouter();
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // ✅ Use the useProjects hook with serviceId=3 for website projects
  const {
    projects,
    loading,
    searchTerm,
    setSearchTerm,
    selectedPackage,
    page,
    setPage,
    pagination,
    deleteProject,
    handleSubmitSearch,
    handlePackageFilterChange,
  } = useProjects({ serviceId: 3 });

  // ✅ Use the usePackages hook with serviceId=3
  const {
    packages: websitePackages,
    isLoading: packagesLoading,
    setServiceIdFilter,
  } = usePackages();

  // Set serviceId filter to 3 when component mounts
  useEffect(() => {
    setServiceIdFilter(3);
  }, [setServiceIdFilter]);

  const handleDelete = async (project: Project) => {
    await deleteProject(project);
    setShowAlertDelete(false);
    setSelectedProject(null);
  };

  const getPackageLabels = (project: Project) => {
    if (!project.packages || project.packages.length === 0) {
      return <span className="text-neutral-400 text-xs">No package</span>;
    }

    // Only show packages with service ID 3
    const websitePackages = project.packages.filter(
      (pkg) => pkg.package.service.id === 3
    );

    if (websitePackages.length === 0) {
      return (
        <span className="text-neutral-400 text-xs">No website package</span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {websitePackages.map((pkg, idx) => (
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
          <form
            onSubmit={handleSubmitSearch}
            className="flex items-center gap-2"
          >
            <Input
              className="w-100"
              placeholder="Cari Website Projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit">Cari</Button>
          </form>
          <div>
            <SelectComponent
              label="Filter By Package"
              placeholder={packagesLoading ? "Loading packages..." : "All Packages"}
              options={[
                { label: "All Packages", value: "" },
                ...websitePackages.map((pkg: TablePackages) => ({
                  label: pkg.type,
                  value: pkg.id.toString(),
                })),
              ]}
              value={selectedPackage}
              onChange={handlePackageFilterChange}
              disabled={packagesLoading}
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
            <span className="ml-2 text-neutral-400">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            {searchTerm || selectedPackage
              ? "No website projects match your search criteria"
              : "No website projects found"}
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
                            sizes="96px"
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
                              `/projects/website-development/${proj.id}/edit`
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

export default WebProjectPage;