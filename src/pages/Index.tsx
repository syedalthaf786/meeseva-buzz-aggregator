
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import NewsGrid from "@/components/NewsGrid";
import { fetchNews } from "@/services/newsService";
import { NewsArticle, NewsCategory } from "@/types/news";

const Index = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params: Record<string, any> = { limit: 50 };
        
        if (searchQuery) {
          params.keywords = searchQuery;
        }
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        const response = await fetchNews(params);
        
        if (response.data.length === 0) {
          setArticles([]);
          toast({
            title: "No results found",
            description: "Try adjusting your search or category filter.",
            variant: "destructive",
          });
        } else {
          setArticles(response.data);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err instanceof Error ? err : new Error("Failed to load news"));
        toast({
          title: "Error loading news",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNews();
  }, [selectedCategory, searchQuery, toast]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (category: NewsCategory | null) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-meeseva-gray">
      <Header onSearch={handleSearch} />
      <CategoryNav 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategorySelect} 
      />
      
      <main className="container mx-auto px-4">
        <h2 className="text-xl font-semibold mt-6 text-meeseva-darkGray">
          {selectedCategory 
            ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} News` 
            : searchQuery 
              ? `Search results for "${searchQuery}"` 
              : "Top Headlines"}
        </h2>
        
        <NewsGrid 
          articles={articles} 
          isLoading={isLoading} 
          error={error} 
        />
      </main>
      
      <footer className="py-6 border-t border-gray-200 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>MeeSeva News &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Powered by MediaStack API</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
