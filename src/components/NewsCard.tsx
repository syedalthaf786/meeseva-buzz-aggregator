
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "date-fns";

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard = ({ article }: NewsCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(article.published_at), { addSuffix: true });
  
  const placeholderImage = "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image";
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={article.image || placeholderImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
      </div>
      <CardHeader className="pt-3 pb-0 px-4">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:underline"
        >
          <h3 className="font-semibold text-meeseva-darkGray line-clamp-2">{article.title}</h3>
        </a>
      </CardHeader>
      <CardContent className="px-4 py-2 flex-grow">
        <p className="text-sm text-gray-600 line-clamp-3">{article.description}</p>
      </CardContent>
      <CardFooter className="pt-0 px-4 pb-3 text-xs text-gray-500 flex justify-between items-center">
        <span className="font-medium">{article.source}</span>
        <span>{formattedDate}</span>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
