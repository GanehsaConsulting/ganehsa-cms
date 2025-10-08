// article page - updated with data passing
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
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ActionsDialog } from "@/components/actions-dialog";
import Link from "next/link";
import { TableSkeleton } from "@/components/skeletons/table-list";
import { MdOutlineLoop } from "react-icons/md";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TableActivity {
  id: number;
  title: string;
  desc: string;
  longDesc: string;
  date: string;
  showTitle: boolean;
  instaUrl: string;
  imageUrl: string[];
}

// Definisikan columns untuk artikel
const activityColumns: Column<TableActivity>[] = [
  { key: "id", label: "ID", className: "font-semibold w-[30]" },
  { key: "title", label: "Title", className: "font-semibold min-w-[200px]" },
  { key: "desc", label: "description", className: "min-w-[180px]" },
  { key: "longDesc", label: "long description", className: "min-w-[180px]" },
  {
    key: "date",
    label: "Tanggal Upload",
    className: "w-[150px]",
  },
  {
    key: "showTitle",
    label: "Show Title",
    className: "w-[130px]",
    render: (row) => (
      <div className="flex items-center gap-2 bg-lightColor/20 px-2 py-1 rounded-md w-fit">
        <span
          className={clsx(
            "h-2 w-2 rounded-full",
            row.showTitle ? "bg-green-600 text-green-600" : "bg-red-700"
          )}
        />
        <span className="font-medium ">
          {row.showTitle ? "active" : "inactive"}
        </span>
      </div>
    ),
  },
  {
    key: "instaUrl",
    label: "instagram url",
    className: "w-[180px] ",
  },
  {
    key: "imageUrl",
    label: "image url",
    className: "w-[190px]",
  },
];

// Data contoh - updated dengan id yang berbeda
const activityData: TableActivity[] = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet, consakjd dfhkash webiashd iwosnaos",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    longDesc:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    date: "19-06-04",
    showTitle: true,
    instaUrl:
      "https://images.pexels.com/photos/4625868/pexels-photo-4625868.jpeg",
    imageUrl: [
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
    ],
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet, consakjd dfhkash webiashd iwosnaos",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    longDesc:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    date: "19-06-04",
    showTitle: false,
    instaUrl:
      "https://images.pexels.com/photos/4625868/pexels-photo-4625868.jpeg",
    imageUrl: [
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
    ],
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet, consakjd dfhkash webiashd iwosnaos",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    longDesc:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
    date: "19-06-04",
    showTitle: true,
    instaUrl:
      "https://images.pexels.com/photos/4625868/pexels-photo-4625868.jpeg",
    imageUrl: [
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
      "https://images.pexels.com/photos/33857618/pexels-photo-33857618.jpeg",
    ],
  },
];

export default function ActivityPage() {
  const statusArr = ["All", "Showing Title", "Not Showing Title"];
  const pageLength = ["10", "20", "100"];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activities, setActivities] = useState<TableActivity[]>([])
  const token = localStorage.getItem("token")

  async function fetchActivities() {
    try { 
      const res = await fetch("", {})
      const data = res.json()

    } catch(err){
      const errMsg = err instanceof Error ? err.message : "unknown error"
      toast.error(errMsg)
    }
  }

  useEffect(() =>{
    fetchActivities()
  }, [])

  function handleEdit(row: TableActivity){
    
  }

  return (
    <Wrapper className="flex flex-col">
      {/* Header Action*/}
      <section className="flex items-center justify-between gap-0 w-full mb-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-2">
            <Input className="w-100" placeholder="Cari judul..." />
            <Button>Cari</Button>
          </div>
          <div>
            <SelectComponent
              label="Filter By"
              placeholder="Filter By"
              options={statusArr.map((s) => ({ label: s, value: s }))}
            />
          </div>
          <Button onClick={() => { window.location.reload() } }>
            <MdOutlineLoop />
            <span>Refresh</span>
          </Button>
        </div>
        <div>
          <Link href="/activity/new">
            <Button>
              <Plus /> Activity Baru
            </Button>
          </Link>
        </div>
      </section>

      {/* TableList */}
      <section className="flex-1 min-h-0">
        {isLoading ? (
          <TableSkeleton columns={4} rows={4} showActions={true} />
        ) : (
          <TableList
            columns={activityColumns}
            data={activityData}
            onEdit={handleEdit} // ⬅️ Updated: menggunakan handleEdit function
            onDelete={(row) => console.log("Delete:", row)}
          />
        )}
      </section>

      {/* Pagination */}
      <section className="flex items-center justify-between">
        <SelectComponent
          label="Data Per Halaman"
          placeholder="Data Per Halaman"
          options={pageLength.map((s) => ({ label: s, value: s }))}
        />
        <div className="text-white">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>
    </Wrapper>
  );
}
