import { useState } from 'react';
import Reveal from '@/components/animations/Reveal';
import GoldParticles from '@/components/animations/GoldParticles';
import { HiOutlineArrowRight } from 'react-icons/hi2';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="relative overflow-hidden bg-[#2c2019] py-24 lg:py-32">
      <GoldParticles />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,134,74,0.18),transparent_60%)]" />

      <div className="container-luxury relative text-center">
        <Reveal>
          <span className="font-script text-4xl text-gold-hover sm:text-5xl">Khayaal Circle</span>
          <h2 className="mx-auto mt-4 max-w-xl font-heading text-3xl text-white sm:text-4xl">
            Be first to know about new drops &amp; private previews
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
            Join a community that values timeless design — occasional emails, always worth opening.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-md">
          {submitted ? (
            <p className="text-sm text-gold-hover">You're in. Welcome to the circle.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 pl-6">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-medium tracking-wide text-white transition-transform hover:scale-105"
              >
                Join <HiOutlineArrowRight />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
