import type { PhotoCategory } from '../config';

export type PhotoColor = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Cyan' | 'Blue' | 'Violet' | 'Neutral';

export const imageMetadata = [
  { name: 'portrait_placeholder.svg', colorFamily: 'Violet', colorRank: 10, ratio: 0.8 },
  { name: 'still_life_placeholder.svg', colorFamily: 'Neutral', colorRank: 10, ratio: 1.0 },
  { name: 'street_placeholder.svg', colorFamily: 'Cyan', colorRank: 10, ratio: 1.5 },
  { name: 'nature_placeholder.svg', colorFamily: 'Green', colorRank: 10, ratio: 0.75 },
  { name: 'travel_placeholder.svg', colorFamily: 'Orange', colorRank: 10, ratio: 1.7777777777777777 },
] as const;

export type PhotoCatalogEntry = {
  title: string;
  category: PhotoCategory;
};

export const photoCatalog: Record<string, PhotoCatalogEntry> = {
  'nature_placeholder.svg': { title: 'Lone Tree Plain', category: 'Nature' },
  'portrait_placeholder.svg': { title: 'Morning Reflection', category: 'Portrait' },
  'still_life_placeholder.svg': { title: 'Hanging Cups', category: 'Still Life' },
  'street_placeholder.svg': { title: 'Passing Rider', category: 'Street' },
  'travel_placeholder.svg': { title: 'Bridge Into Weather', category: 'Travel' },
};
