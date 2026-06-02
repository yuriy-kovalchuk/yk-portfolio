# yk-portfolio

Static portfolio site served by Chainguard nginx.

## Stack
- Pure HTML/CSS/JS — no build step
- `cgr.dev/chainguard/nginx` — no shell, non-root, zero-CVE base image
- Deployed to Kubernetes, image hosted on GHCR

## Key files
- `index.html`, `style.css`, `script.js`, `content.js` — site content
- `assets/` — images and favicon
- `nginx.conf` — server config (port 8080, gzip, security headers)
- `Dockerfile` — pinned to digest, never use `latest` tag

## Local development
```bash
make run    # build image + serve at http://localhost:8080
make build  # build image only
```

## Release process
Push a `v*` tag → CD builds + pushes multi-arch image (amd64/arm64) to GHCR + creates GitHub Release.

Image: `ghcr.io/yuriy-kovalchuk/yk-portfolio`
