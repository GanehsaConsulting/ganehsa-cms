import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCachedProjects = unstable_cache(
  async (
    whereClause: Prisma.ProjectWhereInput,
    skip: number,
    limit: number
  ) => {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          packages: {
            include: {
              package: {
                include: {
                  service: true,
                },
              },
            },
          },
        },
      }),
      prisma.project.count({ where: whereClause }),
    ]);

    return { projects, total };
  },
  ["projects-cache"],
  {
    revalidate: 60,
    tags: ["projects"],
  }
);
