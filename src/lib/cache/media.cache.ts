import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCachedMedias = unstable_cache(
  async (where: Prisma.MediaWhereInput, skip: number, limit: number) => {
    const [medias, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    return { medias, total };
  },
  ["medias-cache"],
  {
    revalidate: 60,
    tags: ["medias"],
  }
);
