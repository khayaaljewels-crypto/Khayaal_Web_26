import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebookF, FaPinterestP, FaYoutube } from 'react-icons/fa';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import Reveal from '@/components/animations/Reveal';
import { useSettings } from '@/context/SettingsContext';
import Logo from '@/components/ui/Logo';

const SHOP_LINKS = [
  { label: 'Bridal Sets', to: '/shop?category=bridal-sets' },
  { label: 'Kundan Sets', to: '/shop?category=kundan-sets' },
  { label: 'Polki Sets', to: '/shop?category=polki-sets' },
  { label: 'Temple Jewellery Sets', to: '/shop?category=temple-jewellery-sets' },
  { label: 'Victorian Sets', to: '/shop?category=victorian-sets' },
];

const HELP_LINKS = [
  { label: 'Contact Us', to: '/contact' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Track Order', to: '/track-order' },
  { label: 'Size Guide', to: '/faq#size-guide' },
  { label: 'Returns', to: '/my-account/orders' },
];

const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'Our Story', to: '/about#story' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Profile', to: '/my-account' },
];


export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const socialLinks = [
    { Icon: FaInstagram, href: settings.instagram },
    { Icon: FaFacebookF, href: settings.facebook },
    { Icon: FaPinterestP, href: settings.pinterest },
    { Icon: FaYoutube, href: '#' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <footer className="border-t border-border bg-beige/60">
      {/* <div className="container-luxury py-16 lg:py-20">
        <Reveal className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-brown px-8 py-12 text-white sm:px-14 sm:py-14 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow !text-gold-hover">Stay In The Light</p>
            <h3 className="mt-2 font-heading text-2xl sm:text-3xl">
              Join our list for early access to new collections
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2 sm:w-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-transform hover:scale-105"
            >
              <HiOutlineArrowRight />
            </button>
          </form>
          {submitted && (
            <span className="text-xs text-gold-hover">Thank you — you're on the list.</span>
          )}
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-10 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <Logo className="h-12 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-text/70">
              Premium imitation jewellery crafted for the modern heirloom — luxury design,
              accessible elegance, made to be worn and remembered.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Social link"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-brown transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Help" links={HELP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />
        </div>


      </div> */}
    </footer>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="font-heading text-sm text-brown">{title}</p>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-text/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
