import { NewsResponse, NewsCategory } from "@/types/news";

const API_KEY = "5c4ed7f63bb95094a8aabc5f4ac00d51"; // GNews API key
const BASE_URL = "https://gnews.io/api/v4/top-headlines";

export async function fetchNews(
  params: {
    keywords?: string;
    category?: NewsCategory;
    country?: string;
    lang?: string;
    limit?: number;
  } = {}
): Promise<NewsResponse> {
  const { keywords, category = "general", country = "us", lang = "en", limit = 20 } = params;

  let url = `${BASE_URL}?category=${category}&apikey=${API_KEY}&country=${country}&lang=${lang}&max=${limit}`;

  if (keywords) {
    url += `&q=${encodeURIComponent(keywords)}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`News API Error: ${response.status}`);
    }

    const gNewsResponse = await response.json();

    // Transform GNews response to match the expected format
    const transformedResponse: NewsResponse = {
      pagination: {
        limit: limit,
        offset: 0, // GNews does not support offset directly
        count: gNewsResponse.articles.length || 0,
        total: 10000, // GNews does not provide total count
      },
      data: (gNewsResponse.articles || []).map((article: any) => ({
        title: article.title || "No title",
        description: article.description || "No description available",
        url: article.url,
        source: article.source.name || "Unknown source",
        image: article.image || null,
        category: category,
        language: lang,
        country: country,
        published_at: article.publishedAt || new Date().toISOString(),
      })),
    };

    return transformedResponse;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    throw error;
  }
}
