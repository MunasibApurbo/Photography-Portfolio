import { useEffect, useMemo, useRef, useState, type Dispatch, type MouseEvent, type SetStateAction } from 'react';
import { ArrowUp, ChevronLeft, ChevronRight, Mail, X, Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { SmoothScroll } from './components/SmoothScroll';
import { Hero } from './components/Hero';
import { Gallery } from './components/Gallery';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { NotFound } from './components/NotFound';
import { ProtectedPhoto } from './components/ProtectedPhoto';
import { usePhotoProtection } from './hooks/usePhotoProtection';
import { portfolio, optimizedPhoto } from './lib/photos';
import { config } from './config';
import type { Category } from './lib/photos';
import 'lenis/dist/lenis.css';
import './index.css';

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const swipeStartX = useRef<number | null>(null);
  
  const is404 = window.location.pathname !== '/';
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1, force: true });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  usePhotoProtection();

  // Set the dynamic website title from config
  useEffect(() => {
    document.title = config.title;
  }, []);

  useEffect(() => {
    const shouldLockScroll = mobileMenuOpen || selectedImage !== null;

    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';
    document.body.classList.toggle('modal-open', selectedImage !== null);

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    };
  }, [mobileMenuOpen, selectedImage]);

  useEffect(() => {
    const updateBackToTop = () => {
      setShowBackToTop(window.scrollY > window.innerHeight * 1.2);
    };

    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });

    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  const filteredImages = useMemo(() => {
    return activeCategory === 'All'
      ? portfolio
      : portfolio.filter((img) => img.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, filteredImages.length]);

  return (
    <>
      {is404 && (
        <SmoothScroll>
          <NotFound />
        </SmoothScroll>
      )}

      {!is404 && (
        <SmoothScroll>
          <a className="skip-link" href="#work">Skip to portfolio</a>
          <SiteNavigation mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

          <main>
            <Hero />
            <Gallery 
              onSelectImage={setSelectedImage}
              filteredImages={filteredImages}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
            />
            <About />
            <Contact />
          </main>

          <footer className="site-footer">
            <span>© {new Date().getFullYear()} {config.name}. All rights reserved.</span>
            <button className="footer-top" onClick={scrollToTop}>
              <span>Go to Top</span>
              <ArrowUp size={14} aria-hidden="true" />
            </button>
          </footer>

          <BackToTopButton
            className={`mobile-back-top ${showBackToTop && !mobileMenuOpen && selectedImage === null ? 'is-visible' : ''}`}
            aria-label="Quick back to top"
          />

          <AnimatePresence>
            {selectedImage !== null && (
              <motion.div
                className="lightbox"
                role="dialog"
                aria-modal="true"
                aria-label="Image viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.26 }}
                onTouchStart={(e) => {
                  if (e.target instanceof Element && e.target.closest('button')) return;
                  const touch = e.touches[0];
                  swipeStartX.current = touch.clientX;
                }}
                onTouchEnd={(e) => {
                  if (e.target instanceof Element && e.target.closest('button')) return;
                  const startX = swipeStartX.current;
                  if (startX === null) return;
                  const endX = e.changedTouches[0].clientX;
                  const diffX = startX - endX;
                  const minSwipe = 40;

                  if (diffX > minSwipe) {
                    setSelectedImage(prev => prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev);
                  } else if (diffX < -minSwipe) {
                    setSelectedImage(prev => prev !== null && prev > 0 ? prev - 1 : prev);
                  }
                  swipeStartX.current = null;
                }}
              >
                <button
                  className="lightbox-close"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedImage(null);
                  }}
                  onTouchStart={(event) => event.stopPropagation()}
                  onTouchEnd={(event) => {
                    event.stopPropagation();
                    setSelectedImage(null);
                  }}
                  aria-label="Close viewer"
                >
                  <X size={32} />
                </button>

                <button
                  className="lightbox-nav previous"
                  type="button"
                  onClick={() => setSelectedImage(prev => prev !== null && prev > 0 ? prev - 1 : prev)}
                  disabled={selectedImage === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} aria-hidden="true" />
                </button>

                <motion.figure
                  key={filteredImages[selectedImage].name}
                  data-protected-photo
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
                >
                  <ProtectedPhoto
                    src={optimizedPhoto(filteredImages[selectedImage].name, 1800)}
                    alt={filteredImages[selectedImage].title}
                    loading="eager"
                    decoding="async"
                  />
                  <figcaption>
                    <span>{filteredImages[selectedImage].title}</span>
                    <span>{filteredImages[selectedImage].category}</span>
                  </figcaption>
                </motion.figure>

                <button
                  className="lightbox-nav next"
                  type="button"
                  onClick={() => setSelectedImage(prev => prev !== null && prev < filteredImages.length - 1 ? prev + 1 : prev)}
                  disabled={selectedImage === filteredImages.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight size={28} aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </SmoothScroll>
      )}
    </>
  );
}

type SectionId = 'home' | 'work' | 'about' | 'contact';

function SiteNavigation({
  mobileMenuOpen,
  setMobileMenuOpen,
}: {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const lenis = useLenis();

  const handleSectionClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: SectionId) => {
    event.preventDefault();
    const wasMobileMenuOpen = mobileMenuOpen;
    setMobileMenuOpen(false);

    window.setTimeout(() => {
      const target = sectionId === 'home' ? 0 : document.getElementById(sectionId);
      if (target === null) return;

      const headerHeight = Number.parseFloat(
        window.getComputedStyle(document.documentElement).getPropertyValue('--header-height')
      ) || 0;
      const anchorOffset = window.matchMedia('(max-width: 768px)').matches
        ? headerHeight * 2
        : headerHeight;

      window.history.pushState(null, '', sectionId === 'home' ? '#home' : `#${sectionId}`);

      if (lenis) {
        lenis.scrollTo(target, {
          duration: 1.1,
          force: true,
          offset: sectionId === 'home' ? 0 : -anchorOffset,
        });
        return;
      }

      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
        return;
      }

      const targetTop = Math.max(target.getBoundingClientRect().top + window.scrollY - anchorOffset, 0);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }, wasMobileMenuOpen ? 120 : 0);
  };

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" onClick={(event) => handleSectionClick(event, 'home')} aria-label={`${config.name} home`}>
          <img src="/logo.png" alt="" />
          <span>{config.name}</span>
        </a>
        <nav className="site-nav" aria-label="Primary navigation">
          <a href="#home" onClick={(event) => handleSectionClick(event, 'home')}>Home</a>
          <a href="#work" onClick={(event) => handleSectionClick(event, 'work')}>Work</a>
          <a href="#about" onClick={(event) => handleSectionClick(event, 'about')}>About</a>
        </nav>
        <a className="header-action desktop-only" href="#contact" onClick={(event) => handleSectionClick(event, 'contact')}>
          <Mail size={16} aria-hidden="true" />
          <span>Say Hello</span>
        </a>
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            id="mobile-menu"
            style={{
              backdropFilter: 'blur(34px)',
              WebkitBackdropFilter: 'blur(34px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
          >
            <motion.nav
              className="mobile-menu-nav"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.76, 0, 0.24, 1] }}
            >
              <a href="#home" onClick={(event) => handleSectionClick(event, 'home')}>Home</a>
              <a href="#work" onClick={(event) => handleSectionClick(event, 'work')}>Work</a>
              <a href="#about" onClick={(event) => handleSectionClick(event, 'about')}>About</a>
              <a href="#contact" onClick={(event) => handleSectionClick(event, 'contact')}>Contact</a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BackToTopButton({
  className,
  'aria-label': ariaLabel = 'Back to top',
}: {
  className: string;
  'aria-label'?: string;
}) {
  const lenis = useLenis();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.1, force: true });
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={className}
      type="button"
      onClick={scrollToTop}
      aria-label={ariaLabel}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}

export default App;
