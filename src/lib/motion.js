import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
gsap.defaults({ ease: 'power3.out', duration: 0.9 });

export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;

// Smooth wheel scrolling (Lenis) driven by GSAP's ticker so ScrollTrigger stays in step.
export function startSmoothScroll() {
  if (reduced() || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.2 });
  else el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
