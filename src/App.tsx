import { useEffect, useState } from 'react';
import { ChevronDown, Infinity, Menu, X } from 'lucide-react';
import ReportSections from './ReportSections';
import HeroScore from './HeroScore';
import { TextAnimate } from '@/components/ui/text-animate';
import './hero-score.css';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4';

type NavLink = {
  label: string;
  active?: boolean;
  dropdown?: boolean;
  href?: string;
};

const navLinks: NavLink[] = [
  { label: 'Overview', active: true, href: '#gaps' },
  { label: 'Findings', dropdown: true, href: '#s1' },
  { label: 'Action Plan', href: '#plan' },
  { label: 'Contact', href: 'mailto:hello@nextbase.co?subject=SpeechYou%20growth%20report' },
];

const REPORT_URL = '#gaps';
const CALL_URL = 'mailto:hello@nextbase.co?subject=SpeechYou%20growth%20report';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
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

      {/* ---------------- navbar ---------------- */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between site-pad py-5 sm:py-8">
        <div className="flex items-center gap-2 text-white font-medium text-base">
          <Infinity size={22} strokeWidth={1.5} />
          <span>Nextbase</span>
        </div>

        <div className="liquid-glass hidden md:flex items-center gap-1 rounded-xl px-2 py-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center gap-0.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                link.active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={13} className="mt-px" />}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2.5">
          <LiquidMetalButton
            label="View Report"
            variant="dark"
            width={128}
            height={40}
            fontSize={13}
            href={REPORT_URL}
          />
          <LiquidMetalButton
            label="Book a Call"
            variant="light"
            width={128}
            height={40}
            fontSize={13}
            href={CALL_URL}
          />
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="liquid-glass md:hidden text-white p-2 rounded-lg"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* ---------------- mobile menu ---------------- */}
      {menuOpen && (
        <div className="absolute top-[84px] left-[var(--site-pad)] right-[var(--site-pad)] z-30 md:hidden liquid-glass rounded-2xl p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-colors ${
                link.active
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
              {link.dropdown && <ChevronDown size={13} className="mt-px" />}
            </a>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-white/10">
            <a
              href={REPORT_URL}
              className="liquid-glass flex-1 text-center text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
            >
              View Report
            </a>
            <a
              href={CALL_URL}
              className="flex-1 text-center bg-white text-black text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/90 transition-colors"
            >
              Book a Call
            </a>
          </div>
        </div>
      )}

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
            Your growth engine is at
          </TextAnimate>{' '}
          <HeroScore value={52} />
        </h1>

        {/* Summary carries the actual findings, not a description of the
            report. Every figure here is read from finding-scores.json. */}
        <p className="text-white/75 text-[13px] leading-relaxed mb-7 max-w-lg">
          We scored 8 areas of SpeechYou&rsquo;s marketing. The product
          isn&rsquo;t the problem &mdash; distribution is. You have a presence
          on <strong className="text-white/95 font-medium">4 of 11</strong> channels,
          keywords already ranking at{' '}
          <strong className="text-white/95 font-medium">#10&ndash;16</strong> with no
          pages built for them, and demand on Reddit and Quora going uncaptured.
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
