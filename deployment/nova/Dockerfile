# Frontend overlay only; backend remains the pinned official release.
FROM pipeshubai/pipeshub-ai@sha256:1776dfc71088babaf17a199e7e6c939ca3d2f014a3483f5a0b62b6e8e6e3a6b8
ARG SOURCE_REVISION
LABEL org.opencontainers.image.source="https://github.com/SUP3RNOVA3/nova-pipeshub" \
      org.opencontainers.image.revision=$SOURCE_REVISION \
      org.opencontainers.image.licenses="Apache-2.0"
COPY out/ /app/backend/dist/public/
