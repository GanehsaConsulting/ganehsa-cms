import React from 'react';

export const TableSkeleton = ({ columns = 4, rows = 5, showActions = true }) => {
  return (
    <div className="mb-2 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="flex-1 min-h-0 overflow-x-auto">
        <div className="inline-block min-w-full h-full">
          <div className="relative h-full flex flex-col">
            {/* Header Skeleton */}
            <div className="sticky top-0 z-10 bg-gray-100/30 dark:bg-darkColor/50 ">
              <div className="flex border-b border-gray-200/20 dark:border-darkColor/30 py-2">
                {Array.from({ length: columns }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex-1 px-4 py-3"
                  >
                    <div className="h-4 bg-gray-300/40 dark:bg-darkColor/70 rounded animate-pulse" />
                  </div>
                ))}
                {showActions && (
                  <div className="w-[120px] px-4 py-3">
                    <div className="h-4 bg-gray-300/40 dark:bg-darkColor/70 rounded animate-pulse" />
                  </div>
                )}
              </div>
            </div>

            {/* Body Skeleton */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`flex border-b border-gray-200/20 dark:border-darkColor/30 ${
                    rowIdx % 2 !== 0
                      ? 'bg-gray-50/20 dark:bg-darkColor/50  '
                      : 'bg-white/10 dark:bg-darkColor/30 '
                  }`}
                >
                  {Array.from({ length: columns }).map((_, colIdx) => (
                    <div
                      key={colIdx}
                      className="flex-1 px-4 py-4"
                    >
                      <div
                        className="h-4 bg-gray-300/40 dark:bg-darkColor/70 rounded animate-pulse"
                        style={{
                          width: `${Math.random() * 40 + 60}%`
                        }}
                      />
                    </div>
                  ))}
                  {showActions && (
                    <div className="w-[120px] px-4 py-4 flex gap-2">
                      <div className="w-8 h-8 bg-gray-300/40 dark:bg-darkColor/70 rounded animate-pulse" />
                      <div className="w-8 h-8 bg-gray-300/40 dark:bg-darkColor/70 rounded animate-pulse" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
