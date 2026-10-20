import { useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP, reduced, startSmoothScroll } from './lib/motion.js';
import { useLang } from './lib/i18n.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Services, { Marquee } from './components/Services.jsx';
import Process from './components/Process.jsx';
import Pricing from './components/Pricing.jsx';
import { Own, Terms, Faq, Contact, Footer } from './components/Closing.jsx';

export default function App() {
  const { lang } = useLang();

  useEffect(() => {
    startSmoothScroll();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  // anything marked data-reveal fades up as it enters, in small staggered batches
  useGSAP(() => {
    if (reduced()) return;
    gsap.set('[data-reveal]', { opacity: 0, y: 28 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', overwrite: true }),
    });
  });

  // a new language changes line lengths: let every trigger re-measure
  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [lang]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Process />
        <Pricing />
        <Own />
        <Terms />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
