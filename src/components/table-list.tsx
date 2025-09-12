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
import { icons } from "lucide-react";

// Definisi Status
export type Status = "draft" | "archive" | "publish";

// Definisi Column yang reusable
export interface Column<T> {
  key: keyof T;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

// Props untuk TableList
interface TableListProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  rowClassName?: string;
  showActions?: boolean;
}

export const TableList = <T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  rowClassName = "",
  showActions = true,
}: TableListProps<T>) => {
  return (
    <div className="mb-2 rounded-third overflow-hidden h-full flex flex-col">
      {/* Header */}
      <Table className="table-fixed w-full">
        <TableHeader className="bg-mainColor/70 dark:bg-secondaryColor/70">
          <TableRow>
            {columns.map((col) => (
              <TableHead className={col.className} key={col.key as string}>
                {col.label}
              </TableHead>
            ))}
            {showActions && <TableHead>Actions</TableHead>}
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
                  "w-1/4",
                  idx % 2 !== 0
                    ? "bg-lightColor/30 dark:bg-darkColor/50"
                    : "bg-lightColor/50 dark:bg-darkColor/30",
                  idx === data.length - 1 ? "!border-b-third" : "",
                  rowClassName
                )}
              >
                {columns.map((col) =>
                  col.key == "content" || col.key == "title" ? (
                    <TableCell
                      key={col.key as string}
                      className={col.className ?? ""}
                    >
                      {typeof row[col.key] === "string"
                        ? (row[col.key] as string).slice(0, 25) + "..."
                        : (row[col.key] as React.ReactNode)}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={col.key as string}
                      className={col.className ?? ""}
                    >
                      {col.render
                        ? col.render(row)
                        : (row[col.key] as React.ReactNode)}
                    </TableCell>
                  )
                )}
                {showActions && (
                  <TableCell>
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
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
