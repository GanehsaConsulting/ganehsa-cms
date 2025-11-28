import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const getCachedClients = unstable_cache(
  async (where: Prisma.TestimonialScalarWhereInput, skip: number, limit: number) => {
    const [clients, total] = await Promise.all([
      prisma.testimonial.findMany({
        where,
        include: { service: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.testimonial.count({ where }),
    ]);

    return { clients, total };
  },
  ["testimonials-cache"],
  {
    revalidate: 60, // cache 1 menit
    tags: ["testimonials"], // biar bisa revalidateTag("testimonials")
  }
);
