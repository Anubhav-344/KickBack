// src/features/cafe/components/CafeHero.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface CafeHeroProps {
  images: string[];
}

export default function CafeHero({ images }: CafeHeroProps) {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative h-48 overflow-hidden">
      {images.length === 0 ? (
        <div className="h-full bg-gradient-to-b from-bg-raised to-bg-surface" />
      ) : (
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${active * 100}%)` }}
        >
          {images.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
      )}

      {/* CafeLandingPage is reached FROM Discovery now (not the root page
          it used to be), so it needs its own way back — overlaid on the
          hero since there's no dedicated header row above it. */}
      <button
        onClick={() => navigate("/")}
        aria-label="Back to Discovery"
        className="absolute top-3 left-3 w-8 h-8 rounded-full bg-bg-base/70 backdrop-blur-sm flex items-center justify-center"
      >
        <ArrowLeft size={16} className="text-text-primary" />
      </button>

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
