export interface NavLink {
  href: string;
  label: string;
}

/**
 * Single source of truth for the public site menu. Header and footer both
 * render this list, so adding a page only means editing here.
 * Internal tooling pages (e.g. /domain-setup) are intentionally excluded.
 */
export const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/community', label: 'Community' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];
