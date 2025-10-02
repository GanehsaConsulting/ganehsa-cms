// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Wrapper } from "@/components/wrapper";
// import { SelectComponent } from "@/components/ui/select";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Plus } from "lucide-react";
// import { TableList, Column } from "@/components/table-list";
// import clsx from "clsx";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";

// // Tipe data untuk artikel
// interface Article {
//   id: number;
//   title: string;
//   slug: string;
//   excerpt?: string;
//   category: string;
//   content: string;
//   date: string;
//   status: "draft" | "archive" | "publish";
//   highlight?: boolean;
// }

// // Styles untuk status
// const statusStyles = {
//   draft: "text-yellow-700 dark:text-white/80 bg-yellow-200/20",
//   archive: "text-blue-700 dark:text-white/80 bg-blue-200/20",
//   publish: "text-green-700 dark:text-white/80 bg-green-200/20",
// };

// // Kolom table
// const articleColumns: Column<Article>[] = [
//   { key: "id", label: "No", className: "font-semibold w-[40px]" },
//   { key: "title", label: "Title", className: "font-semibold min-w-[200px]" },
//   { key: "slug", label: "Slug", className: "min-w-[190px] ", 
//     render: (row) => (
//       <div className="bg-white/20 w-fit px-2 py-1 rounded-md font-semibold italic" >
//         /{row.slug}
//       </div>
//     )
//    },
//   { key: "category", label: "Category", className: "min-w-[120px]" },
//   { key: "excerpt", label: "Excerpt", className: "min-w-[200px]" },
//   {
//     key: "status",
//     label: "Status",
//     className: "min-w-[120px]",
//     render: (row) => (
//       <div
//         className={clsx(
//           "inline-flex items-center rounded-full gap-2 px-3 font-semibold py-1",
//           statusStyles[row.status]
//         )}
//       >
//         <span>{row.status}</span>
//       </div>
//     ),
//   },
//   {
//     key: "highlight",
//     label: "Highlight",
//     className: "min-w-[120px]",
//     render: (row) => (
//       <div className="flex items-center gap-2 bg-lightColor/20 px-2 py-1 rounded-md w-fit">
//         <span
//           className={clsx(
//             "h-2 w-2 rounded-full",
//             row.highlight ? "bg-green-600" : "bg-red-700"
//           )}
//         />
//         <span className="font-medium">
//           {row.highlight ? "Active" : "Inactive"}
//         </span>
//       </div>
//     ),
//   },
//   { key: "date", label: "Tanggal Upload", className: "min-w-[140px]" },
// ];

// // Data contoh
// const articleData: Article[] = [
//   {
//     id: 1,
//     title: "Panduan Lengkap Pajak Penghasilan untuk UKM",
//     slug: "panduan-pajak-ukm",
//     excerpt: "Artikel ini membahas pajak penghasilan UKM secara lengkap...",
//     category: "Pajak",
//     content: "Full content pajak...",
//     date: "09-09-2025",
//     status: "draft",
//     highlight: true,
//   },
//   {
//     id: 2,
//     title: "Cara Optimasi Website untuk SEO",
//     slug: "optimasi-website-seo",
//     excerpt: "Tips mengoptimalkan website agar ditemukan di mesin pencari...",
//     category: "Website",
//     content: "Full content SEO...",
//     date: "08-09-2025",
//     status: "archive",
//   },
//   {
//     id: 3,
//     title: "Langkah-langkah Pendirian PT di Indonesia",
//     slug: "pendirian-pt",
//     excerpt: "Panduan step by step untuk mendirikan Perseroan Terbatas...",
//     category: "Pendirian PT",
//     content: "Full content PT...",
//     date: "07-09-2025",
//     status: "publish",
//   },
// ];

// export default function ArticlePage() {
//   const statusArr = ["All", "Draft", "Archive", "Publish"];
//   const pageLength = ["10", "20", "100"];
//   const router = useRouter();
//   const token = localStorage.getItem("token")
//   const [dataArticles, setDataArticles] = useState<Article[]>([])

//   useEffect(() => {
//     if (!token) return;

//     async function fetchDataArticles() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/article`,
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         const data = await res.json();
//         if (data) {
//           setDataArticles(data.data);
//         }
//       } catch (err) {
//         const errMessage = err instanceof Error ? err.message : "unknown errors"
//         console.log(errMessage);
//         toast.error(errMessage)
        
//       }
//     }
//     fetchDataArticles();
//   }, []);

//   // Handle edit
//   const handleEdit = (row: Article) => {
//     localStorage.setItem(
//       "editArticleData",
//       JSON.stringify({
//         id: row.id,
//         judul: row.title,
//         kategori: row.category,
//         konten: row.content,
//         status: row.status,
//         date: row.date,
//         slug: row.slug,
//         excerpt: row.excerpt,
//         highlight: row.highlight,
//       })
//     );
//     router.push(`/article/${row.id}/edit`);
//   };

//   return (
//     <Wrapper className="flex flex-col">
//       {/* Header Action */}
//       <section className="flex items-center justify-between gap-0 w-full mb-4">
//         <div className="flex items-center gap-4 w-full">
//           <div className="flex items-center gap-2">
//             <Input className="w-100" placeholder="Cari judul..." />
//             <Button>Cari</Button>
//           </div>
//           <div>
//             <SelectComponent
//               label="Filter By status"
//               placeholder="Filter By status"
//               options={statusArr.map((s) => ({ label: s, value: s }))}
//             />
//           </div>
//         </div>
//         <div>
//           <Link href="/article/new">
//             <Button>
//               <Plus /> Artikel Baru
//             </Button>
//           </Link>
//         </div>
//       </section>

//       {/* TableList with scroll */}
//       <section className="flex-1 min-h-0 ">
//         <TableList
//           columns={articleColumns}
//           data={dataArticles}
//           onEdit={handleEdit}
//           onDelete={(row) => console.log("Delete:", row)}
//         />
//       </section>

//       {/* Pagination */}
//       <section className="flex items-center justify-between mt-4">
//         <SelectComponent
//           label="Data Per Halaman"
//           placeholder="Data Per Halaman"
//           options={pageLength.map((s) => ({ label: s, value: s }))}
//         />
//         <div className="text-white">
//           <Pagination>
//             <PaginationContent>
//               <PaginationItem>
//                 <PaginationPrevious href="#" />
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href="#">1</PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href="#" isActive>
//                   2
//                 </PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationLink href="#">3</PaginationLink>
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationEllipsis />
//               </PaginationItem>
//               <PaginationItem>
//                 <PaginationNext href="#" />
//               </PaginationItem>
//             </PaginationContent>
//           </Pagination>
//         </div>
//       </section>
//     </Wrapper>
//   );
// }
