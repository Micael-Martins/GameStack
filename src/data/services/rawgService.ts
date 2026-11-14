const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.EXPO_PUBLIC_RAWG_KEY ?? '';

type RawgListResponse = {
  results: { id: number; name: string; background_image: string | null }[];
};

export async function getPopularCovers(limit = 3): Promise<string[]> {
  const url = `${BASE_URL}/games?key=${API_KEY}&ordering=-added&page_size=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`RAWG respondeu ${response.status}`);
  }
  const data: RawgListResponse = await response.json();
  return data.results
    .map((game) => game.background_image)
    .filter((url): url is string => url !== null);
}