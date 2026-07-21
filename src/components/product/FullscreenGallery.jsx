import { AnimatePresence, motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import { HiOutlineXMark } from 'react-icons/hi2';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import 'swiper/css';

export default function FullscreenGallery({ open, images, activeIndex, onIndexChange, onClose, productName }) {
  useLockBodyScroll(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99] flex flex-col bg-brown/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-sm text-white/70">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              onClick={onClose}
              aria-label="Close fullscreen gallery"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <HiOutlineXMark className="text-xl" />
            </button>
          </div>

          <div className="flex-1 px-4 pb-4 sm:px-10 sm:pb-10">
            <Swiper
              modules={[Keyboard]}
              keyboard
              initialSlide={activeIndex}
              onSlideChange={(swiper) => onIndexChange(swiper.activeIndex)}
              className="h-full w-full"
            >
              {images.map((img, i) => (
                <SwiperSlide key={i} className="flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${productName} ${i + 1}`}
                    className="max-h-full max-w-full rounded-xl object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex justify-center gap-2 pb-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => onIndexChange(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === activeIndex ? 'w-6 bg-gold' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
