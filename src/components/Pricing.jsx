import { useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced, scrollToId } from '../lib/motion.js';
import { useLang, money } from '../lib/i18n.jsx';
import { TIERS, RECOMMENDED, PRICES, YEAR_NOTE, ADDONS, MATRIX } from '../data/pricing.js';
import { Arrow, Check, Count, Intro, Magnetic, spot } from './ui.jsx';

function Toggle({ yearly, setYearly, p }) {
  return (
    <div className="relative inline-grid grid-cols-2 rounded-full border border-line bg-white/[0.03] p-1 text-[14px]" role="group">
      <span aria-hidden="true" className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-fg transition-transform duration-500 ease-[var(--ease-out-soft)]" style={{ transform: `translateX(${yearly ? 100 : 0}%)` }} />
      {[false, true].map((y) => (
        <button key={String(y)} type="button" aria-pressed={yearly === y} onClick={() => setYearly(y)}
          className={`relative z-10 flex h-10 items-center justify-center gap-2 rounded-full px-5 font-medium transition-colors duration-500 ${yearly === y ? 'text-ink' : 'text-muted hover:text-fg'}`}>
          {y ? p.yearly : p.monthly}
          {y && <span className={`rounded-full px-1.5 py-0.5 font-mono text-[11px] transition-colors duration-500 ${yearly ? 'bg-ink text-signal' : 'bg-signal/15 text-signal'}`}>{p.save}</span>}
        </button>
      ))}
    </div>
  );
}

function Card({ tier, i, yearly }) {
  const { t, lang } = useLang();
  const p = t.pricing;
  const pr = PRICES[tier];
  const rec = tier === RECOMMENDED;
  const setup = `${money(pr.setup, lang)} ₾ ${p.setup}`;
  const note = yearly ? (YEAR_NOTE[tier] === 'setupFree' ? p.setupFree : `${setup} · ${p.minus10}`) : `+ ${setup}`;
  return (
    <article data-card onPointerMove={spot}
      className={`spot flex flex-col p-6 md:p-7 ${rec ? 'border-signal/40 bg-[linear-gradient(180deg,rgba(92,255,201,0.08),rgba(92,255,201,0.01)_45%)] shadow-[0_30px_80px_-30px_rgba(92,255,201,0.35)]' : ''}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-[13px] tracking-[0.18em] text-fg">{tier}</h3>
        {rec && <span className="rounded-full bg-signal px-2.5 py-1 text-[11px] font-semibold text-ink">{p.recommended}</span>}
      </div>
      <p className="mt-2 text-[14px] text-muted">{p.taglines[tier]}</p>
      <div className="mt-8 flex items-baseline gap-1.5">
        <Count value={yearly ? pr.year : pr.month} className="text-5xl font-semibold tracking-[-0.04em] tabular-nums" />
        <span className="text-2xl font-semibold">₾</span>
        <span className="ml-1 text-[14px] text-muted">{yearly ? p.perYear : p.perMonth}</span>
      </div>
      <p className="mt-2 h-5 text-[13px] text-muted">{note}</p>

      <Magnetic href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact'); }} strength={0.15}
        className={`btn mt-7 w-full justify-center ${rec ? 'btn-primary' : 'btn-ghost'}`}>
        {p.choose} {tier} <Arrow />
      </Magnetic>

      <div className="mt-7 border-t border-line pt-6">
        {i > 0 && <p className="mb-4 text-[13px] text-muted">{p.everything.replace('{tier}', TIERS[i - 1])}</p>}
        <ul className="space-y-3">
          {p.highlights[tier].map((h) => (
            <li key={h} className="flex gap-3 text-[14px] leading-snug">
              <Check className="mt-0.5 size-4 shrink-0 text-signal" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

const cell = (v, lang) => {
  if (v === true) return <Check className="mx-auto size-4 text-signal" />;
  if (v === false) return <span className="text-dim">—</span>;
  return typeof v === 'string' ? v : v[lang];
};

function Compare({ open }) {
  const { t, lang } = useLang();
  const p = t.pricing;
  const box = useRef(null);
  useGSAP(
    () => {
      const el = box.current;
      if (reduced()) { gsap.set(el, { height: open ? 'auto' : 0 }); return; }
      gsap.to(el, { height: open ? 'auto' : 0, duration: 0.8, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
      if (open) gsap.fromTo(el.querySelectorAll('tbody tr'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.025, delay: 0.15 });
    },
    { dependencies: [open] },
  );
  const priceRows = [
    [p.rows.month, (tier) => <strong className="text-[15px]">{money(PRICES[tier].month, lang)} ₾</strong>],
    [p.rows.setup, (tier) => `${money(PRICES[tier].setup, lang)} ₾`],
    [p.rows.year, (tier) => (
      <span>{money(PRICES[tier].year, lang)} ₾<span className="block text-[12px] text-signal">{YEAR_NOTE[tier] === 'setupFree' ? p.setupFree : p.minus10}</span></span>
    )],
  ];
  return (
    <div ref={box} className="h-0 overflow-hidden">
      <div className="overflow-x-auto pt-10" data-lenis-prevent>
        <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-[14px]">
          <caption className="sr-only">{p.compareHead}</caption>
          <thead>
            <tr className="border-b border-line-2">
              <th className="w-[34%] py-4 pr-4 font-medium text-muted">{p.compareHead}</th>
              {TIERS.map((tier) => (
                <th key={tier} className={`w-[16.5%] py-4 text-center font-mono text-[12px] tracking-[0.16em] ${tier === RECOMMENDED ? 'text-signal' : 'text-fg'}`}>{tier}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceRows.map(([label, f]) => (
              <tr key={label} className="border-b border-line">
                <td className="py-4 pr-4 text-muted">{label}</td>
                {TIERS.map((tier) => <td key={tier} className="py-4 text-center tabular-nums">{f(tier)}</td>)}
              </tr>
            ))}
            {MATRIX.map((g) => [
              <tr key={g.group.en}>
                <td colSpan={5} className="pb-3 pt-9 font-mono text-[11px] uppercase tracking-[0.16em] text-signal">{g.group[lang]}</td>
              </tr>,
              ...g.rows.map((r) => (
                <tr key={r.label.en} className="border-b border-line">
                  <td className="py-4 pr-4 leading-snug text-muted">{r.label[lang]}</td>
                  {r.v.map((v, k) => <td key={k} className="px-2 py-4 text-center leading-snug">{cell(v, lang)}</td>)}
                </tr>
              )),
            ])}
            <tr>
              <td className="pt-8 pr-4 font-medium">{p.buyoutRow}</td>
              {TIERS.map((tier) => <td key={tier} className="pt-8 text-center text-[17px] font-semibold tabular-nums">{money(PRICES[tier].buyout, lang)} ₾</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Pricing() {
  const { t, lang } = useLang();
  const p = t.pricing;
  const [yearly, setYearly] = useState(false);
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useGSAP(
    () => {
      if (reduced()) return;
      gsap.from('[data-card]', {
        y: 60, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '[data-cards]', start: 'top 82%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="pricing" ref={root} className="relative overflow-hidden border-t border-line py-28 md:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-40 h-[500px] w-[900px] -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(92,255,201,0.07), transparent)' }} />
      <div className="wrap relative">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
          <Intro eyebrow={p.eyebrow} title={p.title} sub={p.sub} />
          <div data-reveal><Toggle yearly={yearly} setYearly={setYearly} p={p} /></div>
        </div>

        <div data-cards className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TIERS.map((tier, i) => <Card key={tier} tier={tier} i={i} yearly={yearly} />)}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[auto_1fr_1fr] md:items-stretch">
          <h3 data-reveal className="self-center pr-4 font-mono text-[12px] uppercase tracking-[0.16em] text-muted">{p.addons.title}</h3>
          {ADDONS.map((a) => (
            <div key={a.key} data-reveal onPointerMove={spot} className="spot flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="font-medium">{p.addons[a.key]}</p>
                <p className="mt-1 text-[13px] text-muted">{a.tiers.length === TIERS.length ? p.addons.all : p.addons.from}</p>
              </div>
              <div className="text-[14px] tabular-nums sm:text-right">
                <p><span className="font-semibold">+{money(a.month, lang)} ₾</span> <span className="text-muted">{p.addons.month}</span></p>
                <p className="text-muted">+{money(a.once, lang)} ₾ {p.addons.once}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="btn btn-ghost">
            {open ? p.compareHide : p.compareShow}
            <svg viewBox="0 0 16 16" className={`size-4 transition-transform duration-500 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <Compare open={open} />
      </div>
    </section>
  );
}
