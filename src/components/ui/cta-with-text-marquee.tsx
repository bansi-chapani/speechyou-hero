/* CTA with vertical text marquee.
 *
 * Structure, class ladder, marquee mechanism and the rAF centre-focus opacity
 * loop are ported from 21st.dev/lyanchouss/cta-with-text-marquee. The shadcn
 * theme tokens the original assumed (bg-background / text-foreground /
 * text-muted-foreground / bg-secondary) do not exist in this project, so they
 * are mapped onto the site's own dark palette and the site's own buttons —
 * the layout and motion are the reference's, the surface is ours.
 */
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

interface VerticalMarqueeProps {
  children: React.ReactNode;
  pauseOnHover?: boolean;
  reverse?: boolean;
  className?: string;
  /** seconds for one full pass of a single copy */
  speed?: number;
}

function VerticalMarquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 30,
}: VerticalMarqueeProps) {
  return (
    <div
      className={cn('group flex flex-col overflow-hidden', className)}
      style={{ '--duration': `${speed}s` } as React.CSSProperties}
    >
      {/* two identical copies: the second backfills as the first translates
          -100%, which is what makes the loop seamless */}
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className={cn(
            'flex shrink-0 flex-col animate-marquee-vertical',
            reverse && '[animation-direction:reverse]',
            pauseOnHover && 'group-hover:[animation-play-state:paused]',
          )}
          aria-hidden={copy === 1 ? true : undefined}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

/* What we are improving — the report's own opportunity list, verbatim from
 * rendered-parts.json ("We identified several specific opportunities across:")
 * plus the two extra lanes named in the Priority Action Plan. No invented
 * lanes: every line here appears in the report above it. */
const LANES = [
  'Paid acquisition',
  'Reddit & Quora',
  'SEO / AEO / GEO',
  'Social distribution',
  'Website UX',
  'CTA and offer consistency',
  'Competitive visibility',
  'Multilingual SEO',
  'Mobile performance',
];

const CALL_URL = 'mailto:hello@nextbase.co?subject=SpeechYou%20growth%20report';

export function CtaWithTextMarquee() {
  const marqueeContainerRef = useRef<HTMLDivElement>(null);

  /* Centre-focus: each lane's opacity tracks its distance from the container's
     vertical centre, so the middle line reads as "current". Reference runs an
     unconditional rAF loop for the life of the page; this one is gated on
     visibility + prefers-reduced-motion so it costs nothing while the reader is
     4,500px up the report. Same visual result. */
  useEffect(() => {
    const container = marqueeContainerRef.current;
    if (!container) return;

    const items = () =>
      container.querySelectorAll<HTMLElement>('.marquee-item');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items().forEach((item) => (item.style.opacity = '1'));
      return;
    }

    let rafId = 0;
    let running = false;

    const updateOpacity = () => {
      const rect = container.getBoundingClientRect();
      const centre = rect.top + rect.height / 2;
      const maxDistance = rect.height / 2;
      items().forEach((item) => {
        const r = item.getBoundingClientRect();
        const distance = Math.abs(centre - (r.top + r.height / 2));
        item.style.opacity = String(
          1 - Math.min(distance / maxDistance, 1) * 0.75,
        );
      });
    };

    const tick = () => {
      updateOpacity();
      rafId = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          tick();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(rafId);
        }
      },
      { threshold: 0 },
    );
    io.observe(container);
    updateOpacity();

    return () => {
      io.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="start"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#14161d_0%,#0B0C10_55%)] site-pad py-16 sm:py-24 lg:py-28"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        {/* ---------------- left: the ask ---------------- */}
        <div className="max-w-xl">
          {/* eyebrow: the violet accent is retired, so this reads as a quiet
              white label rather than a coloured one */}
          <div className="text-[13px] font-medium tracking-wide text-white/55 mb-3">
            Next step
          </div>

          <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-5">
            Get started in a call
          </h2>

          <p className="text-white/60 text-[15px] leading-relaxed mb-8 max-w-md">
            We can run the plan above end to end.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <LiquidMetalButton
              label="Book a Call"
              variant="light"
              width={186}
              href={CALL_URL}
            />
            <LiquidMetalButton
              label="Re-read the Report"
              variant="dark"
              width={186}
              href="#s1"
            />
          </div>
        </div>

        {/* ---------------- right: what we improve ---------------- */}
        <div
          ref={marqueeContainerRef}
          className="relative h-[380px] sm:h-[460px] lg:h-[560px] flex items-center justify-center"
        >
          <div className="relative w-full h-full">
            {/* The ends dissolve with a MASK, not with two opaque gradient
                overlays. The section behind is itself a gradient
                (#14161d -> #0B0C10), so overlays painted in fixed colours can
                only match it at two heights — everywhere else they sat on it
                as a visibly lighter block (measured rgb(20,22,29) over
                rgb(17,18,24) at the top edge). Masking removes the pixels
                instead of painting over them, so whatever the section
                gradient does underneath, the fade is exact. */}
            <div
              className="w-full h-full"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 12%, #000 34%, #000 66%, rgba(0,0,0,0.35) 88%, transparent 100%)',
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 12%, #000 34%, #000 66%, rgba(0,0,0,0.35) 88%, transparent 100%)',
              }}
            >
              <VerticalMarquee speed={36} pauseOnHover className="h-full">
              {LANES.map((lane) => (
                <div
                  key={lane}
                  className="marquee-item text-white text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl font-light tracking-tight py-4 sm:py-5 lg:py-6 whitespace-nowrap"
                >
                  {lane}
                </div>
              ))}
            </VerticalMarquee>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CtaWithTextMarquee;
