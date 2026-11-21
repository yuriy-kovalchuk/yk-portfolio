# syntax=docker/dockerfile:1

# Hugo runs only at build time: the image that ships contains nginx and static
# files, nothing else. Both bases are pinned by digest.
#   hugo:   docker buildx imagetools inspect ghcr.io/gohugoio/hugo:v0.169.0
#   nginx:  docker buildx imagetools inspect cgr.dev/chainguard/nginx:latest
FROM ghcr.io/gohugoio/hugo:v0.169.0@sha256:a146e0639230bbc73358e6563240f0a6103466f0390b80a457c775068ec802a9 AS site
ENTRYPOINT []
WORKDIR /project
# The Hugo image runs as uid 1000, which needs to write its build lock here.
COPY --chown=1000:1000 . .
RUN hugo --gc --minify --destination /project/public

FROM cgr.dev/chainguard/nginx:latest@sha256:c1642395cc75f39c931d66d939f7e78cbdf671d6cfd821616632b0639c3c6d63
# Replace the base image's own server block rather than adding a second one: it
# also listens on 8080 with server_name localhost, so it would answer every
# request addressed to localhost without the headers configured here.
COPY nginx.conf /etc/nginx/conf.d/nginx.default.conf
COPY --from=site /project/public /usr/share/nginx/html
EXPOSE 8080
