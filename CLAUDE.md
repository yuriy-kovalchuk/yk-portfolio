# yk-portfolio

Material 3 portfolio site. Hugo renders it at build time; the shipped image is
nginx serving static files.

## Stack
- Hugo (custom theme in `layouts/`) — build time only, never in the runtime image
- Markdown content + one YAML data file — no database, no server-side code
- Hand-written Material 3 CSS tokens and two small first-party scripts
- `cgr.dev/chainguard/nginx` — no shell, non-root, zero-CVE base image
- Deployed to Kubernetes, image hosted on GHCR

## Layout of the repo
- `hugo.toml` — site config; one page plus 404, no sections, no generator tag
- `data/portfolio.yaml` — every fact on the page: profile, about, experience,
  projects, skills. Sourced from the CV (`yk-cv`) and the project repositories
- `layouts/index.html` — the one page: hero, About, Experience, Projects, Skills
- `layouts/baseof.html` — head, sticky top bar with section anchors, footer
- `layouts/404.html`, `static/error.html` — not-found page, and the page nginx
  serves for every other error so its built-in pages never show
- `assets/css/site.css` — Material 3 tokens (light + dark) and the layout
- `assets/js/theme.js` — appearance from `localStorage`, applied before first paint
- `static/` — portrait, favicon, self-hosted Roboto
- `nginx.conf` — port 8080, gzip, CSP, cache policy keyed on content type
- `Dockerfile` — Hugo stage then Chainguard nginx, both pinned by digest
- `tests/site.test.mjs` — checks the rendered site in `public/`

## Local development
```bash
make serve   # Hugo live-reload server at http://localhost:1313
make test    # render into public/, then node --test tests/
make run     # build the image and serve at http://localhost:8080
make scan    # build the image, then Trivy: fails on fixable HIGH/CRITICAL
```
Hugo is only needed through `make` — it runs in a pinned container, so there is
nothing to install locally.

## Content rules
- Every fact must come from the CV or a public repository; nothing invented.
- Projects are cards linking to their GitHub repository; the README is the detail page.
- The only contact details are GitHub and LinkedIn: no email, phone or location.
- No availability or job-seeking wording ("open to", "available for", ...).
- The published site never names what builds or serves it (Hugo, nginx, the
  base image). The tests enforce this, including Hugo's generator tag.

## Hard constraints
- CSP is `default-src 'self'`: no CDN assets, no inline `<script>`, no inline
  `style=""` attributes. The test suite enforces this.
- The Trivy gate is never `continue-on-error`: a finding is fixed by moving a
  base digest, not by silencing the scan. The full report still goes to SARIF.
- Both image bases are pinned by digest; never move to a mutable `latest` in the
  `FROM` line.
- Everything must work with JavaScript disabled: filtering and appearance
  switching are enhancements.
- `nginx.conf` is copied over the base image's `conf.d/nginx.default.conf`.
  Adding it under another name leaves the stock server block answering
  `Host: localhost` without any of the security headers.

## Release process
Push to `master` → CD scans the image with Trivy (fixable HIGH/CRITICAL fails
the job before anything is pushed), then builds and pushes the multi-arch image (amd64/arm64) to
GHCR. Push a `v*` tag → GitHub Release.

Image: `ghcr.io/yuriy-kovalchuk/yk-portfolio`
