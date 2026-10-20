import { useEffect, useRef } from 'react';
import { gsap, SplitText, useGSAP, reduced, scrollToId } from '../lib/motion.js';
import { useLang } from '../lib/i18n.jsx';
import { Arrow, Check, Magnetic } from './ui.jsx';

const LOCK = 'M5 7V5a3 3 0 1 1 6 0v2h.5A1.5 1.5 0 0 1 13 8.5v5A1.5 1.5 0 0 1 11.5 15h-7A1.5 1.5 0 0 1 3 13.5v-5A1.5 1.5 0 0 1 4.5 7H5zm1.5 0h3V5a1.5 1.5 0 0 0-3 0v2z';
const PHOTO = 'radial-gradient(120% 90% at 20% 10%, #3a2a1f 0%, #1b1512 45%, #0e0d0c 100%)';
const WARM = 'radial-gradient(60% 50% at 75% 70%, rgba(255,170,90,0.28), transparent 70%)';

// Slow drifting specks of light behind the hero. Runs only while the hero is on screen.
function Dust() {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced()) return;
    const c = ref.current, ctx = c.getContext('2d');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let w, h, raf = 0, on = true;
    const size = () => { w = c.offsetWidth; h = c.offsetHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    size();
    const n = w < 700 ? 34 : 70;
    const dots = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.3, v: Math.random() * 0.18 + 0.04, p: Math.random() * Math.PI * 2 }));
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        d.y -= d.v; if (d.y < -4) { d.y = h + 4; d.x = Math.random() * w; }
        const a = 0.25 + 0.35 * Math.sin(t / 1400 + d.p);
        ctx.fillStyle = `rgba(190,255,232,${a})`;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      if (on) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(draw); });
    io.observe(c);
    addEventListener('resize', size);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full" />;
}

function Browser({ m }) {
  return (
    <div className="beam-border rounded-[23px] p-px shadow-[0_60px_140px_-30px_rgba(0,0,0,0.9),0_0_80px_-30px_rgba(92,255,201,0.25)]">
      <div className="overflow-hidden rounded-[22px] bg-panel">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <span key={i} className="size-2.5 rounded-full bg-white/10" />)}
          </div>
          <div className="mx-auto flex min-w-0 items-center gap-2 rounded-full border border-line bg-ink-2 px-3 py-1.5 font-mono text-[11px] text-muted sm:px-4">
            <svg viewBox="0 0 16 16" className="size-3 shrink-0 text-signal" fill="currentColor" aria-hidden="true"><path d={LOCK} /></svg>
            <span className="truncate">{m.url}</span>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-signal/10 px-2.5 py-1 font-mono text-[11px] text-signal sm:flex">
            <span className="size-1.5 rounded-full bg-signal [animation:pulse-dot_2.4s_ease-in-out_infinite]" />
            {m.live}
          </span>
        </div>

        <div className="grid gap-4 p-4 sm:grid-cols-[1.35fr_1fr] sm:p-6">
          <div data-b className="relative min-h-[220px] overflow-hidden rounded-2xl sm:min-h-[300px]" style={{ background: PHOTO }}>
            <div className="absolute inset-0" style={{ background: WARM }} />
            <div className="absolute inset-x-5 top-5 flex items-center justify-between">
              <span className="h-2.5 w-16 rounded-full bg-white/50" />
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => <span key={i} className="h-2 w-8 rounded-full bg-white/25" />)}
              </div>
            </div>
            <div className="absolute bottom-5 left-5 right-5">
              <span className="block h-4 w-3/4 rounded-full bg-white/80 sm:h-5" />
              <span className="mt-2.5 block h-4 w-1/2 rounded-full bg-white/80 sm:h-5" />
              <span className="mt-4 inline-flex rounded-full bg-[#ffb067] px-4 py-2 text-[12px] font-semibold text-[#1b1512]">{m.book}</span>
            </div>
          </div>
          <div className="grid gap-4">
            <div data-b className="rounded-2xl border border-line bg-white/[0.03] p-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{m.menu}</span>
              <div className="mt-3 space-y-2.5">
                {[70, 55, 62].map((w, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <span className="h-2 rounded-full bg-white/15" style={{ width: `${w}%` }} />
                    <span className="h-2 w-8 rounded-full bg-white/25" />
                  </div>
                ))}
              </div>
            </div>
            <div data-b className="rounded-2xl border border-line bg-white/[0.03] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted">{m.visits}</span>
                <span className="text-signal">↑</span>
              </div>
              <svg viewBox="0 0 200 60" className="mt-3 h-14 w-full" fill="none" aria-hidden="true">
                <defs>
                  <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#5cffc9" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#5cffc9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path data-area d="M0 50 L25 44 L50 46 L75 34 L100 38 L125 24 L150 28 L175 14 L200 8 L200 60 L0 60Z" fill="url(#spark)" />
                <path data-line d="M0 50 L25 44 L50 46 L75 34 L100 38 L125 24 L150 28 L175 14 L200 8" stroke="#5cffc9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
            </div>
            <div data-b className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] p-4">
              <span className="size-2 rounded-full bg-signal" />
              <span className="text-[13px] text-muted">{m.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// The same customer site on a phone, in front of the browser.
function Phone({ m }) {
  return (
    <div className="rounded-[34px] border border-line-2 bg-[#0b0d10] p-2 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.95)]">
      <div className="relative overflow-hidden rounded-[27px] bg-panel">
        <div className="absolute left-1/2 top-2 z-10 h-[18px] w-[64px] -translate-x-1/2 rounded-full bg-black" />
        <div className="relative h-[190px]" style={{ background: PHOTO }}>
          <div className="absolute inset-0" style={{ background: WARM }} />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="block h-3 w-4/5 rounded-full bg-white/80" />
            <span className="mt-2 block h-3 w-1/2 rounded-full bg-white/80" />
            <span className="mt-3 inline-flex rounded-full bg-[#ffb067] px-3 py-1.5 text-[10px] font-semibold text-[#1b1512]">{m.book}</span>
          </div>
        </div>
        <div className="space-y-2.5 p-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted">{m.menu}</span>
          {[72, 58, 66, 50].map((w, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="h-1.5 rounded-full bg-white/15" style={{ width: `${w}%` }} />
              <span className="h-1.5 w-6 rounded-full bg-white/25" />
            </div>
          ))}
          <span className="mt-2 flex h-8 items-center justify-center rounded-xl bg-signal/90 text-[10px] font-semibold text-ink">✓</span>
        </div>
      </div>
    </div>
  );
}

const Chip = ({ children, className }) => (
  <div data-chip className={`absolute z-20 hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-2 text-[13px] shadow-2xl backdrop-blur-xl md:flex ${className}`}>
    <span className="grid size-5 place-items-center rounded-full bg-signal/15 text-signal"><Check className="size-3" /></span>
    {children}
  </div>
);

export default function Hero() {
  const { t, lang } = useLang();
  const h = t.hero;
  const root = useRef(null);
  const title = useRef(null);

  // headline: words rise out of their lines, then one band of light sweeps across them
  useGSAP(
    () => {
      if (reduced()) return;
      const split = SplitText.create(title.current, {
        type: 'lines,words', mask: 'lines', linesClass: 'hl', wordsClass: 'hw', autoSplit: true,
        onSplit: (self) =>
          gsap.timeline({ delay: 0.1 })
            .from(self.words, { yPercent: 120, duration: 1.2, stagger: 0.06, ease: 'power4.out' })
            .fromTo(self.words, { backgroundPosition: '100% 0' }, { backgroundPosition: '0% 0', duration: 1.8, stagger: 0.07, ease: 'power2.inOut' }, 0.7),
      });
      gsap.from('[data-hero-fade]', { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 0.45 });
      return () => split.revert();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  // the devices build themselves once, the light breathes, the browser tilts flat as you scroll
  useGSAP(
    () => {
      if (reduced()) return;
      const line = root.current.querySelector('[data-line]');
      const len = line.getTotalLength();
      gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
      gsap.timeline({ delay: 0.6 })
        .from('[data-horizon]', { opacity: 0, scale: 0.92, duration: 2, ease: 'power2.out' }, 0)
        .from('[data-mock]', { y: 90, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.1)
        .from('[data-phone]', { y: 140, opacity: 0, duration: 1.4, ease: 'power3.out' }, 0.45)
        .from('[data-b]', { opacity: 0, y: 16, duration: 0.8, stagger: 0.07, ease: 'power3.out' }, 0.45)
        .to(line, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, 0.9)
        .from('[data-area]', { opacity: 0, duration: 1 }, 1.5)
        .from('[data-chip]', { scale: 0.85, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'back.out(1.6)' }, 1.3)
        .add(() => gsap.utils.toArray('[data-chip]').forEach((c, i) =>
          gsap.to(c, { y: -8, duration: 2.6 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })));
      gsap.to('[data-cone]', { opacity: 0.65, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      gsap.fromTo('[data-tilt]', { rotateX: 20, scale: 0.94 }, {
        rotateX: 0, scale: 1, ease: 'none',
        scrollTrigger: { trigger: '[data-tilt]', start: 'top 95%', end: 'top 25%', scrub: true },
      });
    },
    { scope: root },
  );

  // depth: the browser turns towards the pointer, the phone and chips sit at other depths
  const { contextSafe } = useGSAP({ scope: root });
  const move = contextSafe((e) => {
    if (reduced() || e.pointerType !== 'mouse') return;
    const r = root.current.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
    gsap.to('[data-par]', { rotateY: nx * 7, rotateX: -ny * 5, duration: 1.2, ease: 'power3.out' });
    gsap.to('[data-phone-par]', { x: nx * 36, y: ny * 24, duration: 1.2, ease: 'power3.out' });
    gsap.to('[data-chips-par]', { x: nx * -22, y: ny * -14, duration: 1.2, ease: 'power3.out' });
    gsap.to('[data-glow]', { x: e.clientX - r.left, y: e.clientY - r.top, duration: 1.4, ease: 'power3.out' });
  });
  const leave = contextSafe(() => {
    gsap.to('[data-par]', { rotateY: 0, rotateX: 0, duration: 1.4, ease: 'power3.out' });
    gsap.to('[data-phone-par], [data-chips-par]', { x: 0, y: 0, duration: 1.4, ease: 'power3.out' });
  });

  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };

  return (
    <section id="top" ref={root} onPointerMove={move} onPointerLeave={leave} className="relative overflow-hidden pb-20 pt-[128px] md:pt-[150px]">
      {/* light: a cone from above, a pointer glow, drifting dust */}
      <div aria-hidden="true" className="gridlines pointer-events-none absolute inset-0 opacity-50" />
      <div data-cone aria-hidden="true" className="hero-cone pointer-events-none absolute left-1/2 top-0 h-[900px] w-[1400px] -translate-x-1/2" />
      <div data-glow aria-hidden="true" className="pointer-events-none absolute left-0 top-0 hidden size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
        style={{ background: 'radial-gradient(closest-side, rgba(92,255,201,0.07), transparent)' }} />
      <Dust />

      <div className="wrap relative text-center">
        <span data-hero-fade className="shine-pill inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[12px] uppercase tracking-[0.14em] text-muted">
          <span className="size-1.5 rounded-full bg-signal shadow-[0_0_10px_#5cffc9]" />
          {h.eyebrow}
        </span>
        <h1 key={lang} ref={title} className="hero-title display mx-auto mt-7 max-w-5xl text-[clamp(2.7rem,8.2vw,7rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-fg [&_.hl]:pb-[0.08em]">
          {h.title}
        </h1>
        <p data-hero-fade className="mx-auto mt-7 max-w-2xl text-[17px] leading-relaxed text-muted md:text-lg">{h.sub}</p>
        <div data-hero-fade className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Magnetic href="#pricing" onClick={go('pricing')} className="btn btn-primary">
            {h.cta1} <Arrow />
          </Magnetic>
          <Magnetic href="#contact" onClick={go('contact')} className="btn btn-ghost">
            {h.cta2}
          </Magnetic>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl [perspective:1600px] md:mt-24">
          {/* the glowing horizon the devices stand on */}
          <div data-horizon aria-hidden="true" className="hero-horizon pointer-events-none absolute left-1/2 top-[38%] aspect-square w-[260%] -translate-x-1/2 rounded-full md:w-[190%]" />
          <div data-tilt className="relative origin-top [transform-style:preserve-3d]">
            <div data-par className="relative [transform-style:preserve-3d]">
              <div data-mock className="text-left md:mr-[9%]">
                <Browser m={h.mock} />
              </div>
              <div data-phone-par className="absolute -bottom-10 right-0 hidden w-[23%] min-w-[180px] max-w-[230px] text-left md:block">
                <div data-phone><Phone m={h.mock} /></div>
              </div>
              <div data-chips-par className="pointer-events-none absolute inset-0">
                <Chip className="-left-4 top-[36%] lg:-left-12">{h.mock.ssl}</Chip>
                <Chip className="-top-5 right-[16%]">{h.mock.backup}</Chip>
              </div>
            </div>
          </div>
        </div>

        <dl className="relative mx-auto mt-24 grid max-w-5xl grid-cols-2 border-t border-line text-left md:grid-cols-4">
          {h.stats.map(([v, l], i) => (
            <div key={i} data-reveal className={`py-6 pr-4 ${i % 2 ? 'pl-4 md:pl-6' : ''} ${i > 1 ? 'border-t border-line md:border-t-0' : ''} ${i > 0 ? 'md:border-l md:border-line md:pl-6' : ''}`}>
              <dt className="text-xl font-semibold tracking-tight md:text-2xl">{v}</dt>
              <dd className="mt-1 text-[14px] text-muted">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
