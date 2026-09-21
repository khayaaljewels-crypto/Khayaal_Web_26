import { Link, useLocation } from 'react-router-dom';
import { STOREFRONT_CATEGORIES } from '@/data/storefrontCategories';

export default function CategoryNavigation() {
  const { pathname } = useLocation();

  return (
    <section className="border-y border-[#E6DED4] bg-bg pt-18 xs:pt-20 lg:pt-24">
      <div className="container-luxury">
        <nav
          aria-label="Jewellery categories"
          className="no-scrollbar flex max-w-full touch-pan-x flex-nowrap justify-start gap-2.5 overflow-x-auto overscroll-x-contain scroll-smooth whitespace-nowrap py-3.5 lg:justify-center"
        >
          {STOREFRONT_CATEGORIES.map((category) => {
            const isActive = pathname === `/collections/${category.slug}`;
            return (
              <div key={category.slug} className="shrink-0">
                <Link
                  to={`/collections/${category.slug}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`block rounded-full border bg-bg px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] transition-colors duration-200 sm:px-5 ${
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
