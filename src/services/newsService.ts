
import { NewsResponse, NewsCategory } from "@/types/news";

const API_KEY = "0505f0e2514efb53df8ca75d3295ae48";
const BASE_URL = "http://api.mediastack.com/v1";

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
  const { keywords, category, countries = "us,in", languages = "en", limit = 20, offset = 0 } = params;
  
  let url = `${BASE_URL}/news?access_key=${API_KEY}&languages=${languages}&countries=${countries}&limit=${limit}&offset=${offset}`;
  
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`;
  }
  
  if (category) {
    url += `&categories=${category}`;
  }
  
  try {
    // Due to CORS issues with the MediaStack free plan, proxying might be needed in production
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}
