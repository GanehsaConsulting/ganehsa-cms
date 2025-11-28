import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getActivitiesCached = unstable_cache(
  async (params: { where: Prisma.ActivityWhereInput; skip: number; limit: number }) => {
    const { where, skip, limit } = params;

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          medias: {
            include: {
              media: true,
            },
          },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return { activities, total };
  },
  ["activities-cache"], // global cache key base
  {
    revalidate: 60,
    tags: ["activities"],
  }
);
