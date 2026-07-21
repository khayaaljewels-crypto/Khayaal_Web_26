import Reveal from '@/components/animations/Reveal';
import GoldButton from '@/components/buttons/GoldButton';

export default function PlaceholderPage({ title, description }) {
  return (
    <section className="flex min-h-[70svh] items-center justify-center bg-bg pt-32 pb-20">
      <div className="container-luxury text-center">
        <Reveal>
          <p className="eyebrow">Khayaal Jewels</p>
          <h1 className="mt-4 font-heading text-4xl text-brown sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-text/60">
            {description ?? 'This page is being crafted with the same care as the rest of the collection — check back soon.'}
          </p>
          <div className="mt-8">
            <GoldButton to="/">Back to Home</GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
