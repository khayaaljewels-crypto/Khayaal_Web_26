import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaTimes } from 'react-icons/fa';
import Reveal from '@/components/animations/Reveal';
import StaggerGroup, { staggerItem } from '@/components/animations/StaggerGroup';
import { motion } from 'framer-motion';
import { instagramPosts } from '@/data/instagram';
import { useSettings } from '@/context/SettingsContext';

export default function InstagramGallery() {
  const { settings } = useSettings();
  const [activePost, setActivePost] = useState(null);
  const closeButtonRef = useRef(null);
  const openerRef = useRef(null);

  const reelId = activePost?.link.match(/\/reel\/([^/?]+)/)?.[1];

  useEffect(() => {
    if (!activePost) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setActivePost(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      openerRef.current?.focus();
    };
  }, [activePost]);

  return (
    <section className="container-luxury py-20 lg:py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Follow The Story</p>
        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">@{settings.instagramHandle}</h2>
      </Reveal>

      <StaggerGroup className="mt-12 grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-6" staggerDelay={0.06}>
        {instagramPosts.map((post) => (
          <motion.a
            key={post.id}
            href={post.link}
            onClick={(event) => {
              event.preventDefault();
              openerRef.current = event.currentTarget;
              setActivePost(post);
            }}
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

      {activePost && reelId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/90 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActivePost(null);
          }}
        >
          <div role="dialog" aria-modal="true" aria-label="Instagram Reel" className="relative">
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close Reel"
              onClick={() => setActivePost(null)}
              className="absolute -right-3 -top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-bg text-brown shadow-lg transition-colors hover:bg-white"
            >
              <FaTimes className="text-lg" />
            </button>
            <div
              className="overflow-hidden rounded-xl bg-black"
              style={{
                width: 'min(88vw, 420px, calc((100svh - 2rem) * 0.5625))',
                aspectRatio: '9 / 16',
              }}
            >
              <iframe
                title="Instagram Reel"
                src={`https://www.instagram.com/reel/${reelId}/embed/`}
                className="h-full w-full border-0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
