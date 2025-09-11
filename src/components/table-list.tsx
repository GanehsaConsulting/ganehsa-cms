import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { TiEdit } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { GrStatusGoodSmall } from "react-icons/gr";
import clsx from "clsx";

export const TableList = () => {
  const statusArr = ["draft", "archive", "publish"];

  const statusStyles: Record<string, string> = {
    draft: "text-yellow-900 border border-yellow-900 bg-yellow-400/20",
    archive: "text-blue-900 border border-blue-900 bg-blue-400/20",
    publish: "text-green-900 border border-green-900 bg-green-400/20",
  };

  const dataTable = [
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[1],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[2],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[0],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[2],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[2],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[2],
    },
    {
      id: 1,
      title: "vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      category: "Pajak",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "09-09-2025",
      status: statusArr[2],
    },
  ];

  return (
    <div className="mb-2 rounded-third overflow-hidden h-full flex flex-col">
      {/* Header tetap */}
      <Table className="table-fixed w-full">
        <TableHeader className="bg-mainColor/70 dark:bg-darkColor">
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Upload</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      {/* Body scrollable, fleksibel */}
      <div className="flex-1 min-h-0 overflow-y-auto ">
        <Table className="table-fixed w-full">
          <TableBody>
            {dataTable.map((e: any, idx: number) => (
              <TableRow
                key={e.id + idx}
                className={`w-1/4 ${
                  idx % 2 !== 0
                    ? "bg-lightColor/30 dark:bg-darkColor/5"
                    : "bg-lightColor/50"
                } ${idx === dataTable.length - 1 ? "!border-b-third" : ""}`}
              >
                <TableCell className="font-medium whitespace-normal break-words clamp-1">
                  {e.title}
                </TableCell>
                <TableCell className="whitespace-normal break-words font-bold">
                  {e.category}
                </TableCell>
                <TableCell className="whitespace-normal break-words clamp-1">
                  {e.content}
                </TableCell>
                <TableCell className="whitespace-normal">
                  <div
                    className={`flex justify-center items-center rounded-full w-17 gap-2 px-3 font-semibold py-1 ${
                      statusStyles[e.status]
                    } `}
                  >
                    <span>{e.status}</span>
                  </div>
                </TableCell>
                <TableCell className="whitespace-normal italic font-semibold">
                  {e.date}
                </TableCell>
                <TableCell className="text-right">
                  <Button className="rounded-secondary">
                    <TiEdit />
                  </Button>
                  <Button className="ms-1 bg-red-800 text-white rounded-third">
                    <MdDelete />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
