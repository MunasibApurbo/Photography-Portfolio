import { motion, useScroll, useTransform } from 'framer-motion';
import { optimizedPhoto } from '../lib/photos';
import { ProtectedPhoto } from './ProtectedPhoto';
import { config } from '../config';

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 160]);
  const customEase = [0.76, 0, 0.24, 1] as const;

  const textVariants = {
    hidden: { y: 38, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 1, ease: customEase } },
  };

  const bgPhotoName = config.hero.heroImageName || 'forest.jpg';

  return (
    <section id="home" className="hero-section" aria-label="Portfolio introduction">
      <motion.picture
        className="hero-media"
        data-protected-photo
        style={{ y }}
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1.02 }}
        transition={{ duration: 1.25, ease: customEase }}
      >
        <source
          type="image/webp"
          srcSet={`${optimizedPhoto(bgPhotoName, 900)} 900w, ${optimizedPhoto(bgPhotoName, 1800)} 1800w`}
          sizes="100vw"
        />
        <ProtectedPhoto
          src={optimizedPhoto(bgPhotoName, 1800)}
          alt={`Hero photograph by ${config.name}`}
          fetchPriority="high"
          decoding="async"
        />
      </motion.picture>

      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.09, delayChildren: 0.22 }}
      >
        <motion.p variants={textVariants} className="hero-location">
          {config.about.stats.focus}
        </motion.p>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1 variants={textVariants}>{config.hero.title || config.name}</motion.h1>
        </div>
        <motion.p variants={textVariants} className="hero-copy">
          {config.hero.subtitle}
        </motion.p>
      </motion.div>

    </section>
  );
}
