// Footer data — kept in one module so the footer stays a layout-only concern.
// The Shop slugs match src/data/storefrontCategories.js exactly, so every
// /shop?category=<slug> link lands on a populated grid rather than an empty one.

export const SHOP_LINKS = [
  { label: 'Necklace Sets', to: '/shop?category=necklace-sets' },
  { label: 'Bridal Sets', to: '/shop?category=bridal-sets' },
  { label: 'Earrings', to: '/shop?category=earrings' },
  { label: 'Bangles', to: '/shop?category=bangles' },
];

export const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Story', to: '/about#story' },
  { label: 'Contact', to: '/contact' },
];

// Storefront-wide contact details for the footer. These are deliberately
// constants rather than admin settings: the footer must always show the
// store's canonical Instagram profile and WhatsApp number, even if a stale
// copy of the editable settings lives in a visitor's localStorage.
export const INSTAGRAM_URL =
  'https://www.instagram.com/khayaal_jewels?stkn=MXN6YnJ2bmJzcnlpdA==';
export const INSTAGRAM_HANDLE = '@khayaal_jewels';

export const WHATSAPP_NUMBER = '919037246978';
export const WHATSAPP_DISPLAY = '+91 90372 46978';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const STORE_LOCATION = 'Kozhikode, Kerala, India';

export const COPYRIGHT_NOTICE = '© 2026 Khayaal Jewels. All rights reserved.';
