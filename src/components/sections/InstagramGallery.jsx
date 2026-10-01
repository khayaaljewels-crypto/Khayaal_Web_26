import { FaInstagram } from 'react-icons/fa';
import Reveal from '@/components/animations/Reveal';
import StaggerGroup, { staggerItem } from '@/components/animations/StaggerGroup';
import { motion } from 'framer-motion';
import { instagramPosts } from '@/data/instagram';
import { useSettings } from '@/context/SettingsContext';

export default function InstagramGallery() {
  const { settings } = useSettings();

  return (
    <section className="container-luxury py-20 lg:py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Follow The Story</p>
        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">@{settings.instagramHandle}</h2>
      </Reveal>

      <StaggerGroup
        className="mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-6 [&::-webkit-scrollbar]:hidden"
        staggerDelay={0.06}
      >
        {instagramPosts.map((post) => (
          <motion.a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={staggerItem}
            aria-label={`Watch Khayaal Jewels Instagram Reel ${post.id}`}
            className="group relative block aspect-[9/16] w-[62vw] shrink-0 snap-start overflow-hidden rounded-xl sm:w-auto sm:min-w-0"
            data-cursor-hover
          >
            <img
              src={post.image}
              alt="Khayaal Jewels Instagram Reel thumbnail"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-brown/0 opacity-0 transition-all duration-300 group-hover:bg-brown/35 group-hover:opacity-100">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-brown/20 text-white">
                <FaInstagram className="text-xl" />
              </span>
            </div>
          </motion.a>
        ))}
      </StaggerGroup>
    </section>
  );
}
