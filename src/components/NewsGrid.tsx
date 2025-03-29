
import { NewsArticle } from "@/types/news";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsGridProps {
  articles: NewsArticle[];
  isLoading: boolean;
  error: Error | null;
}

const NewsGrid = ({ articles, isLoading, error }: NewsGridProps) => {
  if (error) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-xl font-semibold text-red-600">Error loading news</h3>
        <p className="mt-2 text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
      {isLoading
        ? Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full">
              <Skeleton className="aspect-video w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))
        : articles.map((article, index) => (
            <NewsCard key={`${article.title}-${index}`} article={article} />
          ))}
    </div>
  );
};

export default NewsGrid;
