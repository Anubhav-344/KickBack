// src/features/booking/components/SuccessBurst.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";

interface Particle {
  angle: number;
  distance: number;
  size: number;
  delay: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: 55 + Math.random() * 75,
    size: 4 + Math.random() * 5,
    delay: Math.random() * 0.15,
  }));
}

/**
 * A one-shot burst of small green flares radiating outward and fading —
 * deliberately restrained (theme-matched green, not rainbow confetti) so it
 * reads as "success" within KickBack's visual language rather than a
 * generic stock celebration effect. Plays once on mount, no loop.
 */
export default function SuccessBurst() {
  const particles = useMemo(() => generateParticles(26), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible">
      {particles.map((p, i) => {
        const x = Math.cos(p.angle) * p.distance;
        const y = Math.sin(p.angle) * p.distance;
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full bg-state-available"
            style={{ width: p.size, height: p.size, boxShadow: "0 0 6px rgba(61,220,140,0.7)" }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.9, delay: p.delay, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}
