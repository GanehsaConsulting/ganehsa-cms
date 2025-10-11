import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { getToken } from "@/lib/helpers";
import { TableArticle } from "@/app/article/page";

// Tambahkan interface untuk data API
interface ArticleFromAPI {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  status: string;
  highlight: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  author: {
    id: number;
    name: string;
    email: string;
  };
  thumbnail?: {
    id: number;
    url: string;
    title: string;
    alt: string;
  };
}

export const useArticles = () => {
  const [articles, setArticles] = useState<TableArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const mapStatus = useCallback((status: string): "draft" | "archive" | "publish" => {
    switch (status) {
      case "DRAFT":
        return "draft";
      case "ARCHIVE":
        return "archive";
      case "PUBLISH":
        return "publish";
      default:
        return "draft";
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    const token = getToken();
    if (!token) {
      toast.error("Token tidak ditemukan");
      return;
    }

    setIsLoading(true);
    try {
      const url = searchTerm
        ? `${process.env.NEXT_PUBLIC_API_URL}/article?search=${encodeURIComponent(searchTerm)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/article`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success && data.data) {
        const transformed: TableArticle[] = data.data.map((article: ArticleFromAPI) => ({
          id: article.id,
          originalId: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "-",
          category: article.category?.name || "-", // ⬅️ TAMBAHKAN INI
          content: article.content,
          date: new Date(article.createdAt).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status: mapStatus(article.status),
          highlight: article.highlight,
        }));
        setArticles(transformed);
      } else {
        toast.error(data.message || "Gagal mengambil data artikel");
        setArticles([]);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      toast.error("Gagal mengambil data artikel");
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, mapStatus]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    searchTerm,
    setSearchTerm,
    fetchArticles,
  };
};