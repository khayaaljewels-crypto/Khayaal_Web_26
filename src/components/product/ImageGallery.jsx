import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiOutlineArrowsPointingOut, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import FullscreenGallery from './FullscreenGallery';

export default function ImageGallery({ images, productName, badge }) {
  const [active, setActive] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  };

  const next = () => setActive((a) => (a + 1) % images.length);
  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);

  return (
    <div>
      <div className="flex gap-4">
        {/* Thumbnails - desktop vertical rail */}
        <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square overflow-hidden rounded-xl border-2 transition-colors ${
                i === active ? 'border-gold' : 'border-transparent hover:border-border'
              }`}
            >
              <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        {/* Main image with magnifier */}
        <div className="relative flex-1">
          <div
            ref={imageRef}
            className="relative aspect-square cursor-zoom-in overflow-hidden rounded-2xl bg-beige"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleMouseMove}
            onClick={() => setFullscreenOpen(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={active}
                src={images[active]}
                alt={productName}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="h-full w-full object-cover"
              />
            </AnimatePresence>

            {badge && (
              <span className="absolute left-4 top-4 rounded-full bg-brown px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
                {badge}
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenOpen(true);
              }}
              aria-label="View fullscreen"
              className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-brown shadow-sm backdrop-blur transition-transform hover:scale-110"
            >
              <HiOutlineArrowsPointingOut />
            </button>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brown shadow-sm sm:hidden"
                >
                  <HiChevronLeft />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brown shadow-sm sm:hidden"
                >
                  <HiChevronRight />
                </button>
              </>
            )}
          </div>

          {/* Zoom lens preview panel - desktop only */}
          {zoomActive && (
            <div
              className="pointer-events-none absolute left-full top-0 z-20 ml-4 hidden aspect-square w-full overflow-hidden rounded-2xl border border-border bg-beige shadow-soft lg:block"
              style={{
                backgroundImage: `url(${images[active]})`,
                backgroundSize: '220%',
                backgroundPosition: `${lensPos.x}% ${lensPos.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />
          )}
        </div>
      </div>

      {/* Thumbnails - mobile horizontal strip */}
      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar sm:hidden">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
              i === active ? 'border-gold' : 'border-transparent'
            }`}
          >
            <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <FullscreenGallery
        open={fullscreenOpen}
        images={images}
        activeIndex={active}
        onIndexChange={setActive}
        onClose={() => setFullscreenOpen(false)}
        productName={productName}
      />
    </div>
  );
}
