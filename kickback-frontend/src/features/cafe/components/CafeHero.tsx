// src/features/cafe/components/CafeHero.tsx
import { useState } from "react";

interface CafeHeroProps {
  images: string[];
}

export default function CafeHero({ images }: CafeHeroProps) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="h-48 bg-gradient-to-b from-bg-raised to-bg-surface" />
    );
  }

  return (
    <div className="relative h-48 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="w-full h-full object-cover flex-shrink-0"
          />
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-2.5 right-4 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                i === active ? "bg-text-primary" : "bg-white/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
