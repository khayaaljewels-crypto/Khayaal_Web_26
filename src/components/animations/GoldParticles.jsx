const PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
  id: i,
  left: `${(i * 41) % 100}%`,
  top: `${(i * 67) % 100}%`,
  size: 2 + (i % 4),
  duration: 6 + (i % 5),
  delay: (i % 6) * 0.6,
}));

export default function GoldParticles({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-gold-hover"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite`,
            boxShadow: '0 0 8px 1px rgba(198,156,109,0.6)',
          }}
        />
      ))}
    </div>
  );
}
