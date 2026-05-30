import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { config } from '../config';

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
        <h2 id="contact-heading" style={{ whiteSpace: 'pre-line' }}>{config.contact.heading}</h2>
      </motion.div>
      <motion.div
        className="contact-actions"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.9, delay: 0.08, ease: customEase }}
      >
        {config.email && (
          <a className="text-link" href={`mailto:${config.email}`}>
            {config.contact.emailText}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        )}
        {config.socials.linkedin && (
          <a className="text-link" href={config.socials.linkedin} target="_blank" rel="noreferrer">
            {config.contact.linkedinText}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        )}
        {config.socials.github && (
          <a className="text-link" href={config.socials.github} target="_blank" rel="noreferrer">
            {config.contact.githubText}
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        )}
      </motion.div>
    </section>
  );
}
