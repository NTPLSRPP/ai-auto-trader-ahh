#!/bin/bash
set -e

# Multi-architecture Docker build and push script
# Builds for linux/amd64 and linux/arm64

DOCKER_USER="lynchz"
SERVER_IMAGE="${DOCKER_USER}/trader-ahh-server"
CLIENT_IMAGE="${DOCKER_USER}/trader-ahh-client"
TAG="${1:-latest}"

echo "Building and pushing images with tag: ${TAG}"

# Ensure buildx builder exists
if ! docker buildx inspect multiarch-builder >/dev/null 2>&1; then
    echo "Creating buildx builder..."
    docker buildx create --name multiarch-builder --use
fi

docker buildx use multiarch-builder

# Build and push server
echo ""
echo "=== Building Server Image ==="
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag "${SERVER_IMAGE}:${TAG}" \
    --tag "${SERVER_IMAGE}:latest" \
    --push \
    ./server

# Build and push client
echo ""
echo "=== Building Client Image ==="
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag "${CLIENT_IMAGE}:${TAG}" \
    --tag "${CLIENT_IMAGE}:latest" \
    --push \
    ./client

echo ""
echo "=== Done ==="
echo "Images pushed:"
echo "  - ${SERVER_IMAGE}:${TAG}"
echo "  - ${CLIENT_IMAGE}:${TAG}"
