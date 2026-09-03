import { memo, useEffect, useRef } from 'react';
import { REPORT_HTML } from './report.generated';
import './report.css';

/**
 * Hosts the generated report markup and re-implements its behaviour as an
 * effect. The markup ships as a string (source of truth is the Notion-driven
 * generator), so the interaction layer lives here rather than in an inline
 * <script>, which React would not execute.
 *
 * memo() is load-bearing, not an optimisation. This component injects its DOM
 * via dangerouslySetInnerHTML, and the reveal-on-scroll state (.in / .rise)
 * lives on those injected nodes as classes React knows nothing about. Any
 * parent re-render — App's scroll handler toggling the sticky CTA, for
 * instance — re-runs this render, React replaces the whole injected subtree,
 * and every revealed element snaps back to opacity:0. That made all 8 gap
 * cards disappear the moment the reader scrolled to them. Props are empty and
 * REPORT_HTML is a module constant, so memo pins the subtree for good.
 */
function ReportSections() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const openFinding = (secId: string, push: boolean) => {
      const sec = document.getElementById(secId);
      const det = document.getElementById(secId + 'd') as HTMLDetailsElement | null;
      if (!sec || !det) return;
      det.open = true;
      sec.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      det.classList.remove('flash');
      void det.offsetWidth; // restart the animation
      det.classList.add('flash');
      window.setTimeout(() => det.classList.remove('flash'), 1600);
      if (push) history.replaceState(null, '', '#' + secId);
    };

    // overview row -> jump to + open the matching finding
    const rows = Array.from(root.querySelectorAll<HTMLButtonElement>('.ovc'));
    const onRow = (e: Event) => {
      const t = (e.currentTarget as HTMLElement).dataset.target;
      if (t) openFinding(t, true);
    };
    rows.forEach((r) => r.addEventListener('click', onRow));

    // count-up for any score numerals
    const count = (node: Element, to: number, dur: number) => {
      if (reduce) {
        node.textContent = String(to);
        return;
      }
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        node.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observers: IntersectionObserver[] = [];
    const timers: number[] = [];

    /* Reveal an element — shared by the scroll observer and the safety pass
       below so the two can never disagree about what "visible" means. */
    const reveal = (el: Element) => {
      el.classList.add('in');
      if (el.id === 'ovlist') {
        Array.from(el.children).forEach((c, i) => {
          (c as HTMLElement).style.transitionDelay = `${i * 55}ms`;
          c.classList.add('rise');
        });
      }
    };

    const dial = root.querySelector('.dial');
    if (dial) {
      const io = new IntersectionObserver(
        (es, o) =>
          es.forEach((e) => {
            if (!e.isIntersecting) return;
            dial.classList.add('lit');
            dial.querySelectorAll<HTMLElement>('[data-count]').forEach((n, i) =>
              window.setTimeout(() => count(n, Number(n.dataset.count), 1200), i * 280),
            );
            dial
              .querySelectorAll<HTMLElement>('[data-fill]')
              .forEach((m) => m.style.setProperty('--w', m.dataset.fill + '%'));
            o.disconnect();
          }),
        { threshold: 0.45 },
      );
      io.observe(dial);
      observers.push(io);
    }

    // reveal-on-scroll for sections, charts and the overview meters
    const rv = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            rv.unobserve(e.target);
          }
        }),
      { threshold: 0.05, rootMargin: '0px 0px -30px 0px' },
    );
    root.querySelectorAll('.rv, .sec, .viz, #ovlist').forEach((el) => {
      el.classList.add('rv');
      rv.observe(el);
    });

    /* Content must never depend on an observer surviving to become visible.
       Under React StrictMode the effect runs, cleans up (disconnecting the
       observers) and re-runs — which left all 19 .rv elements parked at
       opacity:0 and the whole gap-card grid invisible. Anything already in
       or near the viewport is revealed synchronously here, and a bounded
       failsafe reveals the rest shortly after, so a dropped observer can
       only cost the animation, never the content. */
    root.querySelectorAll('.rv').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.25) reveal(el);
    });
    const failsafe = window.setTimeout(() => {
      root.querySelectorAll('.rv:not(.in)').forEach(reveal);
    }, 2000);
    timers.push(failsafe);

    observers.push(rv);

    // deep link: /#s4 opens that finding
    if (location.hash) {
      const id = location.hash.slice(1).replace(/d$/, '');
      requestAnimationFrame(() => openFinding(id, false));
    }

    return () => {
      rows.forEach((r) => r.removeEventListener('click', onRow));
      observers.forEach((o) => o.disconnect());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return (
    <div
      ref={ref}
      className="report-root"
      dangerouslySetInnerHTML={{ __html: REPORT_HTML }}
    />
  );
}

export default memo(ReportSections);
