import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineSparkles,
} from 'react-icons/hi2';
import Reveal from '@/components/animations/Reveal';
import GoldButton from '@/components/buttons/GoldButton';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Thoughtful by design',
    copy: 'Every detail is considered with intention, from the first idea to the final piece.',
  },
  {
    number: '02',
    title: 'Made for the moment',
    copy: 'Jewellery has a way of giving meaning to celebrations, milestones and the little moments in between.',
  },
  {
    number: '03',
    title: 'Elegance that endures',
    copy: 'Inspired by the richness of Indian adornment, interpreted through a refined contemporary lens.',
  },
];

export default function About() {
  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-brown text-white">
        {/* Decorative lines */}
        <div className="pointer-events-none absolute inset-y-0 left-[8%] hidden w-px bg-white/10 lg:block" />
        <div className="pointer-events-none absolute inset-y-0 right-[8%] hidden w-px bg-white/10 lg:block" />

        <div className="container-luxury relative">
          <div className="grid min-h-[680px] items-end gap-12 pb-20 pt-36 lg:grid-cols-12 lg:pb-28 lg:pt-48">
            {/* Small editorial label */}
            <Reveal
              direction="none"
              className="lg:col-span-1"
            >
              <div className="hidden lg:block">
                <div className="h-16 w-px bg-gold" />
                <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">
                  Est. with intention
                </p>
              </div>
            </Reveal>

            {/* Main hero */}
            <div className="lg:col-span-9">
              <Reveal direction="none">
                <p className="text-sm uppercase tracking-[0.3em] text-gold-hover sm:text-base">
                  The House of Khayaal
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="mt-5 max-w-5xl font-heading text-5xl leading-[0.98] sm:text-6xl lg:text-8xl">
                  Our
                  <span className="block pl-8 font-script font-normal text-gold-hover sm:pl-16">
                    Story
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-10 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
                  Khayaal began with a thought shared between two engineers, and a dream we decided to make real.
                  Born from countless ideas, excitement, nervousness, and a lot of heart, Khayaal is our little piece of imagination brought to life — created to be a part of your beautiful moments.
                </p>
              </Reveal>
            </div>

            {/* Bottom mark */}
            <Reveal
              delay={0.22}
              className="lg:col-span-2 lg:flex lg:justify-end"
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/45">
                <span className="h-px w-8 bg-gold/70" />
                Khayaal
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          OUR STORY
      ========================================================= */}
      <section
        id="story"
        className="scroll-mt-24 bg-bg py-20 sm:py-28 lg:py-36"
      >
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Left */}
            <Reveal className="lg:col-span-4">
              <p className="eyebrow">Where it began</p>

              <h2 className="mt-5 max-w-sm font-heading text-4xl leading-tight text-brown sm:text-5xl">
                A simple thought.
                <span className="block font-script font-normal text-gold">
                  A beautiful beginning.
                </span>
              </h2>

              <div className="mt-8 hidden h-px w-20 bg-gold lg:block" />
            </Reveal>

            {/* Right story */}
            <Reveal
              delay={0.12}
              className="lg:col-span-7 lg:col-start-6"
            >
              <div className="border-t border-border pt-8">
                <p className="font-heading text-2xl leading-relaxed text-brown sm:text-3xl">
                  Khayaal began with a simple thought shared between two
                  engineers — and a dream we chose to make real.
                </p>

                <div className="mt-8 space-y-6 leading-8 text-text/65">
                  <p>
                    Born from countless ideas, quiet excitement, a little
                    nervousness, and a whole lot of heart, Khayaal is a small
                    piece of our imagination brought to life.
                  </p>

                  <p>
                    Every detail carries a part of our journey, created with
                    the hope that Khayaal becomes a part of yours — celebrating
                    the beautiful moments, little joys, and memories that make
                    life truly your own.
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <span className="text-xs uppercase tracking-[0.25em] text-gold">
                    The beginning
                  </span>
                  <span className="h-px w-16 bg-border" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          MEANING
      ========================================================= */}
      <section className="bg-beige py-20 sm:py-28 lg:py-36">
        <div className="container-luxury">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Quote panel */}
            <Reveal>
              <div className="relative overflow-hidden bg-brown px-7 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/3 -translate-y-1/3 rounded-full border border-gold/30" />
                <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-1/3 translate-y-1/3 rounded-full border border-white/10" />

                <div className="relative">
                  <HiOutlineSparkles className="text-3xl text-gold-hover" />

                  <p className="mt-10 font-heading text-3xl leading-snug sm:text-4xl">
                    “A thought, a feeling, a tender remembrance.”
                  </p>

                  <div className="mt-10">
                    <span className="text-xs uppercase tracking-[0.25em] text-gold-hover">
                      The meaning of Khayaal
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Meaning */}
            <Reveal delay={0.12}>
              <p className="eyebrow">The name</p>

              <h2 className="mt-5 font-heading text-4xl leading-tight text-brown sm:text-5xl">
                More than a name.
                <span className="block font-script font-normal text-gold">
                  A feeling.
                </span>
              </h2>

              <div className="mt-7 max-w-xl space-y-5 leading-8 text-text/70">
                <p>
                  Khayaal is a word held close in our language of home — a
                  thought, a feeling, a tender remembrance.
                </p>

                <p>
                  We created Khayaal around that feeling. To us, jewellery is
                  never merely an ornament. It can hold the warmth of a
                  relationship, mark a beginning, carry a memory, or simply
                  become the piece you reach for when you want to feel most
                  like yourself.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          PHILOSOPHY
      ========================================================= */}
      <section className="bg-bg py-20 sm:py-28 lg:py-36">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-20">
            <Reveal className="lg:col-span-3">
              <p className="eyebrow">Our philosophy</p>
            </Reveal>

            <Reveal
              delay={0.1}
              className="lg:col-span-8 lg:col-start-5"
            >
              <div className="border-y border-border py-10 sm:py-14">
                <p className="font-heading text-3xl leading-relaxed text-brown sm:text-4xl lg:text-5xl">
                  We believe the most beautiful pieces are the ones that
                  become part of your life.
                </p>

                <p className="mt-8 max-w-2xl leading-8 text-text/65">
                  That belief shapes everything we do. From design and
                  selection to the experience of discovering a piece, we aim
                  to keep Khayaal thoughtful, refined and personal.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPLES
      ========================================================= */}
      <section className="bg-beige py-20 sm:py-28 lg:py-36">
        <div className="container-luxury">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">What guides us</p>

            <h2 className="mt-5 font-heading text-4xl leading-tight text-brown sm:text-5xl">
              Three ideas at the heart of Khayaal.
            </h2>
          </Reveal>

          <div className="mt-14 grid border-t border-border lg:mt-20 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 0.1}
                className="group border-b border-border py-9 lg:border-b-0 lg:border-r lg:px-9 lg:py-12 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm tracking-[0.25em] text-gold">
                    {principle.number}
                  </span>

                  <span className="h-px w-10 bg-border transition-all duration-300 group-hover:w-16 group-hover:bg-gold" />
                </div>

                <h3 className="mt-12 font-heading text-2xl text-brown sm:text-3xl">
                  {principle.title}
                </h3>

                <p className="mt-4 max-w-sm leading-7 text-text/65">
                  {principle.copy}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          EXPRESSION
      ========================================================= */}
      <section className="bg-brown py-20 text-white sm:py-28 lg:py-36">
        <div className="container-luxury">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
            <Reveal className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.3em] text-gold-hover">
                Jewellery with meaning
              </p>

              <h2 className="mt-6 max-w-4xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                Designed to become part of
                <span className="font-script font-normal text-gold-hover">
                  {' '}
                  your story.
                </span>
              </h2>
            </Reveal>

            <Reveal
              delay={0.12}
              className="lg:col-span-4"
            >
              <p className="leading-8 text-white/65">
                Khayaal is for every expression of you — to honour a bond,
                celebrate a chapter, or simply bring a little more beauty into
                an ordinary day.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================
          VISION / CTA
      ========================================================= */}
      <section className="bg-bg py-20 sm:py-28 lg:py-36">
        <div className="container-luxury">
          <Reveal className="mx-auto max-w-4xl text-center">
            <p className="eyebrow">Looking ahead</p>

            <h2 className="mt-5 font-heading text-4xl leading-tight text-brown sm:text-5xl lg:text-6xl">
              To make every
              <span className="block font-script font-normal text-gold">
                Khayaal
              </span>
              worth keeping.
            </h2>

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-text/65">
              As Khayaal grows, our vision remains rooted in meaningful
              design — creating jewellery that feels considered, versatile
              and beautifully relevant to the way you live today.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <GoldButton
                to="/shop"
                icon={HiOutlineArrowRight}
              >
                Explore the collection
              </GoldButton>

              <Link
                to="/contact"
                className="text-sm text-brown transition-colors hover:text-gold"
              >
                Get in touch
                <span className="ml-2">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}