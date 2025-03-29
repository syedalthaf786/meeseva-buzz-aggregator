
import { NewsResponse, NewsCategory } from "@/types/news";

// Using Gnews API which has better CORS support
const API_KEY = "a80b8e9a7baad037d5a4b8c438f658bf"; // Public API key for Gnews
const BASE_URL = "https://gnews.io/api/v4";

export async function fetchNews(
  params: {
    keywords?: string;
    category?: NewsCategory;
    countries?: string;
    languages?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<NewsResponse> {
  const { keywords, category, countries = "us", languages = "en", limit = 20, offset = 0 } = params;
  
  // For Gnews, we use the top-headlines endpoint
  let url = `${BASE_URL}/top-headlines?apikey=${API_KEY}&lang=${languages}&country=${countries.split(',')[0]}&max=${limit}`;
  
  if (keywords) {
    url += `&q=${encodeURIComponent(keywords)}`;
  }
  
  if (category && category !== 'general') {
    // Map our categories to Gnews categories if needed
    const categoryMap: Record<string, string> = {
      business: "business",
      entertainment: "entertainment",
      health: "health",
      science: "science",
      sports: "sports",
      technology: "technology",
      general: "general"
    };
    
    url += `&topic=${categoryMap[category] || category}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const gnewsResponse = await response.json();
    
    // Transform the Gnews response format to match our app's expected format
    const transformedResponse: NewsResponse = {
      pagination: {
        limit: limit,
        offset: offset,
        count: gnewsResponse.articles?.length || 0,
        total: gnewsResponse.totalArticles || gnewsResponse.articles?.length || 0,
      },
      data: (gnewsResponse.articles || []).map((article: any) => ({
        title: article.title || "No title",
        description: article.description || "No description available",
        url: article.url,
        source: article.source?.name || "Unknown source",
        image: article.image,
        category: category || "general",
        language: languages,
        country: countries.split(',')[0],
        published_at: article.publishedAt,
      })),
    };
    
    return transformedResponse;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}
