import { motion } from 'framer-motion';
import { config } from '../config';

export function About() {
  const customEase = [0.76, 0, 0.24, 1] as const;

  return (
    <section id="about" className="about-section" aria-labelledby="about-heading">
      <p className="section-kicker">About</p>
      
      <div className="about-copy">
        <motion.h2 
          id="about-heading"
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, delay: 0.08, ease: customEase }}
        >
          {config.about.heading}
        </motion.h2>
      </div>

      <motion.div
        className="about-body"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: customEase }}
      >
        {config.about.paragraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
        
        <dl className="stats-list">
          {config.about.stats.focus && (
            <div>
              <dt>Focus</dt>
              <dd>{config.about.stats.focus}</dd>
            </div>
          )}
          {config.about.stats.location && (
            <div>
              <dt>Based in</dt>
              <dd>{config.about.stats.location}</dd>
            </div>
          )}
          {config.about.stats.gear && (
            <div>
              <dt>Gear</dt>
              <dd>{config.about.stats.gear}</dd>
            </div>
          )}
        </dl>
      </motion.div>
    </section>
  );
}
