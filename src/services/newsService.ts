
import { NewsResponse, NewsCategory } from "@/types/news";

// Using NewsData.io API which has better free access
const API_KEY = "pub_37429adea03e3a5ef7ff8d2b00c1e1e78f2ce"; // Public API key for NewsData.io
const BASE_URL = "https://newsdata.io/api/1";

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
  
  // For NewsData.io, we use the news endpoint
  let url = `${BASE_URL}/news?apikey=${API_KEY}&language=${languages}&country=${countries.split(',')[0]}&size=${limit}`;
  
  // Add page parameter for pagination
  const page = Math.floor(offset / limit) + 1;
  if (page > 1) {
    url += `&page=${page}`;
  }
  
  if (keywords) {
    url += `&q=${encodeURIComponent(keywords)}`;
  }
  
  if (category && category !== 'general') {
    // Map our categories to NewsData.io categories
    const categoryMap: Record<string, string> = {
      business: "business",
      entertainment: "entertainment",
      health: "health",
      science: "science",
      sports: "sports",
      technology: "technology",
      general: "top"
    };
    
    url += `&category=${categoryMap[category] || category}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const newsDataResponse = await response.json();
    
    // Transform the NewsData.io response format to match our app's expected format
    const transformedResponse: NewsResponse = {
      pagination: {
        limit: limit,
        offset: offset,
        count: newsDataResponse.results?.length || 0,
        total: newsDataResponse.totalResults || 10000, // NewsData.io doesn't always provide total
      },
      data: (newsDataResponse.results || []).map((article: any) => ({
        title: article.title || "No title",
        description: article.description || article.content || "No description available",
        url: article.link || article.url,
        source: article.source_id || article.source || "Unknown source",
        image: article.image_url || article.urlToImage || null,
        category: category || "general",
        language: languages,
        country: countries.split(',')[0],
        published_at: article.pubDate || article.published_at || new Date().toISOString(),
      })),
    };
    
    return transformedResponse;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}
