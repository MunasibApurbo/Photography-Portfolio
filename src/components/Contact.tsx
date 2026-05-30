import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export function Contact() {
  const customEase = [0.76, 0, 0.24, 1] as const;

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-heading">
      <p className="section-kicker">Contact</p>
      
      <motion.div
        className="contact-copy"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, ease: customEase }}
      >
        <h2 id="contact-heading">Wanna talk?<br />I'm around.</h2>
      </motion.div>
      <motion.div
        className="contact-actions"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, delay: 0.08, ease: customEase }}
      >
        <a className="text-link" href="mailto:munasibapurbocontact@gmail.com">
          Say hello via Email
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a className="text-link" href="https://www.linkedin.com/in/munasib-apurbo/" target="_blank" rel="noreferrer">
          Connect on LinkedIn
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
        <a className="text-link" href="https://github.com/MunasibApurbo" target="_blank" rel="noreferrer">
          View GitHub
          <ArrowUpRight aria-hidden="true" size={16} />
        </a>
      </motion.div>
    </section>
  );
}
