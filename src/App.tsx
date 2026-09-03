import { useEffect, useState } from 'react';
import ReportSections from './ReportSections';
import HeroScore from './HeroScore';
import { TextAnimate } from '@/components/ui/text-animate';
import './hero-score.css';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';
import { CtaWithTextMarquee } from '@/components/ui/cta-with-text-marquee';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4';

// The gap-card overview section (#gaps) was removed, so the hero's secondary
// button targets the first finding instead — same destination the closing CTA
// uses. Pointing at a deleted id would scroll nowhere, silently.
const REPORT_URL = '#s1';
const CALL_URL = 'mailto:hello@nextbase.co?subject=SpeechYou%20growth%20report';

export default function App() {
  const [showFab, setShowFab] = useState(false);

  // Reveal the persistent booking CTA once the hero's own buttons scroll away,
  // so there is never a long stretch of report with no way to book.
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="w-full">
      <section className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src={BG_VIDEO}
      />

      {/* legibility scrim: the hero copy sits on live video */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/40 pointer-events-none" />

      {/* ---------------- hero content ---------------- */}
      <div className="absolute bottom-0 left-0 right-0 z-20 site-pad pb-14 sm:pb-24">
        {/* single column now — the score lives in the headline, so the old
            two-column split (copy | cards) has no second child to balance */}
        <div className="max-w-3xl">
        <div className="liquid-glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-white/80 text-xs font-medium tracking-wide">
            Growth audit &middot; speechyou.com
          </span>
        </div>

        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight tracking-tight mb-4">
          {/* accessible={false}: the visible words already sit inside the
              <h1>, so TextAnimate's sr-only copy + aria-label made screen
              readers announce the headline twice. */}
          {/* The three lines are broken deliberately, not left to chance:
              "...70 point / growth gap. We found / where it is coming from."
              The breaks only apply from lg up, where the longest line
              (measured 686px at 60px type) clears the 768px column. Below
              that the type shrinks but the column shrinks faster, so the
              line no longer fits and the text is left to wrap on its own
              rather than overflow. */}
          <TextAnimate
            as="span"
            by="word"
            animation="blurInUp"
            once
            accessible={false}
            duration={0.8}
            className="inline"
            segmentClassName="inline-block whitespace-pre"
          >
            SpeechYou has a
          </TextAnimate>{' '}
          <HeroScore value={70} denominator={false} />{' '}
          <TextAnimate
            as="span"
            by="word"
            animation="blurInUp"
            once
            accessible={false}
            duration={0.8}
            delay={0.35}
            className="inline"
            segmentClassName="inline-block whitespace-pre"
          >
            point
          </TextAnimate>{' '}
          <br className="hidden lg:inline" />
          <TextAnimate
            as="span"
            by="word"
            animation="blurInUp"
            once
            accessible={false}
            duration={0.8}
            delay={0.45}
            className="inline"
            segmentClassName="inline-block whitespace-pre"
          >
            growth gap. We found
          </TextAnimate>{' '}
          <br className="hidden lg:inline" />
          <TextAnimate
            as="span"
            by="word"
            animation="blurInUp"
            once
            accessible={false}
            duration={0.8}
            delay={0.65}
            className="inline"
            segmentClassName="inline-block whitespace-pre"
          >
            where it is coming from.
          </TextAnimate>
        </h1>

        {/* Summary carries the actual findings, not a description of the
            report. Every figure here is read from finding-scores.json. */}
        <p className="text-white/75 text-[13px] leading-relaxed mb-7 max-w-lg">
          SpeechYou already has a product people need. But potential customers
          are missing it at three critical moments: when they search for
          format-specific transcription tools, when they ask for
          recommendations in public communities, and when they reach the
          signup decision.
        </p>

        {/* "Book a call" is the commercial action, so it takes the light
            (primary) pill; reading the report is the secondary path. */}
        <div className="flex flex-wrap items-center gap-3">
          <LiquidMetalButton
            label="Book a Call"
            variant="light"
            width={186}
            href={CALL_URL}
          />
          <LiquidMetalButton
            label="Read the Report"
            variant="dark"
            width={186}
            href={REPORT_URL}
          />
        </div>

        <p className="text-white/45 text-[13px] mt-3.5">
          Let us handle it for you &mdash; no obligation, no pitch deck.
        </p>
        </div>
      </div>
      </section>

      <ReportSections />

      <CtaWithTextMarquee />

      {/* Persistent booking CTA. Between the hero CTA and the plan CTA at the
          very bottom there is a ~4,500px stretch with no way to book, which is
          exactly where a convinced reader decides. Appears after the hero. */}
      <a
        href={CALL_URL}
        aria-label="Book a call — let us handle it for you"
        className={[
          'fixed z-[95] right-4 sm:right-6',
          'bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]',
          'sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))]',
          'inline-flex items-center gap-2 rounded-full',
          'px-[18px] py-3 min-h-[44px]',
          'bg-white text-[#0B0C10] no-underline',
          'text-sm font-medium tracking-[-0.005em]',
          'shadow-[0_1px_2px_rgba(0,0,0,.2),0_10px_30px_rgba(0,0,0,.35)]',
          'transition-all duration-300 ease-out hover:bg-[#EDEDF2]',
          showFab
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-2 pointer-events-none',
        ].join(' ')}
      >
        Book a call
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="w-4 h-4">
          <path d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5" stroke="currentColor"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
