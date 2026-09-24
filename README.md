# ₿itcoin Flagship

Grassroots Bitcoin adoption community site — built with Next.js 13, React 18, Tailwind CSS, and shadcn/ui.

## About

Bitcoin Flagship is a community-driven movement accelerating Bitcoin adoption through meetups, education, public art, and social campaigns. The site includes a **Community Wall** where bitcoin-only stories can be shared, liked, and tipped in sats over the Lightning Network.

## Features

- Pages: Home, About, Events, Community Wall, Blog (+ individual posts), Contact
- **Lightning tipping** — QR invoice modal + Lightning address in the footer
- **Community Wall** — bitcoin-only UGC feed with live likes and sats tips
- Provider abstraction: `mock` (default), `lnd`, or `btcpayserver`

## Tech Stack

- **Next.js 13.5** (App Router, static generation + API routes)
- **React 18**
- **Tailwind CSS 3** + shadcn/ui components
- **Lucide** icons
- **qrcode.react** for Lightning invoice QR codes

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

## Lightning Tipping

The site ships in **mock mode** by default so you can test the full tip flow (including a "Simulate payment" button).

To take real payments, set the provider and credentials — either via `.env.local` locally or as environment variables on Vercel:

```bash
# mock | lnd | btcpayserver
LIGHTNING_PROVIDER=lnd

# For LND (REST API)
LND_HOST=https://your-node:8080
LND_MACAROON=0201036c6e6432...
LND_TLS_CERT=<base64 of tls.cert>

# For BTCPay Server
BTCPAY_URL=https://btcpay.yourdomain.com
BTCPAY_API_KEY=<api key>
BTCPAY_STORE_ID=<store id>

# Public Lightning address shown in the footer
NEXT_PUBLIC_LIGHTNING_ADDRESS=tips@bitcoinflagship.org

# Canonical site URL (fixes social metadata previews)
NEXT_PUBLIC_SITE_URL=https://bitcoinflagship.com
```

See `.env.example` for the full list.

## API Routes

| Route | Purpose |
| ----- | ------- |
| `POST /api/lightning/invoice` | Generate a Lightning invoice (returns bolt11 + QR payload) |
| `POST /api/lightning/verify` | Check payment status for an invoice |
| `POST /api/lightning/simulate` | Mark an invoice paid (mock mode only) |

## Scripts

| Command           | Description             |
| ----------------- | ----------------------- |
| `npm run dev`     | Start the dev server    |
| `npm run build`   | Production build        |
| `npm run start`   | Serve production build  |
| `npm run lint`    | Run ESLint              |
| `npm run typecheck` | Run TypeScript check  |

## Content

All site content (events, blog posts, community posts, categories) lives in **`lib/data.ts`** as plain static data — edit that file to update the site. The logo is in **`public/logo.png`**.

## Deployment

Deployed on **Vercel** (`vercel.json`). A `netlify.toml` is also present if you ever want to switch to Netlify.

## Custom Domain (bitcoinflagship.com)

The site is configured to run on **https://bitcoinflagship.com**. To go live:

1. **DNS** — at your registrar, add:
   | Type  | Name      | Value                 |
   | ----- | --------- | --------------------- |
   | A     | `@`       | `76.76.21.21`         |
   | AAAA  | `@`       | `2606:4700::6810:84e5`|
   | CNAME | `www`     | `cname.vercel-dns.com`|
2. **Vercel** — Settings → Domains: add `bitcoinflagship.com` + `www`, set a redirect canonical URL.
3. **Verify** — open the **Domain Setup** page (`/domain-setup`) from the live domain and confirm all checks are green.

Also see `.env.local` / env vars (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_LIGHTNING_ADDRESS`).