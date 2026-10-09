# Irontech Detailing website

Public Next.js App Router website for Irontech Steel Detailing Services Pvt Ltd. Pages: home, about, services, projects, careers and contact. Content lives in `src/data`; photographs live in `public/assets`.

## Local development

Use Node 22.18+ for the included TypeScript-based Node tests (Next itself requires Node 20.9+). Install the locked dependencies with `npm ci`, then run `npm run dev`. The default address is http://localhost:3000.

- `npm run lint` — ESLint.
- `npm run type-check` — TypeScript (may update its incremental cache).
- `npm test` — image fitting, form validation/delivery acknowledgement tests; no network or email.
- `npm run images:check` — verify metadata against the original files without changing them.
- `npm run build`, then `npm start` — production build and local server. Google Fonts are downloaded during a fresh build. The form endpoint requires a Next-capable server, not a static-only host.

## Project photographs

Images retain their native proportions and full composition. Cards use responsive optimized previews. The viewer loads only the selected original file, fits without upscaling, and offers zoom up to 100% with scrolling. Thumbnail frames use `contain`; captions sit outside photographs. The featured showcase no longer applies geometric or colour distortion to the client's imagery.

When adding or replacing photos, run `npm run images:audit` to regenerate `src/data/image-metadata.json`, then `npm run images:check` and `npm test`. The audit reads image metadata only and never rewrites image files. Keep `src/data/projects.ts` dimensions aligned. Do not infer tonnage or categories from an absent value.

The old `scrape/` scripts are historical migration utilities. They reference an obsolete `.scrape/` path and `gen.js` produces an older project schema. Do not run them against the maintained project archive.

## Forms and email

Both forms validate locally and on the server through shared Zod schemas. Optional quote scope accepts a blank selection. Success is shown only when the server explicitly confirms delivery; otherwise the filled form remains available with a direct email fallback.

The existing endpoint reads `RESEND_API_KEY`, `ENQUIRY_TO`, and `ENQUIRY_FROM`. Provider configuration is intentionally deferred. Never use real customer information for local checks. To prevent external delivery in a local preview, launch with an explicitly empty `RESEND_API_KEY`; use isolated mock responses for submission tests. With no provider the existing endpoint logs submissions, so avoid sending personal data to it.

## Browser regression checks

Check all six routes at desktop and mobile widths. In Projects, verify landscape and portrait cards, both layouts/filters, all photos within a project, fit/original/zoom controls, and small-source images that must not upscale. Check keyboard Tab/Shift+Tab containment, Escape, focus restoration, rapid open/close, and browser Back in both modal interfaces. Check the homepage showcase/photo wall, pause controls and reduced-motion preference. Verify the company logo, full company name, white background with violet-blue accents, the dark-theme toggle and all four standards (AISC, NISD, OSHA, IBC) on each route. Light mode is the default; the header and mobile menu provide a theme toggle, and the selected theme persists across navigation and reloads. Check both themes at narrow widths. The site has no ambient sound controls; the decorative hero video remains muted. Mock form responses for delivered, unavailable and server-error cases; do not send real email.

No automated deployment configuration is committed here. Confirm hosting and production mail configuration separately.
