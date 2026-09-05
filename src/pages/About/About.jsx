import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2';
import Reveal from '@/components/animations/Reveal';
import GoldButton from '@/components/buttons/GoldButton';

const PRINCIPLES = [
  { number: '01', title: 'Thoughtful by design', copy: 'Every detail is considered for the way a piece looks, feels, and lives with you.' },
  { number: '02', title: 'Made for the moment', copy: 'From a quiet personal milestone to a room full of celebration, jewellery gives a moment something to hold on to.' },
  { number: '03', title: 'Elegance that endures', copy: 'We look to the richness of Indian adornment through a contemporary lens—so each choice feels lasting, never fleeting.' },
];

export default function About() {
  return (
    <>
      <section className="relative overflow-hidden bg-brown pb-20 pt-36 text-white sm:pb-28 sm:pt-44 lg:pb-36 lg:pt-52">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_12%_20%,#d8b27a_0,transparent_26%),radial-gradient(circle_at_85%_70%,#b8864a_0,transparent_22%)]" />
        <div className="absolute -right-20 top-16 h-72 w-72 rounded-full border border-gold/30 sm:h-112 sm:w-112" />
        <div className="absolute -right-8 top-24 h-56 w-56 rounded-full border border-white/10 sm:h-88 sm:w-88" />
        <div className="container-luxury relative z-10">
          <Reveal direction="none"><p className="eyebrow !text-gold-hover">The House of Khayaal</p></Reveal>
          <Reveal delay={0.08}><h1 className="mt-5 max-w-4xl font-heading text-5xl leading-[1.05] sm:text-6xl lg:text-8xl">Our Story</h1></Reveal>
          <Reveal delay={0.16}><p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Khayaal is an expression of the thoughts, memories and little celebrations that make a life feel entirely your own.</p></Reveal>
        </div>
      </section>

      <section id="story" className="scroll-mt-28 bg-bg py-20 sm:py-28 lg:py-36">
        <div className="container-luxury grid items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">A thought, made tangible</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">The meaning of <span className="font-script text-5xl text-gold sm:text-6xl">Khayaal</span></h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7">
            <p className="text-lg leading-8 text-text/80">Khayaal is a word held close in the languages of home: a thought, a care, a tender remembrance. It is the feeling behind a gesture that says, <em>this made me think of you.</em></p>
            <p className="mt-5 leading-8 text-text/65">We created Khayaal around that feeling. Jewellery is never merely an ornament. It can hold the warmth of a relationship, mark a beginning, remember a promise, or become the piece you reach for when you want to feel most like yourself.</p>
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden bg-beige py-20 sm:py-28 lg:py-36">
        <div className="container-luxury grid gap-12 lg:grid-cols-2 lg:gap-24">
          <Reveal className="relative min-h-96 overflow-hidden bg-brown p-8 sm:p-12">
            <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_30%_35%,rgba(216,178,122,.4)_0,transparent_18%),radial-gradient(circle_at_68%_62%,rgba(255,255,255,.12)_0,transparent_25%)]" />
            <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full border border-gold/40" />
            <div className="absolute -bottom-12 -right-8 h-56 w-56 rounded-full border border-white/20" />
            <div className="relative flex h-full min-h-80 flex-col justify-between text-white">
              <HiOutlineSparkles className="text-3xl text-gold-hover" />
              <p className="max-w-sm font-heading text-3xl leading-snug sm:text-4xl">“The pieces we choose become part of how we remember.”</p>
              <span className="text-xs tracking-[0.28em] text-gold-hover uppercase">Khayaal philosophy</span>
            </div>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-col justify-center">
            <p className="eyebrow">Jewellery with meaning</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">Designed with intention, chosen with feeling.</h2>
            <p className="mt-6 leading-8 text-text/70">Our philosophy is simple: beautiful jewellery should carry more than shine. It should feel considered—from the first line of its design to the finishing touches that make it a pleasure to wear.</p>
            <p className="mt-4 leading-8 text-text/70">Khayaal brings together a love for Indian heritage and a lighter, modern sense of elegance. The result is jewellery for the days that matter, and the everyday moments that quietly become part of your story.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-bg py-20 sm:py-28 lg:py-36">
        <div className="container-luxury">
          <Reveal className="max-w-2xl"><p className="eyebrow">The Khayaal approach</p><h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">Care in every considered detail.</h2></Reveal>
          <div className="mt-12 grid border-t border-border sm:mt-16 lg:grid-cols-3">
            {PRINCIPLES.map((principle, index) => (
              <Reveal key={principle.number} delay={index * 0.1} className="border-b border-border py-8 lg:border-b-0 lg:border-r lg:px-9 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
                <span className="text-sm tracking-[0.2em] text-gold">{principle.number}</span><h3 className="mt-8 font-heading text-2xl text-brown">{principle.title}</h3><p className="mt-3 max-w-sm leading-7 text-text/65">{principle.copy}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brown py-20 text-white sm:py-28 lg:py-36">
        <div className="container-luxury grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7"><p className="eyebrow !text-gold-hover">For every expression of you</p><h2 className="mt-4 max-w-3xl font-heading text-4xl leading-tight sm:text-5xl">Made for those who wear their stories their own way.</h2></Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:col-start-9"><p className="leading-8 text-white/70">Khayaal is for anyone who chooses jewellery as a form of self-expression: to honour a bond, to celebrate a chapter, or simply to bring a little more beauty into an ordinary day.</p></Reveal>
        </div>
      </section>

      <section className="bg-bg py-20 sm:py-28 lg:py-36">
        <div className="container-luxury text-center"><Reveal className="mx-auto max-w-3xl"><p className="eyebrow">Our vision</p><h2 className="mt-4 font-heading text-4xl leading-tight text-brown sm:text-5xl">To be part of the moments you never want to forget.</h2><p className="mx-auto mt-6 max-w-2xl leading-8 text-text/70">As Khayaal grows, our vision remains rooted in meaningful design: creating jewellery that connects heritage with the present, earns your trust through care and quality, and stays close long after the occasion has passed.</p><GoldButton to="/shop" icon={HiOutlineArrowRight} className="mt-9">Explore the collection</GoldButton><p className="mt-8 text-sm text-text/55">Or <Link to="/contact" className="border-b border-gold pb-0.5 text-brown transition-colors hover:text-gold">get in touch</Link>—we would love to hear your story.</p></Reveal></div>
      </section>
    </>
  );
}
