import { Link } from 'react-router-dom';
import { useCategories } from '@/context/CategoriesContext';
import { useProductList } from '@/hooks/useProductList';
import Reveal from '@/components/animations/Reveal';
import StaggerGroup, { staggerItem } from '@/components/animations/StaggerGroup';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

function CategoryTile({ cat }) {
  // Temporary diagnostic logging — open DevTools console to see exactly
  // what this section receives per category, including the `image` field
  // it renders. Safe to remove once image rendering is confirmed correct.
  console.log('[Shop by Category] category:', cat);

  // One lightweight count-only request per tile (pageSize: 1 — only
  // meta.total is read) rather than fetching the whole catalogue to derive
  // counts client-side.
  const { meta, loading } = useProductList({ category: cat.slug, pageSize: 1 });

  return (
    <Link to={`/shop?category=${cat.slug}`} className="group block" data-cursor-hover>
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-beige shadow-card">
        <ImageWithFallback
          src={cat.image}
          alt={cat.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-900 ease-luxury group-hover:scale-[1.15]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brown/70 via-brown/0 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="font-heading text-sm text-white sm:text-base">{cat.name}</p>
          <p className="text-[11px] text-white/70">{loading ? ' ' : `${meta.total} Designs`}</p>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-all duration-500 group-hover:ring-gold/50" />
      </div>
    </Link>
  );
}

export default function FeaturedCategories() {
  const { visibleCategories } = useCategories();
  const featured = visibleCategories.slice(0, 6);

  return (
    <section className="container-luxury py-20 lg:py-28">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="eyebrow">Curated For You</p>
        <h2 className="mt-3 font-heading text-3xl text-brown sm:text-4xl">Shop by Category</h2>
      </Reveal>

      <StaggerGroup className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" staggerDelay={0.08}>
        {featured.map((cat) => (
          <motion.div key={cat.id} variants={staggerItem}>
            <CategoryTile cat={cat} />
          </motion.div>
        ))}
      </StaggerGroup>
    </section>
  );
}
