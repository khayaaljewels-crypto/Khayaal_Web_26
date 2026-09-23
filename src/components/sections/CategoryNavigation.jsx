import { Link, useLocation } from 'react-router-dom';
import { STOREFRONT_CATEGORIES } from '@/data/storefrontCategories';

export default function CategoryNavigation() {
  const { pathname } = useLocation();

  return (
    <section className="relative z-40 h-15 border-b border-border bg-bg">
      <div className="container-luxury h-full">
        <nav
          aria-label="Jewellery categories"
          className="no-scrollbar flex h-full max-w-full touch-pan-x flex-nowrap items-center justify-start gap-2 overflow-x-auto overscroll-x-contain whitespace-nowrap lg:justify-center"
        >
          {STOREFRONT_CATEGORIES.map((category) => {
            const isActive = pathname === `/collections/${category.slug}`;
            return (
              <div key={category.slug} className="shrink-0">
                <Link
                  to={`/collections/${category.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex h-9 items-center justify-center rounded-full border bg-bg px-3.5 text-[10px] font-medium uppercase leading-none tracking-[0.14em] transition-colors duration-200 ease-out sm:px-4 ${
                    isActive
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-border text-brown hover:border-gold hover:bg-beige/50 hover:text-gold'
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
