import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.resolve(__dirname, '../raw-images');
const OUT_DIR = path.resolve(__dirname, '../public/optimized');
const MANIFEST_PATH = path.resolve(__dirname, '../src/data/photoManifest.ts');
const CONFIG_PATH = path.resolve(__dirname, '../src/config.ts');

// Predefined color families
const COLOR_ORDER = ['Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Violet', 'Neutral'];

/**
 * Converts RGB to HSV (Hue, Saturation, Value) for accurate color family clustering.
 */
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else if (max === b) h = ((r - g) / d + 4) * 60;
  }
  
  const s = max === 0 ? 0 : d / max;
  const v = max;
  
  return { h, s: s * 100, v: v * 100 };
}

/**
 * Classifies an RGB color into one of our predefined color families.
 */
function classifyColor(r, g, b) {
  const { h, s, v } = rgbToHsv(r, g, b);
  
  // Classification boundaries:
  // Low saturation or extremely dark/bright values are categorized as Neutral
  if (s < 12 || v < 15 || (v > 85 && s < 15)) {
    return 'Neutral';
  }
  
  // Map Hue angles (0 - 360) to corresponding color categories
  if (h < 18 || h >= 335) return 'Red';
  if (h >= 18 && h < 42) return 'Orange';
  if (h >= 42 && h < 70) return 'Yellow';
  if (h >= 70 && h < 160) return 'Green';
  if (h >= 160 && h < 195) return 'Cyan';
  if (h >= 195 && h < 255) return 'Blue';
  
  return 'Violet';
}

/**
 * Normalizes a file name into a human-readable title.
 */
function titleFromName(name) {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/_/g, ' ')
    .replace(/\s+-\s+Copy/i, '')
    .trim();
}

/**
 * Loads customizable categories from config.ts if possible.
 */
function loadConfigCategories() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const content = fs.readFileSync(CONFIG_PATH, 'utf-8');
      const match = content.match(/export const CATEGORY_ORDER = \[(.*?)\]/s);
      if (match) {
        return match[1]
          .split(',')
          .map(c => c.replace(/['"\s]/g, '').trim())
          .filter(Boolean);
      }
    }
  } catch (err) {
    console.warn('⚠️ Could not parse categories from config.ts. Using defaults.', err);
  }
  return ['Street', 'Nature', 'Travel', 'Portrait', 'Still Life'];
}

/**
 * Parses the existing manifest to preserve user titles and categories.
 */
function parseExistingCatalog() {
  const catalog = {};
  if (!fs.existsSync(MANIFEST_PATH)) return catalog;
  
  try {
    const content = fs.readFileSync(MANIFEST_PATH, 'utf-8');
    
    // Regular expression matching catalog entry pairs in TS object literal format
    const entryRegex = /'([^']+)':\s*\{\s*title:\s*'([^']*)',\s*category:\s*'([^']*)'\s*\}/g;
    let match;
    while ((match = entryRegex.exec(content)) !== null) {
      const [_, name, title, category] = match;
      catalog[name] = { title, category };
    }
  } catch (err) {
    console.error('⚠️ Could not parse existing manifest. Regenerating clean catalog.', err);
  }
  return catalog;
}

async function run() {
  console.log('🚀 Starting photography portfolio optimization script...');
  
  if (!fs.existsSync(RAW_DIR)) {
    console.error(`❌ Raw images directory not found at: ${RAW_DIR}`);
    console.log('Please create a "raw-images" directory and place your original photos there.');
    process.exit(1);
  }
  
  // Ensure output directory exists
  fs.mkdirSync(OUT_DIR, { recursive: true });
  
  // Read categories and existing catalog
  const allowedCategories = loadConfigCategories();
  const defaultCategory = allowedCategories[0] || 'Street';
  const existingCatalog = parseExistingCatalog();
  
  // Find all image files
  const files = fs.readdirSync(RAW_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.heic', '.svg'].includes(ext);
  });
  
  if (files.length === 0) {
    console.warn('⚠️ No raw images found in "raw-images/". Add images and run script again.');
    
    // Write an empty placeholder manifest so the site still compiles
    const emptyManifestContent = `import type { PhotoCategory } from '../config';

export type PhotoColor = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Cyan' | 'Blue' | 'Violet' | 'Neutral';

export const imageMetadata = [] as const;

export type PhotoCatalogEntry = {
  title: string;
  category: PhotoCategory;
};

export const photoCatalog: Record<string, PhotoCatalogEntry> = {};
`;
    fs.writeFileSync(MANIFEST_PATH, emptyManifestContent, 'utf-8');
    console.log('✅ Generated empty photoManifest.ts placeholder.');
    return;
  }
  
  console.log(`📸 Found ${files.length} raw images. Processing...`);
  
  const processedImages = [];
  const updatedCatalog = {};
  
  for (const file of files) {
    const rawPath = path.join(RAW_DIR, file);
    const stem = path.parse(file).name;
    
    const out900 = path.join(OUT_DIR, `${stem}-900.webp`);
    const out1800 = path.join(OUT_DIR, `${stem}-1800.webp`);
    
    try {
      const sharpImg = sharp(rawPath);
      const metadata = await sharpImg.metadata();
      
      const width = metadata.width || 1;
      const height = metadata.height || 1;
      const ratio = width / height;
      
      // 1. Generate optimized webp sizes if they don't already exist
      if (!fs.existsSync(out900)) {
        await sharpImg
          .resize({ width: 900, withoutEnlargement: true })
          .webp({ quality: 86 })
          .toFile(out900);
        console.log(`  + Created: ${stem}-900.webp`);
      }
      
      if (!fs.existsSync(out1800)) {
        await sharpImg
          .resize({ width: 1800, withoutEnlargement: true })
          .webp({ quality: 88 })
          .toFile(out1800);
        console.log(`  + Created: ${stem}-1800.webp`);
      }
      
      // 2. Extract dominant color family using 1x1 downscaling
      const { data } = await sharp(rawPath)
        .resize(1, 1, { fit: 'fill' })
        .raw()
        .toBuffer({ resolveWithObject: true });
        
      const [r, g, b] = data;
      const colorFamily = classifyColor(r, g, b);
      
      processedImages.push({
        name: file,
        colorFamily,
        ratio,
      });
      
      // 3. Keep or generate catalog entry (Title & Category)
      const existing = existingCatalog[file];
      updatedCatalog[file] = {
        title: existing?.title || titleFromName(file),
        category: existing?.category || defaultCategory,
      };
      
    } catch (err) {
      console.error(`❌ Failed to process: ${file}`, err);
    }
  }
  
  // 4. Calculate color ranks sequentially per color family
  const groupedByColor = {};
  for (const img of processedImages) {
    if (!groupedByColor[img.colorFamily]) {
      groupedByColor[img.colorFamily] = [];
    }
    groupedByColor[img.colorFamily].push(img);
  }
  
  const finalMetadataList = [];
  for (const family of COLOR_ORDER) {
    const list = groupedByColor[family] || [];
    list.forEach((img, idx) => {
      finalMetadataList.push({
        name: img.name,
        colorFamily: img.colorFamily,
        colorRank: (idx + 1) * 10,
        ratio: img.ratio,
      });
    });
  }
  
  // 5. Generate ts output content
  const manifestContent = `import type { PhotoCategory } from '../config';

export type PhotoColor = 'Red' | 'Orange' | 'Yellow' | 'Green' | 'Cyan' | 'Blue' | 'Violet' | 'Neutral';

export const imageMetadata = [
${finalMetadataList.map(img => `  { name: '${img.name}', colorFamily: '${img.colorFamily}', colorRank: ${img.colorRank}, ratio: ${img.ratio} },`).join('\n')}
] as const;

export type PhotoCatalogEntry = {
  title: string;
  category: PhotoCategory;
};

export const photoCatalog: Record<string, PhotoCatalogEntry> = {
${Object.entries(updatedCatalog).map(([name, entry]) => `  '${name}': { title: '${entry.title.replace(/'/g, "\\'")}', category: '${entry.category}' },`).join('\n')}
};
`;

  fs.writeFileSync(MANIFEST_PATH, manifestContent, 'utf-8');
  console.log(`\n🎉 Optimization complete! Generated ${processedImages.length} entries.`);
  console.log(`📂 Manifest updated at: ${MANIFEST_PATH}`);
}

run();
