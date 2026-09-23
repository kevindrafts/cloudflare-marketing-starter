# Cloudflare Marketing Starter

[![CI](https://github.com/kevindrafts/cloudflare-marketing-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/kevindrafts/cloudflare-marketing-starter/actions/workflows/ci.yml)
[![MIT](https://img.shields.io/badge/license-MIT-183b36)](LICENSE)

A thoughtful, static-first website for your next studio, service business, or product. **Astro + TypeScript + Tailwind CSS + Markdown/MDX**, deployed with **Cloudflare Workers Static Assets**.

![Forma marketing starter](docs/preview.png)

**[Use this template](https://github.com/kevindrafts/cloudflare-marketing-starter/generate)** · [App companion](https://github.com/kevindrafts/cloudflare-app-starter)

## Quickstart

Use GitHub’s **Use this template → Create a new repository**, then clone your copy. To explore this repository directly:

```sh
git clone https://github.com/kevindrafts/cloudflare-marketing-starter.git
cd cloudflare-marketing-starter
nvm install
nvm use
npm install --global pnpm@10.34.5
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:4321**. Node **24.21.0** is pinned in `.nvmrc` and `.node-version`; use your preferred Node manager if you do not use nvm. No Cloudflare account, environment file, database, or CMS is needed locally.

## What’s included

- Responsive home, about, services, journal, contact, and custom 404 pages.
- Reusable header, footer, service list, call-to-action, and original geometric artwork.
- Validated Astro Content Collections, Markdown posts, and MDX support.
- Canonical URLs, descriptions, Open Graph/Twitter metadata, a PNG social card, sitemap, robots.txt, and RSS.
- CSS-variable design tokens, keyboard navigation, visible focus, reduced-motion support, and a native mobile menu.
- Playwright desktop/mobile smoke tests against the actual Workers static asset server.
- MIT license, pinned dependencies, pnpm lockfile, GitHub Actions checks, and Workers Builds instructions.

No React, authentication, database, SSR adapter, or mandatory hosted service is shipped to visitors. Forma is a fictional studio; the copy is sample content, not customer claims.

## Make it yours

| Change                                    | File                                                           |
| ----------------------------------------- | -------------------------------------------------------------- |
| Studio name, email, description, services | `src/data/site.ts`                                             |
| Colors, fonts, spacing, prose styles      | `src/styles/global.css`                                        |
| Page content                              | `src/pages/*.astro`                                            |
| Header/footer branding and SVG wordmark   | `src/components/Logo.astro`, `Header.astro`, `Footer.astro`    |
| Blog entries                              | `src/content/blog/*.{md,mdx}`                                  |
| Content schema                            | `src/content.config.ts`                                        |
| Social artwork and favicon                | `public/social.svg`, `public/social.png`, `public/favicon.svg` |
| Cloudflare Worker name                    | `wrangler.json`                                                |

Some display copy and artwork say “Forma” directly; search for `Forma` / `forma` when rebranding. Replace `hello@example.com` before launch. The contact page opens an email client and does not collect or pretend to submit form data.

To add a post, create a `.md` or `.mdx` file with frontmatter:

```yaml
---
title: A useful idea
description: A short summary for the journal and search engines.
date: 2026-09-23
category: Design
draft: false
---
```

Files marked `draft: true` are excluded from journal pages, generated article routes, and RSS. MDX can import Astro components; it does not require React. Add a React island only if a specific interaction needs it.

Set the public origin before building for production. Copy `.env.example` to `.env` and change `SITE_URL`, or set it in the build environment. It drives canonical URLs, RSS, robots, and sitemap. The default `https://example.com` is deliberately a placeholder.

Regenerate the social PNG after editing `public/social.svg`:

```sh
pnpm social:generate
```

## Commands

| Command        | Purpose                                                    |
| -------------- | ---------------------------------------------------------- |
| `pnpm dev`     | Astro development server                                   |
| `pnpm build`   | Generate static HTML/assets in `dist/`                     |
| `pnpm check`   | Astro and TypeScript checks                                |
| `pnpm test`    | Build and run desktop/mobile Playwright smoke tests        |
| `pnpm preview` | Serve `dist/` in the local Cloudflare runtime on port 4321 |
| `pnpm deploy`  | Build, then publish the static assets to Cloudflare        |
| `pnpm format`  | Format source files                                        |

Before the first test run: `pnpm exec playwright install chromium`. On Linux/CI, use `pnpm exec playwright install --with-deps chromium`. Preview requires a build first; `pnpm test` does that for you. Tests need their port available; local runs can reuse an existing preview server.

## Deploy to Cloudflare

1. Create a Cloudflare account and run `pnpm exec wrangler login`.
2. Set a unique `name` in `wrangler.json` and your real `SITE_URL` in `.env` or the build environment.
3. Run `pnpm check`, then `pnpm deploy`.
4. Add a custom domain in your Worker’s **Settings → Domains & Routes** if desired.

The default deploy is an assets-only Worker. There is no Worker script, server rendering, or Astro Cloudflare adapter. Cloudflare serves the built files, including `404.html` with a proper 404 status.

### Workers Builds (recommended continuous deployment)

Connect **your copied GitHub repository** in Cloudflare Workers & Pages, using `main` as the production branch and repository root `/`. Match the Worker name to `wrangler.json`.

| Setting                       | Value                                                        |
| ----------------------------- | ------------------------------------------------------------ |
| Build command                 | `pnpm install --frozen-lockfile && pnpm check && pnpm build` |
| Deploy command                | `pnpm exec wrangler deploy`                                  |
| Build variable `NODE_VERSION` | `24.21.0`                                                    |
| Build variable `PNPM_VERSION` | `10.34.5`                                                    |
| Build variable `SITE_URL`     | Your public origin, e.g. `https://example.com`               |

GitHub Actions runs checks and browser tests; Workers Builds handles deployment. No Cloudflare secrets belong in GitHub Actions for this setup. Connecting your repository to Workers Builds is an account-specific setup step, not something enabled automatically when cloning a template. Do not enable production auto-deployment until you have replaced the example domain and email. Enable branch previews separately if you need them.

## Optional contact forms

Keep the default email link if that is all you need. For a form, add an explicit Worker `/api/contact` endpoint, server-side validation, and server-side Turnstile verification. Store the Turnstile secret with `wrangler secret put`; never expose it in `PUBLIC_*` variables. Route `/api/*` to the Worker first, return clear success/error responses, and choose your delivery provider explicitly. No form provider is required by this starter.

## Architecture

```text
example.com       → this repo: Astro static HTML + Workers Static Assets
app.example.com   → companion repo: React SPA + Worker API + D1
```

The repositories share a visual vocabulary, not a runtime or deployment. Copy design tokens if you want matching branding. Marketing visitors download no app framework.

## References

- [Cloudflare: Astro](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/)
- [Workers static assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Licensed under [MIT](LICENSE).
