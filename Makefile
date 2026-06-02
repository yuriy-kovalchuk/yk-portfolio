IMAGE     ?= ghcr.io/yuriy-kovalchuk/yk-portfolio
VERSION   ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo dev)
PLATFORMS ?= linux/amd64,linux/arm64

.PHONY: all build run buildx-setup docker-build docker-push clean help

all: build

## build: build the Docker image locally
build:
	docker build -t $(IMAGE):$(VERSION) -t $(IMAGE):latest .

## run: build and serve the site locally on http://localhost:8080
run: build
	docker run --rm -p 8080:8080 --name yk-portfolio $(IMAGE):latest

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

## clean: remove local images
clean:
	docker rmi $(IMAGE):$(VERSION) $(IMAGE):latest 2>/dev/null || true

## help: list available make targets
help:
	@grep -E '^## ' Makefile | sed 's/^## //' | column -t -s ':'
