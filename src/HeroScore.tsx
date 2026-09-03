import { useEffect, useRef, useState } from "react";

/**
 * Headline score: counts up from 0 under a hand-drawn rule.
 *
 * The count runs in step with the headline words rather than after them, so
 * the whole line resolves as one gesture instead of two staggered events.
 *
 * The rule is a bezier through jittered points rather than a straight line,
 * so it reads as a pen stroke instead of a border. Each score gets a
 * different path — a mirrored copy reads as a graphic, two different ones
 * read as handwriting.
 */

const SQUIGGLE_A = "M 0.0 6.22 C 3.3 6.55 13.3 7.95 20.0 8.19 C 26.7 8.43 33.3 8.50 40.0 7.66 C 46.7 6.83 53.3 3.28 60.0 3.20 C 66.7 3.13 73.3 6.55 80.0 7.21 C 86.7 7.87 93.3 7.13 100.0 7.19 C 106.7 7.24 116.7 7.47 120.0 7.53";
const SQUIGGLE_B = "M 0.0 6.54 C 3.3 6.83 13.3 8.77 20.0 8.33 C 26.7 7.89 33.3 4.23 40.0 3.90 C 46.7 3.56 53.3 6.37 60.0 6.34 C 66.7 6.31 73.3 3.92 80.0 3.71 C 86.7 3.49 93.3 4.45 100.0 5.04 C 106.7 5.63 116.7 6.86 120.0 7.23";

type Props = {
  value: number;
  variant?: "now" | "to";
  duration?: number;
  delay?: number;
};

export default function HeroScore({ value, variant = "now", duration = 1100, delay = 0 }: Props) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setN(value); return; }

    const run = () => {
      if (started.current) return;
      started.current = true;
      // easeOutCubic: fast off the line, settles onto the final value
      const ease = (p: number) => 1 - Math.pow(1 - p, 3);
      window.setTimeout(() => {
        const t0 = performance.now();
        const tick = (t: number) => {
          // clamp low: rAF can fire with a timestamp from BEFORE t0 (the frame
          // was already queued when the timer set t0), which makes p negative
          // and briefly renders a negative score.
          const p = Math.min(Math.max((t - t0) / duration, 0), 1);
          setN(Math.round(value * ease(p)));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, delay);
    };

    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={`hero-score hero-score--${variant}`}>
      <span className="hero-score__num">{n}</span>
      <span className="hero-score__den">/100</span>
      <svg className="hero-score__rule" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true">
        <path d={variant === "to" ? SQUIGGLE_B : SQUIGGLE_A}
              fill="none" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}
