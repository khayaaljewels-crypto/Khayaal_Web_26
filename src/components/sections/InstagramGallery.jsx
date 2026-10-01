import { FaInstagram } from 'react-icons/fa';

import Reveal from '@/components/animations/Reveal';

import StaggerGroup, {
  staggerItem,
} from '@/components/animations/StaggerGroup';

import { motion } from 'framer-motion';

import { instagramPosts } from '@/data/instagram';

import { useSettings } from '@/context/SettingsContext';

export default function InstagramGallery() {
  const { settings } = useSettings();

  return (
    <section className="container-luxury py-12 sm:py-16 lg:py-28">
      {/* Section Heading */}
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Follow The Story</p>

        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">
          @{settings.instagramHandle}
        </h2>
      </Reveal>

      {/* Instagram Gallery */}
      <StaggerGroup
        className="mt-8 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4 lg:grid-cols-6"
        staggerDelay={0.06}
      >
        {instagramPosts.map((post) => (
          <motion.a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={staggerItem}
            className="group relative block aspect-square overflow-hidden rounded-xl"
            data-cursor-hover
            aria-label={`View Khayaal Jewels Instagram Reel ${post.id}`}
          >
            {/* Reel Thumbnail */}
            <img
              src={post.image}
              alt="Khayaal Jewels Instagram Reel"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            />

            {/* Instagram Hover Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-brown/0 opacity-0 transition-all duration-300 group-hover:bg-brown/50 group-hover:opacity-100">
              <FaInstagram className="text-2xl text-white" />
            </div>
          </motion.a>
        ))}
      </StaggerGroup>
    </section>
  );
}
