import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { Prisma, Status } from "@prisma/client";

export const getArticlesCached = unstable_cache(
  async (params: {
    where: Prisma.ArticleWhereInput;
    skip: number;
    limit: number;
    sort: "asc" | "desc";
  }) => {
    const { where, skip, limit, sort } = params;

    const [articles, totalItems] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, email: true } },
          category: { select: { id: true, name: true, slug: true } },
          thumbnail: {
            select: { id: true, url: true, title: true, alt: true },
          },
        },
        orderBy: { createdAt: sort },
        skip,
        take: limit,
      }),

      prisma.article.count({ where }),
    ]);

    return {
      articles,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    };
  },

  ["articles-cache"], // base key
  {
    revalidate: 60, // cache 1 menit
    tags: ["articles"], // bisa invalidate dengan revalidateTag("articles")
  }
);
