# Agent guide

- Read `README.md` for customization and deployment details. Keep this an independent, static Astro marketing site; avoid app frameworks, auth, databases, and mandatory services unless requested.
- Use Node from `.nvmrc` and pnpm from `package.json` (`npm install -g pnpm@10.34.5` if needed). Run `pnpm install --frozen-lockfile`, then `pnpm dev` at `http://localhost:4321`. Local work needs no Cloudflare account or environment file.
- Pages: `src/pages/`. Reusable sections: `src/components/`. Brand copy: `src/data/site.ts`. Blog: `src/content/blog/`, validated by `src/content.config.ts`; drafts are excluded from builds.
- Colors live in `src/styles/global.css` under `@theme`. Use named Tailwind tokens or CSS variables, including inline SVG fills. Standalone artwork templates live in `scripts/assets/`; `pnpm brand:generate` creates the public favicon/social files. It runs before dev/build; rerun after palette edits during a session. Keep asset-referenced tokens literal hex colors and commit regenerated assets.
- Before finishing, run `pnpm check` and `pnpm test`. First install Chromium with `pnpm exec playwright install chromium` (Linux: add `--with-deps`). Stop any server on port 4321 so tests build and start their production preview. Format changed files with Prettier and inspect affected layouts on desktop/mobile.
- `pnpm build` creates `dist/`; `pnpm preview` serves it in the local Cloudflare runtime. Deployment uses Workers Static Assets and Workers Builds. Set `SITE_URL` and the Worker name before `pnpm deploy`; deploy only when the task calls for it.
- Keep dependencies and lockfile in sync. Never commit secrets, `.env`, `dist/`, or `.wrangler/`. Preserve accessibility and the marketing/app separation.
