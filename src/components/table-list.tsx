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

// helper truncate
const truncate = (str: string, max: number) =>
  str.length > max ? str.slice(0, max) + "..." : str;

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

  // fungsi buat dapetin width dari className tailwind `w-[100px]`
  const getWidth = (className?: string) => {
    const match = className?.match(/w-\[(\d+)px\]/);
    return match ? `${match[1]}px` : undefined;
  };

  return (
    <div className="mb-2 rounded-secondary overflow-hidden h-full flex flex-col ">
      {/* wrapper scroll-x satu kesatuan */}
      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="inline-block min-w-full h-full">
          <div className="relative h-full flex flex-col">
            {/* Header tetap sticky */}
            <Table className="table-fixed  w-full bg-white/30 dark:bg-darkColor/30  rounded-third">
              <colgroup>
                {columns.map((col) => (
                  <col
                    key={col.key as string}
                    style={{ width: getWidth(col.className) }}
                  />
                ))}
                {showActions && <col style={{ width: "120px" }} />}
              </colgroup>

              <TableHeader className="sticky top-0 z-10 bg-lightColor/50 dark:bg-darkColor/40">
                <TableRow>
                  {columns.map((col) => (
                    <TableHead
                      key={col.key as string}
                      className={clsx(col.className)}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                  {showActions && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
            </Table>

            {/* Body scroll-y */}
            <div
              ref={bodyRef}
              className="flex-1 min-h-0 overflow-y-auto no-scrollbar"
            >
              <Table className="table-fixed w-full">
                <colgroup>
                  {columns.map((col) => (
                    <col
                      key={col.key as string}
                      style={{ width: getWidth(col.className) }}
                    />
                  ))}
                  {showActions && <col style={{ width: "120px" }} />}
                </colgroup>

                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (showActions ? 1 : 0)}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row, idx) => {
                      const isLastRow = idx === data.length - 1;
                      return (
                        <TableRow
                          key={row.id}
                          className={clsx(
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
                                  isLastRow && colIdx === 0 && !hasScroll
                                    ? "rounded-bl-secondary"
                                    : "",
                                  isLastRow &&
                                    isLastCol &&
                                    !showActions &&
                                    !hasScroll
                                    ? "rounded-br-secondary"
                                    : ""
                                )}
                              >
                                {col.key === "content" ||
                                col.key === "title" ||
                                col.key === "excerpt"
                                  ? typeof row[col.key] === "string"
                                    ? truncate(row[col.key] as string, 20)
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
                                isLastRow && !hasScroll
                                  ? "rounded-br-secondary"
                                  : ""
                              )}
                            >
                              {renderActions ? (
                                renderActions(row)
                              ) : (
                                <>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Edit row"
                                    className="bg-transparent text-muted-foreground rounded-secondary dark:text-white"
                                    onClick={() => onEdit?.(row)}
                                  >
                                    <RiEdit2Fill className="!w-5 !h-5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    aria-label="Delete row"
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
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
