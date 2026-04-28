import { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
}

export function StarField() {
  const stars = useMemo<Star[]>(() =>
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: (i * 7.3 + 13.7) % 100,
      y: (i * 11.7 + 5.3) % 100,
      size: ((i * 3.1) % 1.8) + 0.4,
      delay: (i * 0.29) % 5,
      duration: 2.5 + (i * 0.61) % 3,
      opacity: 0.3 + (i * 0.17) % 0.7,
    })), []);

  return (
    <div className="starfield" aria-hidden="true">
      {stars.map(s => (
        <span
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
