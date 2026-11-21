# yk-portfolio

Personal site of Yuriy Kovalchuk: one page with experience, open-source
projects and skills.

Built with Hugo, styled with Material 3 design tokens, served by Chainguard
nginx. Hugo runs only during the image build; what ships is static files behind
a locked-down Content-Security-Policy. No JavaScript frameworks, no third-party
assets, and the site is fully readable with JavaScript disabled.

## Try it

```bash
git clone https://github.com/yuriy-kovalchuk/yk-portfolio
cd yk-portfolio
make serve    # Hugo live-reload on http://localhost:1313
make test     # render the site and run the checks
make run      # build the container and serve on http://localhost:8080
make scan     # build the container and fail on fixable HIGH or CRITICAL CVEs
```

Hugo runs in a pinned container through the Makefile, so there is nothing to
install on your machine beyond Docker.

## Deploying

The image listens on 8080 and runs as a non-root user with no shell.

```yaml
ports:
  - containerPort: 8080
readinessProbe:
  httpGet: { path: /, port: 8080 }
```

Pushing to `master` scans the image with Trivy first: a HIGH or CRITICAL
vulnerability with a fix available stops the push, so `:latest` stays on the
last clean image. Otherwise it builds and pushes a multi-arch image (amd64/arm64) to
`ghcr.io/yuriy-kovalchuk/yk-portfolio`.
