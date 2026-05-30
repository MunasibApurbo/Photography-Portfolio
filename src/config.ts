/**
 * Photography Portfolio Configuration
 *
 * Customize this file to change all personal information, contact links,
 * bio details, and photography categories across the entire website.
 */

export const config = {
  // Your professional name (Jane Doe is used here as a demo placeholder)
  name: 'Jane Doe',

  // Website title used for SEO and document headers
  title: 'Jane Doe | Photography',

  // Primary contact email address
  email: 'janedoe@example.com',

  // Social media link targets (leave empty or remove from UI if not needed)
  socials: {
    linkedin: 'https://www.linkedin.com/in/janedoe/',
    github: 'https://github.com/janedoe',
    facebook: 'https://www.facebook.com/',
    twitter: 'https://x.com/',
    whatsapp: 'https://wa.me/', // Add country code, e.g. https://wa.me/1234567890
  },

  // Base URL where your portfolio is hosted (crucial for SEO / sharing metadata)
  baseUrl: 'https://janedoe.com/',

  // Hero Section configuration
  hero: {
    title: 'Jane Doe',
    subtitle: 'Everyday moments, shaped through color, mood, and memory.',
    // Name of the image in your "raw-images" folder to be used as the Hero background
    // Note: Do not add folders or extension; e.g. if you have raw-images/street_placeholder.svg, put 'street_placeholder.svg'
    heroImageName: 'street_placeholder.svg',
  },

  // About Section configuration
  about: {
    heading: 'I look for quiet moments that stay with me.',
    paragraphs: [
      "Hey, I'm Jane Doe. I take photos, mostly on the streets, while traveling, or just on random walks when the light hits right.",
      "I don't have a dedicated camera or anything — I just shoot with whatever I can get my hands on. It's never been about the gear for me. It's the colors, the mood, the little things most people walk right past."
    ],
    stats: {
      focus: 'Street, travel, portrait',
      location: 'New York, USA',
      gear: 'Whatever is in my hands',
    }
  },

  // Contact Section configuration
  contact: {
    heading: "Wanna talk?\nI'm around.",
    emailText: 'Say hello via Email',
    linkedinText: 'Connect on LinkedIn',
    githubText: 'View GitHub',
  }
};

/**
 * Customizable Photography Categories
 * Change these names to categorize your photos differently.
 * The automated optimization script will read these when grouping items.
 */
export const CATEGORY_ORDER = ['Street', 'Nature', 'Travel', 'Portrait', 'Still Life'] as const;
export type PhotoCategory = typeof CATEGORY_ORDER[number];
