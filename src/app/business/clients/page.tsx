"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wrapper } from "@/components/wrapper";
import { SelectComponent } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus } from "lucide-react";
import { TableList, Column } from "@/components/table-list";
import { useState } from "react";
import Link from "next/link";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdOutlineLoop } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { getToken } from "@/lib/helpers";
import Image from "next/image";
import { useClients } from "@/hooks/useClients";

export interface TableClient {
  id: number;
  clientName: string;
  companyName: string | null;
  clientReview: string;
  serviceId: number;
  clientPhoto: string | null;
  companyLogo: string | null;
  createdAt: string;
  service: {
    id: number;
    name: string;
  };
}

const clientColumns: Column<TableClient>[] = [
  { key: "id", label: "ID", className: "font-semibold w-[30]" },
  { 
    key: "clientName", 
    label: "Client Name", 
    className: "font-semibold min-w-[180px]" 
  },
  { 
    key: "companyName", 
    label: "Company Name", 
    className: "min-w-[190px]",
    render: (row) => row.companyName || "-"
  },
  { 
    key: "clientReview", 
    label: "Review", 
    className: "min-w-[200px] max-w-[300px] truncate",
    render: (row) => (
      <div className="truncate" title={row.clientReview}>
        {row.clientReview.length > 50 
          ? `${row.clientReview.substring(0, 50)}...` 
          : row.clientReview
        }
      </div>
    )
  },
  {
    key: "service",
    label: "Service",
    className: "min-w-[120px]",
    render: (row) => row.service?.name || "-"
  },
  {
    key: "clientPhoto",
    label: "Client Photo",
    className: "w-[120px]",
    render: (row) => (
      <div className="flex justify-center">
        {row.clientPhoto ? (
          <div className="w-10 h-10 rounded overflow-hidden">
            <Image
              src={row.clientPhoto}
              alt={`Photo of ${row.clientName}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            No Photo
          </div>
        )}
      </div>
    ),
  },
  {
    key: "companyLogo",
    label: "Company Logo",
    className: "w-[120px]",
    render: (row) => (
      <div className="flex justify-center">
        {row.companyLogo ? (
          <div className="w-7 h-7 rounded overflow-hidden">
            <Image
              src={row.companyLogo}
              alt={`Logo of ${row.companyName || 'company'}`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            No Logo
          </div>
        )}
      </div>
    ),
  },
];

export default function ClientsPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const {
    clients,
    isLoading,
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    limit,
    setLimit,
    total,
    totalPages,
    pageLength,
    serviceFilterArr,
    fetchClients,
  } = useClients();

  // Alert dialog state
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [selectedClient, setSelectedClient] = useState<TableClient | null>(null);

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleRefresh = () => {
    const token = getToken();
    if (token) {
      fetchClients(token, page, limit, searchQuery);
    }
  };

  const handleLimitChange = (value: string) => {
    setLimit(parseInt(value));
    setPage(1);
  };

  const handleEdit = (row: TableClient) => {
    router.push(`/business/clients/${row.id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;

    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/${selectedClient.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success(
          `Client "${selectedClient.clientName}" deleted successfully!`
        );

        // Refresh the clients list
        const token = getToken();
        if (token) {
          await fetchClients(token, page, limit, searchQuery);
        }
      } else {
        toast.error(data.message || "Failed to delete client");
      }
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(errMsg);
      console.error("Delete client error:", err);
    } finally {
      setShowAlertDelete(false);
      setSelectedClient(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  // Load clients on component mount
  useState(() => {
    const token = getToken();
    if (token) {
      fetchClients(token, page, limit, searchQuery);
    }
  });

  return (
    <>
      {/* Alert Dialog for Delete Confirmation */}
      {showAlertDelete && selectedClient && (
        <AlertDialogComponent
          open={showAlertDelete}
          onOpenChange={(open) => {
            setShowAlertDelete(open);
            if (!open) {
              setSelectedClient(null);
            }
          }}
          header="Hapus Client"
          desc={`Apakah Anda yakin ingin menghapus client "${selectedClient.clientName}"?`}
          continueAction={handleDeleteConfirm}
        />
      )}

      <Wrapper className="flex flex-col">
        {/* Header Action*/}
        <section className="flex items-center justify-between gap-0 w-full mb-4">
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2">
              <Input
                className="w-100"
                placeholder="Cari nama client atau perusahaan..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button onClick={handleSearchSubmit}>Cari</Button>
              {(searchInput || searchQuery) && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
            <div>
              <SelectComponent
                label="Filter By Service"
                placeholder="Filter By Service"
                value="All Services"
                onChange={() => {}}
                options={serviceFilterArr.map((s) => ({ label: s, value: s }))}
              />
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <MdOutlineLoop className={isLoading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </Button>
          </div>
          <div>
            <Link href="/business/clients/new">
              <Button>
                <Plus /> New Client
              </Button>
            </Link>
          </div>
        </section>

        {/* TableList */}
        <section className="flex-1 min-h-0">
          {isLoading ? (
            <TableSkeleton
              columns={clientColumns.length}
              rows={5}
              showActions={true}
            />
          ) : (
            <TableList
              columns={clientColumns}
              data={clients}
              onEdit={handleEdit}
              onDelete={(row) => {
                setSelectedClient(row);
                setShowAlertDelete(true);
              }}
            />
          )}
        </section>

        {/* Pagination */}
        <section className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            <SelectComponent
              label="Data Per Halaman"
              placeholder="Data Per Halaman"
              value={limit.toString()}
              onChange={handleLimitChange}
              options={pageLength.map((s) => ({ label: s, value: s }))}
            />
            <div className="text-sm text-gray-600">
              Menampilkan {clients.length} dari {total} data
              {searchQuery && ` untuk "${searchQuery}"`}
            </div>
          </div>
          <div className="text-white">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page - 1);
                    }}
                    className={
                      page <= 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={pageNum === page}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(page + 1);
                    }}
                    className={
                      page >= totalPages ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </Wrapper>
    </>
  );
}