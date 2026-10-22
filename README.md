# Vectora.work — landing page

Static landing page for Vectora.work, built for AWS Amplify Hosting. No build step,
no dependencies: plain HTML, CSS, and a small vanilla script.

## Files

| File | Purpose |
|---|---|
| `index.html` | The page: hero, services, nationwide coverage map, intake form, footer |
| `styles.css` | Design tokens and all styling |
| `script.js` | Google Form embed, Resume-project link, mobile nav, reveal animations |
| `js-flag.js` | Tiny head script that marks the page as JS-enabled (keeps content visible without JS) |
| `amplify.yml` | Amplify build spec (publishes the folder as-is) |
| `customHttp.yml` | Security headers incl. a strict Content-Security-Policy |
| `vectora-logo.webp`, `favicon.svg` | Logo and favicon, kept at the root so drag-and-drop uploads work |

## Two settings to fill in (top of `script.js`)

**`GOOGLE_FORM_URL`** — the new-client intake form.
1. In Google Forms open your form → **Send** → the `< >` embed tab → copy the `src` URL
   (it looks like `https://docs.google.com/forms/d/e/1FAIpQLS.../viewform?embedded=true`).
2. Paste it into `GOOGLE_FORM_URL`. It must be a `docs.google.com/forms/.../viewform` link;
   `forms.gle` short links and `/edit` links are rejected (a warning appears in the browser console).
3. The form must not require sign-in (no "restrict to organisation", no file-upload questions,
   no "limit to 1 response"), or Google refuses to show it inside the page.

Until a valid URL is set, the contact section shows an "opens shortly" notice.

**`RESUME_PROJECT_URL`** — where the header "Resume project" button goes (client portal, status
form, scheduling link). Any `https://` URL. Leave empty and the button points at the intake section.

## Deploy

Amplify is connected to `Jakeatfootprint/Vectora-`, and this folder is already a git repo with
that remote. To publish a change:

```bash
git add index.html styles.css script.js
git commit -m "feat: describe the change"
git push
```

First push ever (sign in once, then push):

```bash
/opt/homebrew/bin/gh auth login --hostname github.com --git-protocol https --web
git push -u origin main
```

Amplify picks up `amplify.yml` and `customHttp.yml` from the repo root. After the first deploy,
confirm the headers are served: `curl -I https://<your-amplify-domain>/`.

## Notes

- The CSP forbids inline `style=""` attributes and inline `<script>` blocks. Keep styles in
  `styles.css` and scripts in the `.js` files, or the browser will drop them.
- Add an absolute `og:image` (PNG or JPG, 1200×630) once the final domain is known; social
  scrapers do not accept relative paths or WebP reliably.
- US state outlines from [svg-maps](https://github.com/VictorCazanave/svg-maps) (MIT), reduced to
  bare paths. The map dots mark major markets and are decorative.
