import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2';
import Reveal from '@/components/animations/Reveal';
import GoldButton from '@/components/buttons/GoldButton';

const PRINCIPLES = [
  {
    number: '01',
    title: 'Thoughtful by design',
    copy: 'Every detail, thoughtfully considered.',
  },
  {
    number: '02',
    title: 'Made for the moment',
    copy: 'From a quiet personal milestone to a room full of celebration, jewellery gives a moment something to hold on to.',
  },
  {
    number: '03',
    title: 'Elegance that endures',
    copy: 'We look to the richness of Indian adornment through a contemporary lens—so each choice feels lasting, never fleeting.',
  },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brown text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_15%_20%,#d8b27a_0,transparent_28%),radial-gradient(circle_at_85%_75%,#b8864a_0,transparent_25%)]" />

        <div className="container-luxury relative z-10">
          <div className="max-w-5xl pb-20 pt-32 sm:pb-28 sm:pt-40 lg:pb-36 lg:pt-48">
            <Reveal direction="none">
              <p className="text-xl font-medium tracking-wide text-gold-hover sm:text-2xl lg:text-3xl">
                The House of Khayaal
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-5 font-heading text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
                Our Story
              </h1>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-8 max-w-3xl space-y-4 border-l border-gold/50 pl-5 text-base leading-8 text-white/75 sm:pl-7 sm:text-lg">
                <p>
                  Khayaal began with a simple thought shared between two
                  engineers — and a dream we chose to make real.
                </p>

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
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                Khayaal is an expression of the thoughts, memories and little
                celebrations that make a life feel entirely your own.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Meaning */}
      <section
        id="story"
        className="scroll-mt-28 bg-bg py-20 sm:py-24 lg:py-32"
      >
        <div className="container-luxury grid gap-10 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">A thought, made tangible</p>

            <h2 className="mt-4 max-w-md font-heading text-4xl leading-tight text-brown sm:text-5xl">
              The meaning of{' '}
              <span className="font-script text-gold">
                Khayaal
              </span>
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="lg:col-span-6 lg:col-start-7"
          >
            <p className="text-lg leading-8 text-text/80">
              Khayaal is a word held close in our language of home — a
              thought, a feeling, a tender remembrance.
            </p>

            <p className="mt-5 leading-8 text-text/65">
              We created Khayaal around that feeling. To us, jewellery is
              never merely an ornament. It can hold the warmth of a
              relationship, mark a beginning, carry a memory, or become the
              piece you reach for when you want to feel most like yourself.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-beige py-20 sm:py-24 lg:py-32">
        <div className="container-luxury grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <div className="relative overflow-hidden bg-brown p-8 text-white sm:p-12">
              <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_25%_25%,rgba(216,178,122,.35)_0,transparent_22%)]" />

              <div className="relative">
                <HiOutlineSparkles className="text-3xl text-gold-hover" />

                <p className="mt-20 max-w-md font-heading text-3xl leading-snug sm:mt-28 sm:text-4xl">
                  “The pieces we choose become part of how we remember.”
                </p>

                <div className="mt-12">
                  <div className="mb-4 h-px w-10 bg-gold" />

                  <span className="text-xs uppercase tracking-[0.25em] text-gold-hover">
                    Khayaal philosophy
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal
            delay={0.1}
            className="flex flex-col justify-center"
          >
            <p className="eyebrow">Jewellery with meaning</p>

            <h2 className="mt-4 max-w-xl font-heading text-4xl leading-tight text-brown sm:text-5xl">
              Designed with intention, chosen with feeling.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-text/70">
              Our philosophy is simple: beautiful jewellery should carry
              more than shine. It should feel considered—from the first line
              of its design to the finishing touches that make it a pleasure
              to wear.
            </p>

            <p className="mt-4 max-w-xl leading-8 text-text/70">
              Khayaal brings together a love for Indian heritage and a
              lighter, modern sense of elegance. The result is jewellery for
              the days that matter, and the everyday moments that quietly
              become part of your story.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-bg py-20 sm:py-24 lg:py-32">
        <div className="container-luxury">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">The Khayaal approach</p>

            <h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">
              Care in every considered detail.
            </h2>
          </Reveal>

          <div className="mt-12 grid border-t border-border sm:mt-16 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 0.1}
                className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:px-9 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <span className="text-sm tracking-[0.2em] text-gold">
                  {principle.number}
                </span>

                <h3 className="mt-6 font-heading text-2xl text-brown">
                  {principle.title}
                </h3>

                <p className="mt-3 max-w-sm leading-7 text-text/65">
                  {principle.copy}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Expression */}
      <section className="bg-brown py-20 text-white sm:py-24 lg:py-32">
        <div className="container-luxury grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow !text-gold-hover">
              For every expression of you
            </p>

            <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">
              Made for those who wear their stories their own way.
            </h2>
          </Reveal>

          <Reveal
            delay={0.1}
            className="lg:col-span-4 lg:col-start-9"
          >
            <p className="leading-8 text-white/70">
              Khayaal is for anyone who chooses jewellery as a form of
              self-expression: to honour a bond, to celebrate a chapter, or
              simply to bring a little more beauty into an ordinary day.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-bg py-20 sm:py-24 lg:py-32">
        <div className="container-luxury text-center">
          <Reveal className="mx-auto max-w-3xl">
            <p className="eyebrow">Our vision</p>

            <h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">
              To make every Khayaal worth keeping.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-text/70">
              As Khayaal grows, our vision remains rooted in meaningful
              design — creating jewellery that feels considered, versatile,
              and beautifully relevant to the way you live today. With care
              and quality at every step, we create pieces that stay close,
              long after the moment has passed.
            </p>

            <GoldButton
              to="/shop"
              icon={HiOutlineArrowRight}
              className="mt-9"
            >
              Explore the collection
            </GoldButton>

            <p className="mt-8 text-sm text-text/55">
              Or{' '}
              <Link
                to="/contact"
                className="border-b border-gold pb-0.5 text-brown transition-colors hover:text-gold"
              >
                get in touch
              </Link>
              —we would love to hear your story.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}