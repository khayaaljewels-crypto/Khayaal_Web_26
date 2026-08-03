import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { HiStar } from 'react-icons/hi2';
import { FaQuoteLeft } from 'react-icons/fa';
import Reveal from '@/components/animations/Reveal';
import { testimonials } from '@/data/testimonials';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-brown py-20 lg:py-28">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="container-luxury relative">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="eyebrow !text-gold-hover">Loved By Many</p>
          <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl">What Our Customers Say</h2>
        </Reveal>

        <div className="mt-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            autoplay={{ delay: 4500, disableOnInteraction: false }}
            pagination={{ clickable: true, el: '.testimonial-pagination' }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.id}>
                <div className="flex h-full flex-col rounded-3xl bg-white/5 p-8 backdrop-blur-sm border border-white/10">
                  <FaQuoteLeft className="text-2xl text-gold" />
                  <p className="mt-5 flex-1 text-sm leading-relaxed text-white/80">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} loading="lazy" className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="font-heading text-sm text-white">{t.name}</p>
                      <p className="text-xs text-white/50">{t.location}</p>
                    </div>
                    <div className="ml-auto flex gap-0.5 text-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <HiStar key={i} className={`text-xs ${i < Math.round(t.rating) ? '' : 'opacity-30'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="testimonial-pagination mt-8 flex justify-center gap-2 [&_.swiper-pagination-bullet]:h-1.5 [&_.swiper-pagination-bullet]:w-1.5 [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:bg-white/30 [&_.swiper-pagination-bullet-active]:w-6 [&_.swiper-pagination-bullet-active]:bg-gold [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300" />
        </div>
      </div>
    </section>
  );
}
