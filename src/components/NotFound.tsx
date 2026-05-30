import { motion } from 'framer-motion';
import { optimizedPhoto } from '../lib/photos';
import { ProtectedPhoto } from './ProtectedPhoto';

export function NotFound() {
  const customEase = [0.76, 0, 0.24, 1] as const;

  const textVariants = {
    hidden: { y: 36, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.9, ease: customEase } },
  };

  return (
    <section className="not-found-section" aria-label="Page not found">
      <motion.picture 
        className="not-found-media"
        data-protected-photo
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: customEase }}
      >
        <source
          type="image/webp"
          srcSet={`${optimizedPhoto('Rain 1.jpg', 900)} 900w, ${optimizedPhoto('Rain 1.jpg', 1800)} 1800w`}
          sizes="100vw"
        />
        <ProtectedPhoto
          src={optimizedPhoto('Rain 1.jpg', 1800)}
          alt="Umbrella Shelter"
          fetchPriority="high"
          decoding="async"
        />
      </motion.picture>

      <motion.div
        className="not-found-content"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.08, delayChildren: 0.16 }}
      >
        <motion.p variants={textVariants} className="section-kicker">404 Error</motion.p>
        <div style={{ overflow: 'hidden' }}>
          <motion.h1 variants={textVariants}>You've wandered<br />out of bounds.</motion.h1>
        </div>
        <motion.div variants={textVariants} style={{ marginTop: '40px' }}>
          <a href="/" className="button button-secondary">
            Return to the gallery
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
