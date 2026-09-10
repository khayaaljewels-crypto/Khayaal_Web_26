import { FaEnvelope, FaFacebookF, FaInstagram, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import Reveal from '@/components/animations/Reveal';
import { useSettings } from '@/context/SettingsContext';

export default function Contact() {
  const { settings } = useSettings();
  const phoneDisplay = `${settings.contactNumber.slice(0, 3)} ${settings.contactNumber.slice(3)}`;
  const contactOptions = [
    { Icon: FaPhoneAlt, label: 'Call us', value: phoneDisplay, href: `tel:${settings.contactNumber}` },
    { Icon: FaWhatsapp, label: 'WhatsApp', value: phoneDisplay, href: `https://wa.me/${settings.whatsappNumber}` },
    { Icon: FaEnvelope, label: 'Email us', value: settings.email, href: `mailto:${settings.email}` },
    { Icon: FaInstagram, label: 'Instagram', value: `@${settings.instagramHandle}`, href: settings.instagram, external: true },
    { Icon: FaFacebookF, label: 'Facebook', value: 'Khayaal Jewels', href: settings.facebook, external: true },
  ];

  return (
    <section className="container-luxury py-24 sm:py-32 lg:py-40">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">We would love to hear from you</p>
        <h1 className="mt-4 font-heading text-5xl text-brown sm:text-6xl">Contact us</h1>
        <p className="mt-6 leading-8 text-text/70">For styling guidance, order questions, or anything else, reach out through the channel that suits you best.</p>
      </Reveal>
      <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {contactOptions.map(({ Icon, label, value, href, external }) => (
          <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className="group rounded-2xl border border-border bg-white p-6 transition-colors hover:border-gold">
            <Icon className="text-xl text-gold" />
            <p className="mt-5 text-sm text-text/55">{label}</p>
            <p className="mt-1 break-all font-medium text-brown transition-colors group-hover:text-gold">{value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
