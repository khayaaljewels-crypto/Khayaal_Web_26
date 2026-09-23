import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from './footerLinks';

// Only the two channels the brand actually answers on. Rendered as plain
// icon + label pairs (no circular buttons) — lighter, and they sit side by
// side on every breakpoint, including a 320px phone.
const CHANNELS = [
  {
    key: 'instagram',
    href: INSTAGRAM_URL,
    Icon: FaInstagram,
    label: `Instagram — ${INSTAGRAM_HANDLE}`,
    text: INSTAGRAM_HANDLE,
  },
  {
    key: 'whatsapp',
    href: WHATSAPP_URL,
    Icon: FaWhatsapp,
    label: `WhatsApp — ${WHATSAPP_DISPLAY}`,
    text: WHATSAPP_DISPLAY,
  },
];

export default function FooterSocialLinks({ className = '' }) {
  return (
    <div className={className}>
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brown">
        Connect
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        {CHANNELS.map(({ key, href, Icon, label, text }) => (
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="group inline-flex items-center gap-2 text-[13px] text-[#6F6259] transition-colors hover:text-gold sm:text-sm"
          >
            <Icon
              aria-hidden="true"
              className="text-base text-brown transition-colors group-hover:text-gold"
            />
            <span className="whitespace-nowrap">{text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
