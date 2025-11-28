import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getCachedServices = unstable_cache(
  async () => {
    return prisma.service.findMany({
      include: {
        packages: {
          include: {
            features: {
              include: { feature: true },
            },
            requirements: {
              include: { requirement: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
  ["services-cache"],
  {
    revalidate: 300, // Cache 5 menit (bisa diubah sesuai kebutuhan)
    tags: ["services"], // Bisa revalidate manual jika ada update
  }
);
