import { createContext, useContext, useEffect, useState } from 'react';
import { COPY, LANGS } from '../data/copy.js';

const KEY = 'outreach-lang';
const Ctx = createContext(null);

// ?lang= in the address wins, then a stored choice, then the browser language; Georgian by default.
function initialLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  try {
    const s = localStorage.getItem(KEY);
    if (LANGS.includes(s)) return s;
  } catch {}
  const n = (navigator.language || '').slice(0, 2);
  return LANGS.includes(n) && n !== 'en' ? n : 'ka';
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(initialLang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = COPY[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', COPY[lang].meta.description);
    try { localStorage.setItem(KEY, lang); } catch {}
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang, t: COPY[lang] }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

// 1200 -> "1,200" (Georgian and English) or "1 200" (Russian)
export const money = (n, lang) => n.toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US').replace(/ /g, ' ');
