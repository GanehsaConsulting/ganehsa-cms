// table list
import React, { useRef, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { MdDelete } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import clsx from "clsx";

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
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  rowClassName?: string;
  showActions?: boolean;
  renderActions?: (row: T) => React.ReactNode; // 👈 opsional
}

export const TableList = <T extends { id: number | string }>({
  columns,
  data,
  onEdit,
  onDelete,
  rowClassName = "",
  showActions = true,
  renderActions,
}: TableListProps<T>) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [hasScroll, setHasScroll] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const checkScroll = () => {
      setHasScroll(el.scrollHeight > el.clientHeight);
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [data]);

  return (
    <div className="mb-2 rounded-secondary overflow-hidden h-full flex flex-col">
      {/* Header */}
      <Table className="table-fixed w-full">
        <TableHeader className="bg-lightColor/50 dark:bg-darkColor/40 text-blackColor">
          <div className="p-2">
            <div className="bg-white/30 dark:bg-darkColor/30 rounded-third">
              <TableRow>
                {columns.map((col) => (
                  <TableHead className={col.className} key={col.key as string}>
                    {col.label}
                  </TableHead>
                ))}
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </div>
          </div>
        </TableHeader>
      </Table>

      {/* Body scrollable */}
      <div
        ref={bodyRef}
        className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
      >
        <Table className="table-fixed w-full">
          <TableBody>
            {data.map((row, idx) => {
              const isLastRow = idx === data.length - 1;
              return (
                <TableRow
                  key={row.id + "-" + idx}
                  className={clsx(
                    "w-1/4",
                    idx % 2 !== 0
                      ? "bg-lightColor/50 dark:bg-darkColor/40"
                      : "bg-lightColor/45 dark:bg-darkColor/30",
                    rowClassName
                  )}
                >
                  {columns.map((col, colIdx) => {
                    const isLastCol = colIdx === columns.length - 1;

                    return (
                      <TableCell
                        key={col.key as string}
                        className={clsx(
                          col.className ?? "",
                          isLastRow && isLastCol && !hasScroll ? "" : "",
                          isLastRow && colIdx === 0 && !hasScroll
                            ? "rounded-bl-secondary"
                            : ""
                        )}
                      >
                        {/* Slice khusus untuk content & title */}
                        {col.key === "content" || col.key === "title"
                          ? typeof row[col.key] === "string"
                            ? (row[col.key] as string).slice(0, 25) + "..."
                            : (row[col.key] as React.ReactNode)
                          : col.render
                          ? col.render(row)
                          : (row[col.key] as React.ReactNode)}
                      </TableCell>
                    );
                  })}

                  {showActions && (
                    <TableCell
                      className={clsx(
                        isLastRow && !hasScroll ? "rounded-br-secondary" : ""
                      )}
                    >
                      {renderActions ? (
                        renderActions(row) // 👈 pakai custom kalau ada
                      ) : (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="bg-transparent text-muted-foreground rounded-secondary dark:text-white"
                            onClick={() => onEdit?.(row)}
                          >
                            <RiEdit2Fill className="!w-5 !h-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="bg-transparent ms-1 text-red-800 dark:text-red-300 rounded-third"
                            onClick={() => onDelete?.(row)}
                          >
                            <MdDelete className="!w-5 !h-5" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
