# v0.9.1 mobile sidebar recovery

User-approved exception to stock-only deployment, scoped to SidebarBase hook order.
All existing hooks now execute before mobile early returns. No authentication,
permissions, APIs, dependencies or UI behavior intentionally changed.

Build the frontend away from production using the committed package-lock.json:

1. `ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm ci --legacy-peer-deps`
2. `npm run test:unit -- app/components/sidebar/sidebar-base.test.tsx`
3. `ELECTRON_STATIC=1 NEXT_TELEMETRY_DISABLED=1 npm run build`
4. Place frontend `out/` beside this Dockerfile; build with SOURCE_REVISION set to
   the source commit. The base digest is the deployed official slim image.
5. Back up effective Compose/env and retain the prior image, persist the candidate
   image in Coolify, then recreate only pipeshub-ai with its existing env/network.
6. Require complete service readiness, then test an authenticated chat at narrow
   and wide widths, cold narrow reload, drawer open/close and return to desktop.

The regression test fails against stock SidebarBase in both viewport directions.
Do not equate these tests with a new OAuth login or testing on a physical iPhone.
Before an upstream upgrade, check if this defect is fixed and remove this overlay
when upstream passes the same regression test. No proxy JavaScript rewriting.
