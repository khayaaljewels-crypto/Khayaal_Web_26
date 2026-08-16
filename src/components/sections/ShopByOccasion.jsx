import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '@/components/animations/Reveal';
import StaggerGroup, { staggerItem } from '@/components/animations/StaggerGroup';
import { useOccasions } from '@/context/OccasionsContext';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function ShopByOccasion() {
  const { visibleOccasions: occasions, loading } = useOccasions();

  if (!loading && occasions.length === 0) return null;

  return (
    <section className="container-luxury py-20 lg:py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Every Story Deserves Jewellery</p>
        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Shop by Occasion</h2>
      </Reveal>

      <StaggerGroup className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4" staggerDelay={0.1}>
        {occasions.map((o) => (
          <motion.div key={o.id} variants={staggerItem}>
            <Link to={`/shop?occasion=${encodeURIComponent(o.slug)}`} className="group relative block overflow-hidden rounded-3xl" data-cursor-hover>
              <div className="aspect-3/4 overflow-hidden">
                <ImageWithFallback
                  src={o.image}
                  alt={o.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-900 ease-luxury group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-brown/85 via-brown/20 to-transparent" />
              <div className="absolute inset-0 flex items-end justify-center pb-8">
                <span className="font-heading text-2xl text-white">{o.name}</span>
              </div>
              <div className="pointer-events-none absolute inset-2 rounded-2xl border border-white/0 transition-all duration-500 group-hover:border-white/40" />
            </Link>
          </motion.div>
        ))}
      </StaggerGroup>
    </section>
  );
}
