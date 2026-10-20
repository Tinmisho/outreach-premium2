import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, reduced, scrollToId } from '../lib/motion.js';
import { useLang } from '../lib/i18n.jsx';
import { LANGS, LANG_LABEL } from '../data/copy.js';
import { Logo, Magnetic } from './ui.jsx';

const LINKS = ['services', 'process', 'pricing', 'faq', 'contact'];

export function LangSwitch({ className = '' }) {
  const { lang, setLang } = useLang();
  const i = LANGS.indexOf(lang);
  return (
    <div role="group" aria-label="Language" className={`relative grid grid-cols-3 rounded-full border border-line bg-white/[0.03] p-1 font-mono text-[12px] ${className}`}>
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc((100%-8px)/3)] rounded-full bg-white/10 transition-transform duration-500 ease-[var(--ease-out-soft)]"
        style={{ transform: `translateX(${i * 100}%)` }}
      />
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={l === lang}
          className={`relative z-10 h-7 w-10 rounded-full transition-colors duration-500 ${l === lang ? 'text-fg' : 'text-muted hover:text-fg'}`}
        >
          {LANG_LABEL[l]}
        </button>
      ))}
    </div>
  );
}

export default function Nav() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menu = useRef(null);

  useEffect(() => {
    const on = () => setScrolled(scrollY > 24);
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  useGSAP(
    () => {
      if (!open || reduced()) return;
      gsap.from('[data-menu-item]', { y: 30, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out' });
    },
    { scope: menu, dependencies: [open] },
  );

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled || open ? 'border-b border-line bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
        }`}
      >
        <nav className="wrap flex h-[72px] items-center justify-between gap-6">
          <a href="#top" onClick={go('top')} aria-label="Outreach" className="text-fg">
            <Logo />
          </a>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} onClick={go(id)} className="rounded-full px-3.5 py-2 text-[14px] text-muted transition-colors duration-300 hover:text-fg">
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <LangSwitch className="hidden sm:grid" />
            <Magnetic href="#contact" onClick={go('contact')} className="btn btn-primary hidden h-10 px-5 text-[14px] md:inline-flex">
              {t.nav.cta}
            </Magnetic>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
              aria-expanded={open}
              aria-label={open ? t.nav.close : t.nav.menu}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-fg transition-transform duration-500 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
                <span className={`absolute left-0 h-px w-4 bg-fg transition-transform duration-500 ${open ? 'top-1.5 -rotate-45' : 'top-3'}`} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div ref={menu} className="fixed inset-0 z-40 bg-ink/95 pt-[96px] backdrop-blur-xl lg:hidden" data-lenis-prevent>
          <ul className="wrap flex flex-col gap-2">
            {LINKS.map((id) => (
              <li key={id} data-menu-item>
                <a href={`#${id}`} onClick={go(id)} className="block border-b border-line py-4 text-3xl font-semibold tracking-tight">
                  {t.nav[id]}
                </a>
              </li>
            ))}
            <li data-menu-item className="pt-6">
              <LangSwitch className="w-max" />
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
