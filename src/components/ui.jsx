import { useRef } from 'react';
import { gsap, SplitText, useGSAP, reduced } from '../lib/motion.js';
import { useLang, money } from '../lib/i18n.jsx';

export function Logo({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
        <circle cx="14.5" cy="17.5" r="9" fill="none" stroke="currentColor" strokeWidth="3.4" />
        <circle cx="25" cy="7" r="3.6" fill="var(--color-signal)" />
      </svg>
      <span className="text-[19px] font-semibold tracking-[-0.02em]">Outreach</span>
    </span>
  );
}

export const Arrow = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Check = ({ className = 'size-4' }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// A headline whose lines slide up out of a mask when it scrolls into view (re-split on language change).
export function Heading({ as: Tag = 'h2', children, className = '' }) {
  const ref = useRef(null);
  const { lang } = useLang();
  useGSAP(
    () => {
      if (reduced()) return;
      SplitText.create(ref.current, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'ln',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            duration: 1.1,
            stagger: 0.09,
            ease: 'power4.out',
            scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
          }),
      });
    },
    { dependencies: [lang], revertOnUpdate: true },
  );
  return (
    // keyed by language: SplitText has rewritten the old element, so React must render a fresh one
    <Tag key={lang} ref={ref} className={`display chrome ${className}`}>
      {children}
    </Tag>
  );
}

// Section intro: eyebrow, headline and an optional line of text under it.
export function Intro({ eyebrow, title, sub, center = false, className = '' }) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <span className="eyebrow" data-reveal>{eyebrow}</span>
      <Heading className="mt-5 text-[clamp(2.2rem,5.2vw,4.2rem)] font-semibold leading-[1.02] tracking-[-0.035em]">{title}</Heading>
      {sub && <p data-reveal className={`mt-6 text-lg leading-relaxed text-muted ${center ? 'mx-auto' : ''} max-w-2xl`}>{sub}</p>}
    </div>
  );
}

// Pointer position for the .spot light, as CSS variables.
export const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

// A link/button that leans a little towards the pointer.
export function Magnetic({ as: Tag = 'a', className = '', children, strength = 0.28, ...rest }) {
  const ref = useRef(null);
  const { contextSafe } = useGSAP({ scope: ref });
  const move = contextSafe((e) => {
    if (reduced() || e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: 0.5 });
  });
  const leave = contextSafe(() => gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' }));
  return (
    <Tag ref={ref} className={className} onPointerMove={move} onPointerLeave={leave} {...rest}>
      {children}
    </Tag>
  );
}

// A number that counts to its new value whenever it changes.
export function Count({ value, className = '' }) {
  const ref = useRef(null);
  const last = useRef(value);
  const { lang } = useLang();
  useGSAP(
    () => {
      const el = ref.current;
      const o = { n: last.current };
      last.current = value;
      if (reduced() || o.n === value) { el.textContent = money(value, lang); return; }
      gsap.to(o, { n: value, duration: 0.8, ease: 'power3.out', onUpdate: () => { el.textContent = money(Math.round(o.n), lang); } });
    },
    { dependencies: [value, lang] },
  );
  return <span ref={ref} className={className}>{money(value, lang)}</span>;
}
