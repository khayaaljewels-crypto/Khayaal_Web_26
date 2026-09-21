import { Link, useLocation } from 'react-router-dom';
import { STOREFRONT_CATEGORIES } from '@/data/storefrontCategories';

export default function CategoryNavigation() {
  const { pathname } = useLocation();

  return (
    <section className="relative z-40 h-16 border-b border-[#E6DED4] bg-bg">
      <div className="container-luxury h-full">
        <nav
          aria-label="Jewellery categories"
          className="no-scrollbar flex h-full max-w-full touch-pan-x flex-nowrap items-center justify-start gap-2.5 overflow-x-auto overscroll-x-contain scroll-smooth whitespace-nowrap lg:justify-center"
        >
          {STOREFRONT_CATEGORIES.map((category) => {
            const isActive = pathname === `/collections/${category.slug}`;
            return (
              <div key={category.slug} className="shrink-0">
                <Link
                  to={`/collections/${category.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex h-11 items-center justify-center rounded-full border bg-bg px-4 text-[11px] font-medium uppercase leading-none tracking-[0.12em] transition-colors duration-200 sm:px-5 ${
                    isActive
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-[#E6DED4] text-brown hover:border-gold hover:bg-[#F6F0E9] hover:text-gold'
                  } focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`}
                >
                  {category.name}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
