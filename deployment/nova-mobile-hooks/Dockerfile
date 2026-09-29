# Frontend-only recovery image. Build static assets off production first.
FROM pipeshubai/pipeshub-ai@sha256:1776dfc71088babaf17a199e7e6c939ca3d2f014a3483f5a0b62b6e8e6e3a6b8
ARG SOURCE_REVISION
LABEL org.opencontainers.image.revision=$SOURCE_REVISION
LABEL com.sup3rnova.patch="sidebar-unconditional-hooks"
# Keep original hashed chunks available for tabs already open during cutover.
COPY out/ /app/backend/dist/public/
