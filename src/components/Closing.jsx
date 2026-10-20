import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced, scrollToId } from '../lib/motion.js';
import { useLang, money } from '../lib/i18n.jsx';
import { TIERS, PRICES } from '../data/pricing.js';
import { CONTACT } from '../data/contact.js';
import { Arrow, Heading, Intro, Logo, spot } from './ui.jsx';
import { LangSwitch } from './Nav.jsx';

export function Own() {
  const { t, lang } = useLang();
  const o = t.own;
  return (
    <section className="relative border-t border-line py-28 md:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-end">
        <Intro eyebrow={o.eyebrow} title={o.title} sub={o.sub} />
        <ul className="border-t border-line">
          {TIERS.map((tier) => (
            <li key={tier} data-reveal className="group flex items-baseline justify-between gap-6 border-b border-line py-5 transition-[padding] duration-500 hover:px-3">
              <span className="font-mono text-[13px] tracking-[0.18em] text-muted transition-colors duration-500 group-hover:text-signal">{tier}</span>
              <span className="text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-[-0.04em] tabular-nums">{money(PRICES[tier].buyout, lang)} ₾</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Terms() {
  const { t } = useLang();
  const s = t.terms;
  const blocks = [s.payment, s.change];
  return (
    <section className="pb-28 md:pb-36">
      <div className="wrap grid gap-4 md:grid-cols-3">
        {blocks.map(([title, lines]) => (
          <article key={title} data-reveal onPointerMove={spot} className="spot p-6 md:p-8">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <ul className="mt-5 space-y-3">
              {lines.map((l) => (
                <li key={l} className="flex gap-3 text-[14px] leading-relaxed text-muted">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />
                  {l}
                </li>
              ))}
            </ul>
          </article>
        ))}
        <article data-reveal onPointerMove={spot} className="spot flex flex-col p-6 md:p-8">
          <h3 className="text-lg font-semibold tracking-tight">{s.excluded[0]}</h3>
          <p className="mt-5 text-[14px] leading-relaxed text-muted">{s.excluded[1]}</p>
          <p className="mt-auto pt-6 font-mono text-[12px] text-dim">{s.contract}</p>
        </article>
      </div>
    </section>
  );
}

function Item({ q, a, open, onToggle }) {
  const body = useRef(null);
  useGSAP(
    () => {
      gsap.to(body.current, { height: open ? 'auto' : 0, duration: reduced() ? 0 : 0.6, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
    },
    { dependencies: [open] },
  );
  return (
    <li data-reveal className="border-b border-line">
      <button type="button" onClick={onToggle} aria-expanded={open} className="group flex w-full items-center justify-between gap-6 py-6 text-left">
        <span className={`text-lg font-medium tracking-tight transition-colors duration-500 md:text-xl ${open ? 'text-fg' : 'text-fg/80 group-hover:text-fg'}`}>{q}</span>
        <span className={`relative grid size-9 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${open ? 'border-signal bg-signal text-ink' : 'border-line-2 text-muted'}`}>
          <span className="absolute h-px w-3.5 bg-current" />
          <span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ${open ? 'scale-y-0' : ''}`} />
        </span>
      </button>
      <div ref={body} className="h-0 overflow-hidden">
        <p className="max-w-2xl pb-7 text-[16px] leading-relaxed text-muted">{a}</p>
      </div>
    </li>
  );
}

export function Faq() {
  const { t, lang } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState(0);
  const buyout = TIERS.map((tier) => money(PRICES[tier].buyout, lang)).join(' / ') + ' ₾';
  return (
    <section id="faq" className="border-t border-line py-28 md:py-36">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Intro eyebrow={f.eyebrow} title={f.title} />
        </div>
        <ul className="border-t border-line">
          {f.items.map(([q, a], i) => (
            <Item key={q} q={q} a={a.replace('{buyout}', buyout)} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  );
}

const ICON = {
  phone: 'M4 3h3l1.5 4-2 1.2a10 10 0 0 0 5.3 5.3L13 11.5l4 1.5v3a1 1 0 0 1-1 1A14 14 0 0 1 3 4a1 1 0 0 1 1-1z',
  whatsapp: 'M10 2.5a7.5 7.5 0 0 0-6.5 11.2L2.5 17.5l3.9-1A7.5 7.5 0 1 0 10 2.5z',
  telegram: 'M17.5 3.5 2.5 9.3l4.6 1.6 1.7 5.3 2.7-3 4 3z',
  email: 'M3 5h14v10H3zM3 5l7 6 7-6',
};

export function Contact() {
  const { t } = useLang();
  const c = t.contact;
  const root = useRef(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('[data-panel]', {
        scale: 0.95, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
      });
    },
    { scope: root },
  );
  return (
    <section id="contact" ref={root} className="py-20 md:py-28">
      <div className="wrap">
        <div data-panel className="relative overflow-hidden rounded-[32px] border border-line-2 bg-ink-2 px-6 py-16 md:px-16 md:py-24">
          <div aria-hidden="true" className="gridlines pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(92,255,201,0.2), transparent)' }} />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="eyebrow" data-reveal>{c.eyebrow}</span>
            <Heading className="mt-6 text-[clamp(2.6rem,7vw,5.6rem)] font-semibold leading-[0.98] tracking-[-0.045em]">{c.title}</Heading>
            <p data-reveal className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">{c.sub}</p>
          </div>
          <ul className="relative mx-auto mt-14 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Object.keys(CONTACT).map((k) => {
              const v = CONTACT[k];
              const href = v && (k === 'phone' ? `tel:${v.replace(/\s/g, '')}` : k === 'email' ? `mailto:${v}` : v);
              const Tag = v ? 'a' : 'div';
              return (
                <li key={k} data-reveal>
                  <Tag {...(v ? { href, target: k === 'phone' || k === 'email' ? undefined : '_blank', rel: 'noreferrer' } : {})}
                    onPointerMove={spot} className={`spot group flex items-center gap-4 rounded-2xl p-4 ${v ? '' : 'cursor-default'}`}>
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-fg">
                      <svg viewBox="0 0 20 20" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d={ICON[k]} /></svg>
                    </span>
                    <span className="min-w-0 text-left">
                      <span className="block text-[14px] font-medium">{c.channels[k]}</span>
                      <span className={`block truncate text-[13px] ${v ? 'text-muted' : 'font-mono text-dim'}`}>{v || c.soon}</span>
                    </span>
                    {v && <Arrow className="ml-auto size-4 text-muted transition-transform duration-500 group-hover:translate-x-1 group-hover:text-signal" />}
                  </Tag>
                </li>
              );
            })}
          </ul>
          <p className="relative mt-10 text-center font-mono text-[12px] uppercase tracking-[0.16em] text-dim">{c.location}</p>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { t } = useLang();
  const root = useRef(null);
  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('[data-word]', {
        yPercent: 40, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
      });
    },
    { scope: root },
  );
  const go = (id) => (e) => { e.preventDefault(); scrollToId(id); };
  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line pt-16">
      <div className="wrap flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-4 text-[14px] text-muted">{t.footer.tagline}</p>
          <p className="mt-1 text-[14px] text-dim">{t.contact.location} · {t.footer.rights}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] text-muted">
          {['services', 'process', 'pricing', 'faq', 'contact'].map((id) => (
            <a key={id} href={`#${id}`} onClick={go(id)} className="transition-colors duration-300 hover:text-fg">{t.nav[id]}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <LangSwitch />
          <a href="#top" onClick={go('top')} aria-label={t.footer.top} className="grid size-10 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:text-fg">
            <Arrow className="size-4 -rotate-90" />
          </a>
        </div>
      </div>
      <p aria-hidden="true" data-word
        className="wordmark pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[clamp(5rem,21vw,19rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
        Outreach
      </p>
    </footer>
  );
}
