import { FaInstagram } from 'react-icons/fa';
import Reveal from '@/components/animations/Reveal';
import StaggerGroup, { staggerItem } from '@/components/animations/StaggerGroup';
import { motion } from 'framer-motion';
import { instagramPosts } from '@/data/instagram';

export default function InstagramGallery() {
  return (
    <section className="container-luxury py-20 lg:py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Follow The Story</p>
        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">@khayaaljewels</h2>
      </Reveal>

      <StaggerGroup className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6" staggerDelay={0.06}>
        {instagramPosts.map((post) => (
          <motion.a
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            variants={staggerItem}
            className="group relative block aspect-square overflow-hidden rounded-xl"
            data-cursor-hover
          >
            <img
              src={post.image}
              alt="Instagram post"
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-brown/0 opacity-0 transition-all duration-300 group-hover:bg-brown/50 group-hover:opacity-100">
              <FaInstagram className="text-2xl text-white" />
            </div>
          </motion.a>
        ))}
      </StaggerGroup>
    </section>
  );
}
