import { motion } from 'framer-motion';

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
          I look for quiet moments that stay with me.
        </motion.h2>
      </div>

      <motion.div
        className="about-body"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: customEase }}
      >
        <p>
          Hey, I'm Munasib Apurbo. I take photos around Bangladesh, mostly on the streets, while traveling, or just on random walks when the light hits right.
        </p>
        <p>
          I don't have a dedicated camera or anything — I just shoot with whatever I can get my hands on. A friend's phone, a borrowed DSLR, anything that takes a picture. It's never been about the gear for me. It's the colors, the mood, the little things most people walk right past.
        </p>
        <dl className="stats-list">
          <div>
            <dt>Focus</dt>
            <dd>Street, travel, documentary</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd>Bangladesh</dd>
          </div>
          <div>
            <dt>Gear</dt>
            <dd>Whatever I can find</dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
