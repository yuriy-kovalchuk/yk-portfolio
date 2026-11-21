IMAGE      ?= ghcr.io/yuriy-kovalchuk/yk-portfolio
VERSION    ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
PLATFORMS  ?= linux/amd64,linux/arm64
HUGO_IMAGE ?= ghcr.io/gohugoio/hugo:v0.169.0
TRIVY_IMAGE ?= aquasec/trivy:0.76.2@sha256:8f6bb947dbc528902e11f2f5be52f7b519f6a39d5d148f41166f2040499768fb
HUGO        = docker run --rm -v "$(CURDIR):/project" -u "$$(id -u):$$(id -g)" \
              -e HOME=/tmp -e HUGO_CACHEDIR=/tmp/hugo-cache $(HUGO_IMAGE)

.PHONY: all build run serve site test scan buildx-setup docker-build docker-push clean help

all: test build

## build: build the container image locally
build:
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

## run: build the image and serve on http://localhost:8080
run: build
	docker run --rm -p 8080:8080 --name yk-portfolio $(IMAGE):latest

## serve: Hugo live-reload server on http://localhost:1313
serve:
	docker run --rm -p 1313:1313 -v "$(CURDIR):/project" -u "$$(id -u):$$(id -g)" \
	  -e HOME=/tmp -e HUGO_CACHEDIR=/tmp/hugo-cache $(HUGO_IMAGE) \
	  server --bind 0.0.0.0 --baseURL http://localhost:1313/ --poll 500ms

## site: render the site into public/ unminified, which is what the tests read
site:
	$(HUGO) --gc --cleanDestinationDir --destination /project/public

## test: render the site, then check what was produced
test: site
	node --test "tests/*.test.mjs"

## scan: build the image, then fail on fixable HIGH or CRITICAL vulnerabilities, as CI does
scan: build
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
	  -v "$(HOME)/.cache/trivy:/root/.cache/trivy" $(TRIVY_IMAGE) \
	  image --severity CRITICAL,HIGH --ignore-unfixed --exit-code 1 $(IMAGE):$(VERSION)

## buildx-setup: create or start the multi-platform buildx builder
buildx-setup:
	docker buildx create --name multiplatform --driver docker-container --bootstrap --use 2>/dev/null || \
	  docker buildx inspect --bootstrap multiplatform

## docker-build: build multi-arch image (does not push)
docker-build: buildx-setup
	docker buildx build \
	  --builder multiplatform \
	  --platform $(PLATFORMS) \
	  -t $(IMAGE):$(VERSION) \
	  -t $(IMAGE):latest \
	  .

## docker-push: build and push multi-arch image to GHCR
docker-push: buildx-setup
	docker buildx build \
	  --builder multiplatform \
	  --platform $(PLATFORMS) \
	  -t $(IMAGE):$(VERSION) \
	  -t $(IMAGE):latest \
	  --push \
	  .

## clean: remove the rendered site and local images
clean:
	rm -rf public
	docker rmi $(IMAGE):$(VERSION) $(IMAGE):latest 2>/dev/null || true

## help: list available make targets
help:
	@grep -E '^## ' Makefile | sed 's/^## //' | column -t -s ':'
