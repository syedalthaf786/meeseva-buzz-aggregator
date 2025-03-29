
import { NewsResponse, NewsCategory } from "@/types/news";

// Using MediaStack API
const API_KEY = "a80b8e9a7baad037d5a4b8c438f658bf"; // Public API key for MediaStack
const BASE_URL = "https://api.mediastack.com/v1";

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
  
  // For MediaStack, we use the news endpoint
  let url = `${BASE_URL}/news?access_key=${API_KEY}&languages=${languages}&countries=${countries.split(',')[0]}&limit=${limit}`;
  
  // Add offset parameter for pagination
  if (offset > 0) {
    url += `&offset=${offset}`;
  }
  
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`;
  }
  
  if (category && category !== 'general') {
    // MediaStack uses 'general' as a category name, so we don't need to map it
    url += `&categories=${category}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const mediaStackResponse = await response.json();
    
    // Transform the MediaStack response format to match our app's expected format
    const transformedResponse: NewsResponse = {
      pagination: {
        limit: limit,
        offset: offset,
        count: mediaStackResponse.data?.length || 0,
        total: mediaStackResponse.pagination?.total || 10000, // Default high number if not provided
      },
      data: (mediaStackResponse.data || []).map((article: any) => ({
        title: article.title || "No title",
        description: article.description || "No description available",
        url: article.url,
        source: article.source || "Unknown source",
        image: article.image || null,
        category: article.category || category || "general",
        language: article.language || languages,
        country: article.country || countries.split(',')[0],
        published_at: article.published_at || new Date().toISOString(),
      })),
    };
    
    return transformedResponse;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}
