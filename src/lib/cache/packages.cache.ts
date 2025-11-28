import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getPackagesCached = unstable_cache(
  async (params: {
    where: Prisma.PackageWhereInput;
    page: number;
    limit: number;
  }) => {
    const { where, page, limit } = params;

    const skip = (page - 1) * limit;

    const [packages, totalItems] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: limit,
        include: {
          service: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          features: {
            include: { feature: true },
            orderBy: { feature: { name: "asc" } },
          },
          requirements: {
            include: { requirement: true },
            orderBy: { requirement: { name: "asc" } },
          },
        },
        orderBy: [{ highlight: "desc" }, { createdAt: "desc" }],
      }),

      prisma.package.count({ where }),
    ]);

    return {
      packages,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  },

  ["packages-cache"], // base cache key
  {
    revalidate: 60, // 1 menit
    tags: ["packages"], // mudah di-invalidate
  }
);
