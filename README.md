# Outreach — premium site

One-page site for Outreach (web design, hosting and care for businesses in Georgia), in Georgian, English and Russian.

- React 18 + Vite 6 + Tailwind CSS 4, motion with GSAP 3.15 (SplitText, ScrollTrigger) and Lenis smooth scroll.
- Dark luxury design: near-black ink, one accent (`--color-signal`, mint `#5CFFC9`) for emphasis only. Tokens in `src/index.css`.
- Fonts are self-hosted (Inter Tight, Noto Sans Georgian, JetBrains Mono via Fontsource).

## Where things live

- `src/data/pricing.js` — every price and package fact (the only place prices are written).
- `src/data/copy.js` — all texts, per language (`ka` is the default; `?lang=en` / `?lang=ru` pick another, the choice is remembered).
- `src/data/contact.js` — phone / WhatsApp / Telegram / email. All `null` for now, shown as "coming soon"; fill one in and it becomes a link.
- `src/components/` — `Nav`, `Hero`, `Services` (+ marquee), `Process`, `Pricing` (cards, add-ons, comparison table), `Closing` (rent-or-own, terms, FAQ, contact, footer), `ui` (shared pieces).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # writes ./dist
```

Everything respects `prefers-reduced-motion`: no smooth scroll and no animations, content simply shows.

## Deploy (Cloudflare Workers, static assets)

`wrangler.jsonc` publishes `./dist` as the Worker `outreach-premium`. In Cloudflare: Workers & Pages → Create → import this
repository, build command `npm run build`, deploy command `npx wrangler deploy`.
