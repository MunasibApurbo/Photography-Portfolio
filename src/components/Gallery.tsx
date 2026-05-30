import { AnimatePresence, motion } from 'framer-motion';
import { portfolio, categories, colorOrder, optimizedPhoto, photoAlt } from '../lib/photos';
import type { Category } from '../lib/photos';
import { ProtectedPhoto } from './ProtectedPhoto';

interface GalleryProps {
  onSelectImage: (index: number) => void;
  filteredImages: typeof portfolio;
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
}

export function Gallery({ onSelectImage, filteredImages, activeCategory, setActiveCategory }: GalleryProps) {
  const getDisplayDimensions = (ratio: number, maxSize = 900) => {
    const width = ratio >= 1 ? maxSize : Math.round(maxSize * ratio);
    const height = ratio >= 1 ? Math.round(maxSize / ratio) : maxSize;

    return { width, height };
  };

  const colorGroups = colorOrder
    .map((color) => ({
      color,
      images: filteredImages.filter((image) => image.colorFamily === color),
    }))
    .filter((group) => group.images.length > 0);

  return (
    <section id="work" className="gallery-section" aria-labelledby="work-heading">
      <div className="gallery-heading">
        <h2 id="work-heading">Browse the work</h2>
        <div className="filter-bar" aria-label="Filter gallery">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? 'is-active' : ''}
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="gallery-grid">
        {colorGroups.map((group) => (
          <motion.section
            layout
            className="gallery-color-group"
            key={group.color}
            aria-label={`${group.color} photographs`}
          >
            <div className="gallery-color-photos">
              <AnimatePresence mode="popLayout">
                {group.images.map((image) => {
                  const imageIndex = filteredImages.indexOf(image);
                  const { width, height } = getDisplayDimensions(image.ratio);

                  return (
                    <motion.button
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '60px' }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                      className="gallery-item"
                      key={image.name}
                      type="button"
                      data-protected-photo
                      onClick={() => onSelectImage(imageIndex)}
                      aria-label={`Open ${image.title}`}
                    >
                      <ProtectedPhoto
                        src={optimizedPhoto(image.name, 900)}
                        srcSet={`${optimizedPhoto(image.name, 900)} 900w, ${optimizedPhoto(image.name, 1800)} 1800w`}
                        sizes="(max-width: 720px) 100vw, (max-width: 1100px) 34vw, 25vw"
                        alt={photoAlt(image.title)}
                        loading="lazy"
                        decoding="async"
                        width={width}
                        height={height}
                      />
                      <div className="gallery-item-overlay">
                        <strong>{image.title}</strong>
                        <small>{image.category}</small>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.section>
        ))}
      </motion.div>
    </section>
  );
}
