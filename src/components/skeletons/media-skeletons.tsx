import { Skeleton } from "@/components/ui/skeleton";

interface MediaSkeletonProps {
  variant?: "grid" | "list";
}

/**
 * Skeleton loader untuk halaman Media Library.
 * Bisa digunakan untuk tampilan grid atau list.
 */
export function MediaSkeleton({ variant = "grid" }: MediaSkeletonProps) {
  if (variant === "grid") {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border border-lightColor/10 dark:border-darkColor/10 rounded-third overflow-hidden"
          >
            <Skeleton className="aspect-square w-full h-auto bg-neutral-800" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-2/3 bg-neutral-800" />
              <Skeleton className="h-3 w-1/3 bg-neutral-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Variant list
  return (
    <table className="w-full table-auto border-collapse">
      <thead>
        <tr className="border-b border-lightColor/10 dark:border-darkColor/10">
          <th className="text-left text-sm font-medium text-white p-2">Preview</th>
          <th className="text-left text-sm font-medium text-white p-2">Title</th>
          <th className="text-left text-sm font-medium text-white p-2">Type</th>
          <th className="text-left text-sm font-medium text-white p-2">Size</th>
          <th className="text-left text-sm font-medium text-white p-2">Uploaded At</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 6 }).map((_, i) => (
          <tr key={i} className="border-b border-lightColor/10 dark:border-darkColor/10">
            <td className="p-2">
              <Skeleton className="w-16 h-16 rounded-md bg-neutral-800" />
            </td>
            <td className="p-2">
              <Skeleton className="h-4 w-2/3 bg-neutral-800" />
            </td>
            <td className="p-2">
              <Skeleton className="h-4 w-1/4 bg-neutral-800" />
            </td>
            <td className="p-2">
              <Skeleton className="h-4 w-1/4 bg-neutral-800" />
            </td>
            <td className="p-2">
              <Skeleton className="h-4 w-1/3 bg-neutral-800" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
