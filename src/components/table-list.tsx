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
import clsx from "clsx";

// Definisi Status & Data Row
type Status = "draft" | "archive" | "publish";

export interface TableRowData {
  id: number;
  title: string;
  category: string;
  content: string;
  date: string;
  status: Status;
}

// Styles untuk status
const statusStyles: Record<Status, string> = {
  draft:
    "text-yellow-900 dark:text-white/80 border border-yellow-900 bg-yellow-400/20",
  archive:
    "text-blue-900 dark:text-white/80 border border-blue-900 bg-blue-400/20",
  publish:
    "text-green-900 dark:text-white/80 border border-green-900 bg-green-400/20",
};

// Definisi Column
export interface Column<T> {
  key: keyof T;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

// Props untuk TableList
interface TableListProps {
  columns: Column<TableRowData>[];
  data: TableRowData[];
  onEdit: (row: TableRowData) => void;
  onDelete: (row: TableRowData) => void;
}

export const TableList: React.FC<TableListProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="mb-2 rounded-third overflow-hidden h-full flex flex-col">
      {/* Header */}
      <Table className="table-fixed w-full">
        <TableHeader className="bg-mainColor/70 dark:bg-secondaryColor/70">
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key as string}>{col.label}</TableHead>
            ))}
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      {/* Body scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Table className="table-fixed w-full">
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={row.id + "-" + idx}
                className={clsx(
                  "w-1/4 text-center",
                  idx % 2 !== 0
                    ? "bg-lightColor/30 dark:bg-darkColor/50"
                    : "bg-lightColor/50 dark:bg-darkColor/30",
                  idx === data.length - 1 ? "!border-b-third" : ""
                )}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key as string}
                    className={col.className ?? ""}
                  >
                    {col.render
                      ? col.render(row)
                      : (row[col.key] as React.ReactNode)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Button
                    className="rounded-secondary dark:text-white"
                    onClick={() => onEdit(row)}
                  >
                    <TiEdit />
                  </Button>
                  <Button
                    className="ms-1 bg-red-800 dark:bg-red-900 text-white rounded-third"
                    onClick={() => onDelete(row)}
                  >
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
