import assert from 'node:assert/strict';
import test from 'node:test';
import { filterCatalogServices } from './catalog-filter.ts';

const items = [
  { id: 'cano', category: 'tour', area: 'An Thới', price: 450000, rating: 4.9, reviewCount: 30, search: ['Tour cano 4 đảo', 'four-island boat tour'] },
  { id: 'food', category: 'restaurant', area: 'Bãi Trường', price: 220000, rating: 4.6, reviewCount: 20, search: ['Hải sản Bãi Trường', 'Bai Truong seafood'] },
  { id: 'stay', category: 'stay', area: 'Dương Đông', price: 850000, rating: 4.8, reviewCount: 10, search: ['Khách sạn view biển', 'Seaside hotel'] },
];

test('search matches Vietnamese without accents and English keywords', () => {
  assert.deepEqual(filterCatalogServices(items, { query: 'hai san bai truong' }).map(x => x.id), ['food']);
  assert.deepEqual(filterCatalogServices(items, { query: 'four island' }).map(x => x.id), ['cano']);
});

test('category, area, price and rating combine', () => {
  assert.deepEqual(filterCatalogServices(items, { category: 'tour', area: 'An Thoi', maxPrice: 500000, minRating: 4.8 }).map(x => x.id), ['cano']);
  assert.deepEqual(filterCatalogServices(items, { category: 'tour', maxPrice: 200000 }).map(x => x.id), []);
  assert.deepEqual(filterCatalogServices(items, { minPrice: 500000, maxPrice: 1000000 }).map(x => x.id), ['stay']);
});

test('sort uses numeric price and rating', () => {
  assert.deepEqual(filterCatalogServices(items, { sort: 'price-asc' }).map(x => x.id), ['food', 'cano', 'stay']);
  assert.deepEqual(filterCatalogServices(items, { sort: 'rating-desc' }).map(x => x.id), ['cano', 'stay', 'food']);
});
