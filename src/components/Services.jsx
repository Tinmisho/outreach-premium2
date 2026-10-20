import { useLang } from '../lib/i18n.jsx';
import { Check, Intro, spot } from './ui.jsx';

export function Marquee() {
  const { t } = useLang();
  const row = t.marquee.items;
  return (
    <section aria-label={t.marquee.label} className="marquee relative overflow-hidden border-y border-line py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent md:w-48" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent md:w-48" />
      <div className="marquee-track flex w-max items-center">
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex items-center">
            {row.map((item) => (
              <span key={item} className="flex items-center whitespace-nowrap px-6 text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-tight text-dim">
                <span className="mr-12 text-[10px] text-signal">✦</span>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/* small abstract pictures for each card; they come alive on hover (group-hover) */
const Viz = {
  design: () => (
    <div className="grid h-full grid-cols-6 grid-rows-4 gap-2">
      <span className="col-span-6 rounded-lg bg-white/[0.06] transition-all duration-700 group-hover:bg-white/10" />
      <span className="col-span-4 row-span-2 rounded-lg bg-gradient-to-br from-signal/25 to-signal/0 transition-all duration-700 group-hover:col-span-3" />
      <span className="col-span-2 row-span-2 rounded-lg bg-white/[0.06] transition-all duration-700 group-hover:col-span-3" />
      <span className="col-span-2 rounded-lg bg-white/[0.06]" />
      <span className="col-span-2 rounded-lg bg-white/[0.06] transition-colors duration-700 group-hover:bg-signal/20" />
      <span className="col-span-2 rounded-lg bg-white/[0.06]" />
    </div>
  ),
  hosting: () => (
    <div className="flex h-full flex-col justify-center gap-2.5 font-mono text-[12px]">
      {['SSL', 'BACKUP', 'UPTIME'].map((k, i) => (
        <div key={k} className="flex items-center justify-between rounded-xl border border-line bg-white/[0.02] px-3.5 py-2.5 transition-transform duration-700 group-hover:translate-x-1" style={{ transitionDelay: `${i * 70}ms` }}>
          <span className="text-muted">{k}</span>
          <span className="flex items-center gap-1.5 text-signal"><span className="size-1.5 rounded-full bg-signal [animation:pulse-dot_2.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.4}s` }} />OK</span>
        </div>
      ))}
    </div>
  ),
  care: () => (
    <div className="flex h-full flex-col justify-center gap-2.5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-3.5 py-3">
          <span className={`grid size-5 shrink-0 place-items-center rounded-full transition-colors duration-500 ${i === 0 ? 'bg-signal text-ink' : 'bg-white/10 text-transparent group-hover:bg-signal group-hover:text-ink'}`} style={{ transitionDelay: `${i * 150}ms` }}>
            <Check className="size-3" />
          </span>
          <span className="h-2 flex-1 rounded-full bg-white/10" style={{ maxWidth: `${80 - i * 15}%` }} />
        </div>
      ))}
    </div>
  ),
  chat: () => (
    <div className="flex h-full flex-col justify-center gap-2.5">
      <span className="h-9 w-3/5 self-start rounded-2xl rounded-bl-md bg-white/[0.07]" />
      <span className="h-9 w-2/3 self-end rounded-2xl rounded-br-md bg-signal/80 transition-transform duration-700 group-hover:-translate-y-1" />
      <span className="flex h-9 w-20 items-center justify-center gap-1 self-start rounded-2xl rounded-bl-md bg-white/[0.07]">
        {[0, 1, 2].map((i) => <span key={i} className="size-1.5 rounded-full bg-white/50 [animation:pulse-dot_1.2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />)}
      </span>
    </div>
  ),
  forms: () => (
    <div className="flex h-full flex-col justify-center gap-2.5">
      <span className="h-10 rounded-xl border border-line bg-white/[0.02]" />
      <div className="grid grid-cols-2 gap-2.5">
        <span className="h-10 rounded-xl border border-line bg-white/[0.02]" />
        <span className="h-10 rounded-xl border border-line bg-white/[0.02]" />
      </div>
      <span className="flex h-10 items-center justify-center rounded-xl bg-white/10 text-fg transition-colors duration-500 group-hover:bg-signal group-hover:text-ink">
        <Check className="size-4" />
      </span>
    </div>
  ),
  pay: () => (
    <div className="flex h-full items-center">
      <div className="w-full rounded-2xl border border-line bg-gradient-to-br from-white/[0.07] to-white/[0.01] p-4 transition-transform duration-700 group-hover:-rotate-2 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between">
          <span className="h-6 w-9 rounded-md bg-gradient-to-br from-[#d9dde3] to-[#8d939b]" />
          <span className="font-mono text-[12px] text-muted">•••• 4242</span>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <span className="text-2xl font-semibold tracking-tight">45 ₾</span>
          <span className="rounded-full bg-signal px-3 py-1 text-[12px] font-semibold text-ink">✓</span>
        </div>
      </div>
    </div>
  ),
};

// zig-zag bento: [wide, narrow], [narrow, wide], [wide, narrow]
const LAYOUT = [
  ['design', 'md:col-span-2'], ['hosting', ''],
  ['care', ''], ['chat', 'md:col-span-2'],
  ['forms', 'md:col-span-2'], ['pay', ''],
];

export default function Services() {
  const { t } = useLang();
  const s = t.services;
  return (
    <section id="services" className="relative py-28 md:py-36">
      <div className="wrap">
        <Intro eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {LAYOUT.map(([key, span], i) => {
            const V = Viz[key];
            const [title, body] = s.items[key];
            return (
              <article key={key} data-reveal onPointerMove={spot} className={`spot group flex flex-col p-6 md:p-8 ${span}`}>
                <div className={`h-40 ${span ? 'md:h-44' : ''}`}><V /></div>
                <div className="mt-8 flex items-baseline gap-3">
                  <span className="font-mono text-[12px] text-dim">0{i + 1}</span>
                  <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
                </div>
                <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
