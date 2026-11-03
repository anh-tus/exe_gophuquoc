export type CatalogSearchItem = {
  id: string;
  category: string;
  area: string;
  price: number;
  rating: number;
  reviewCount: number;
  search: string[];
};

export type CatalogFilters = {
  query?: string;
  category?: string;
  area?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'popular' | 'price-asc' | 'rating-desc';
};

export const normalizeSearch = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/gi, 'd')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

export function filterCatalogServices<T extends CatalogSearchItem>(items: T[], filters: CatalogFilters): T[] {
  const words = normalizeSearch(filters.query || '').split(' ').filter(Boolean);
  return items.filter((item) => {
    const haystack = normalizeSearch(item.search.join(' '));
    if (words.length && !words.every((word) => haystack.includes(word))) return false;
    if (filters.category && filters.category !== 'all' && item.category !== filters.category) return false;
    if (filters.area && filters.area !== 'all' && !normalizeSearch(item.area).includes(normalizeSearch(filters.area))) return false;
    if (filters.minPrice !== undefined && item.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && item.price >= filters.maxPrice) return false;
    if (filters.minRating !== undefined && item.rating < filters.minRating) return false;
    return true;
  }).sort((a, b) => {
    if (filters.sort === 'price-asc') return a.price - b.price || b.reviewCount - a.reviewCount;
    if (filters.sort === 'rating-desc') return b.rating - a.rating || b.reviewCount - a.reviewCount;
    return b.reviewCount - a.reviewCount || b.rating - a.rating;
  });
}
