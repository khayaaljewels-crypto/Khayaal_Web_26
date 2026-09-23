import { Link } from 'react-router-dom';

/**
 * One footer link group ("Shop", "Company"). Kept deliberately plain: a small
 * letterspaced heading over a tight list, no boxes or dividers, so the whole
 * footer stays short.
 */
export default function FooterLinkColumn({ title, links, className = '' }) {
  return (
    <nav className={className} aria-label={title}>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brown">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className="text-sm text-[#6F6259] transition-colors hover:text-gold"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
