import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced } from '../lib/motion.js';
import { useLang } from '../lib/i18n.jsx';
import { Intro } from './ui.jsx';

export default function Process() {
  const { t } = useLang();
  const p = t.process;
  const root = useRef(null);

  // the rail fills with the scroll; each step lights up as it crosses the middle of the screen
  useGSAP(
    () => {
      const steps = gsap.utils.toArray('[data-step]');
      if (reduced()) { steps.forEach((s) => s.classList.add('is-on')); return; }
      gsap.fromTo('[data-rail]', { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '[data-steps]', start: 'top 60%', end: 'bottom 60%', scrub: true },
      });
      steps.forEach((s) =>
        ScrollTrigger.create({ trigger: s, start: 'top 60%', onEnter: () => s.classList.add('is-on'), onLeaveBack: () => s.classList.remove('is-on') }),
      );
    },
    { scope: root },
  );

  return (
    <section id="process" ref={root} className="relative border-t border-line py-28 md:py-36">
      <div className="wrap grid gap-14 md:grid-cols-[1fr_1.15fr] md:gap-20">
        <div className="md:sticky md:top-32 md:self-start">
          <Intro eyebrow={p.eyebrow} title={p.title} />
        </div>
        <ol data-steps className="relative">
          <span aria-hidden="true" className="absolute bottom-6 left-[19px] top-6 w-px bg-line" />
          <span aria-hidden="true" data-rail className="absolute bottom-6 left-[19px] top-6 w-px origin-top bg-gradient-to-b from-signal to-signal/30" />
          {p.steps.map(([title, body], i) => (
            <li key={i} data-step className="group relative flex gap-6 pb-16 last:pb-0 md:gap-8">
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-line-2 bg-ink font-mono text-[13px] text-muted transition-all duration-700 group-[.is-on]:border-signal group-[.is-on]:text-signal group-[.is-on]:shadow-[0_0_24px_-4px_#5cffc9]">
                0{i + 1}
              </span>
              <div className="pt-1.5 opacity-40 transition-opacity duration-700 group-[.is-on]:opacity-100">
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h3>
                <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
