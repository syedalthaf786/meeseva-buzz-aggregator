
import { NewsResponse, NewsCategory } from "@/types/news";

// Using NewsAPI as an alternative
const API_KEY = "4a73f90613e24d5396cc5bbd4cbb03da"; // Public API key for News API
const BASE_URL = "https://newsapi.org/v2";

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
  
  // For NewsAPI, we use the "top-headlines" endpoint
  let url = `${BASE_URL}/top-headlines?apiKey=${API_KEY}&language=${languages}&country=${countries.split(',')[0]}&pageSize=${limit}&page=${Math.floor(offset / limit) + 1}`;
  
  if (keywords) {
    url += `&q=${encodeURIComponent(keywords)}`;
  }
  
  if (category && category !== 'general') {
    url += `&category=${category}`;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    const newsApiResponse = await response.json();
    
    // Transform the NewsAPI response format to match our app's expected format
    const transformedResponse: NewsResponse = {
      pagination: {
        limit: limit,
        offset: offset,
        count: newsApiResponse.articles.length,
        total: newsApiResponse.totalResults || newsApiResponse.articles.length,
      },
      data: newsApiResponse.articles.map((article: any) => ({
        title: article.title || "No title",
        description: article.description || "No description available",
        url: article.url,
        source: article.source?.name || "Unknown source",
        image: article.urlToImage,
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
