import { imageMetadata, photoCatalog } from '../data/photoManifest';
import type { PhotoCategory, PhotoColor } from '../data/photoManifest';

export type Category = 'All' | PhotoCategory;

export type PortfolioPhoto = (typeof imageMetadata)[number] & {
  title: string;
  category: PhotoCategory;
};

const categoryOrder: PhotoCategory[] = ['Street', 'Nature', 'Travel', 'Portrait', 'Still Life'];
export const colorOrder: PhotoColor[] = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet', 'Neutral'];

const colorSortValue = ({ colorFamily, colorRank }: Pick<(typeof imageMetadata)[number], 'colorFamily' | 'colorRank'>) =>
  colorOrder.indexOf(colorFamily) * 100 + colorRank;

export const titleFromName = (name: string) =>
  name
    .replace(/\.[^.]+$/, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+-\s+Copy/i, '')
    .trim();

const fallbackCategory = (name: string): PhotoCategory => {
  const normalizedName = name.toLowerCase();

  if (/(bird|dog|cat|flower|rain|sky|morning|tree|cloud|leaf)/.test(normalizedName)) {
    return 'Nature';
  }

  if (/(bus|bike|road|street|tong|station|crossing)/.test(normalizedName)) {
    return 'Street';
  }

  return 'Travel';
};

export const optimizedPhoto = (name: string, width: 900 | 1800) => {
  const stem = name.replace(/\.[^.]+$/, '');
  return `/optimized/${encodeURIComponent(`${stem}-${width}.webp`)}`;
};

export const photoAlt = (title: string) => `${title} by Munasib Apurbo`;

export const portfolio: PortfolioPhoto[] = imageMetadata
  .map((image) => {
    const catalogEntry = photoCatalog[image.name];

    return {
      ...image,
      title: catalogEntry?.title ?? titleFromName(image.name),
      category: catalogEntry?.category ?? fallbackCategory(image.name),
    };
  })
  .sort((a, b) => colorSortValue(a) - colorSortValue(b));

export const categories: Category[] = [
  'All',
  ...categoryOrder.filter((category) => portfolio.some((image) => image.category === category)),
];
