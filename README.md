# ₿itcoin Flagship

Grassroots Bitcoin adoption community site — built with Next.js 13, React 18, Tailwind CSS, and shadcn/ui.

## About

Bitcoin Flagship is a community-driven movement accelerating Bitcoin adoption through meetups, education, public art, and social campaigns.

## Tech Stack

- **Next.js 13.5** (App Router, static generation)
- **React 18**
- **Tailwind CSS 3** + shadcn/ui components
- **Lucide** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the site.

## Scripts

| Command           | Description            |
| ----------------- | ---------------------- |
| `npm run dev`     | Start the dev server   |
| `npm run build`   | Production build        |
| `npm run start`   | Serve production build |
| `npm run lint`    | Run ESLint             |
| `npm run typecheck` | Run TypeScript check   |

## Content

All site content (events, blog posts, categories) lives in **`lib/data.ts`** as plain static data — edit that file to update the site. The logo is in **`public/logo.png`**.

## Deployment

Deployable to Netlify via `@netlify/plugin-nextjs`. See `netlify.toml`.