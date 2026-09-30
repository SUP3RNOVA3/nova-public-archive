# NOVA maintained PipesHub fork

Start here for SUP3RNOVA work. Upstream README/LICENSE remain intact.

## Branches and artifacts
- `upstream` remote: https://github.com/pipeshub-ai/pipeshub-ai.git
- `main`: upstream reference, not NOVA production.
- `nova/main`: default integration branch for NOVA, starting at official v0.9.1
  (`be85e8b53dc38536bcf9f801edaf16780c857f2c`) plus mobile fix `a677946`.
- Work in `nova/feature-*` branches and PR into `nova/main`.
- `nova-v0.9.1-setup.1` marks the initial setup. Tags are never moved.
- CI publishes `ghcr.io/sup3rnova3/nova-pipeshub:sha-<full-commit>`.
  Deploy by registry digest, not a mutable tag. Builds do not deploy.
- `.github/upstream-workflows/` preserves upstream automation as inactive source.
  During merges, review any reintroduced `.github/workflows/` before pushing.

## Reuse versus gap
| Need | Existing capability | Decision |
| --- | --- | --- |
| Name/logo/prompts and personal connections | Native admin settings | Keep native; no hardcoded tenant data |
| Hosting | Existing Coolify service | Reuse; no new runtime or routing |
| Source ownership | GitHub fork | Thin maintained divergence |
| Build/distribution | GitHub Actions + GHCR | Compile off production; pinned base |
| White label | Frontend source | Isolated assets/theme; no auth rewrite |
| Operations console | Deferred request | Parking lot, not part of setup |

## Scope of the image
`deployment/nova/Dockerfile` overlays the compiled frontend on a pinned official
0.9.1 slim image. It intentionally does NOT compile backend changes. Any backend
change requires a separate full-build design and corresponding tests before release.
The only application delta initially is the mobile sidebar hook-order correction.
Native tenant settings and credentials are runtime data, never repository content.
Apache-2.0 license and upstream notices must be preserved; NOVA modifications are
tracked in Git and this document. Public source must contain no internal data.

## Update procedure
1. Fetch upstream tags. Choose a released version, never blindly track upstream main.
2. Create `nova/update-<version>` from `nova/main`; merge the exact release tag.
3. Review release notes, migrations, dependencies and effective Compose differences.
   Resolve conflicts explicitly. Update the Dockerfile base digest to the matching
   release: frontend and backend must remain version-compatible.
4. Review/park upstream workflows. Check our patch register below. Remove obsolete
   fixes only after their regression tests pass against the new upstream code.
5. Open PR. CI must pass mobile regression and production build/type checks. For
   functional changes, add relevant backend/permission tests; frontend CI is insufficient.
6. Publish a candidate commit image. Test that exact digest in isolated staging with
   separate databases, credentials and OAuth callbacks. Never attach production
   volumes or live Slack events to staging. No staging runtime is deployed by this setup.
7. Acceptance: fresh WorkOS login/logout, Member admin denial, two-user connector
   isolation, chat response, Slack final message, desktop/mobile transitions and reload.
   Record actual results; do not infer permissions from model instructions.
8. Before production: verified multi-store backup/restore plan, prior image digest and
   saved Coolify definition. Assess database migration reversibility separately.
9. Promote the tested digest through existing Coolify service, app only; verify health
   and acceptance. Tag the approved source and record source/digest/deployment evidence.
   Do not automatically merge updates or deploy on push.
10. Roll back both Coolify desired definition and effective deployment. Image rollback
    alone is not sufficient after incompatible database migrations.

## Patch register
| Change | Source | Retirement condition |
| --- | --- | --- |
| Mobile hook ordering | a677946, sidebar-base.tsx | Upstream passes both existing regression tests |
| NOVA build/release documentation | setup commit | Maintained for the lifetime of the fork |

## Current acceptance boundaries
This repository setup does not change production. Existing production remains the
local `nova-pipeshub:0.9.1-mobile-a677946` image until a separate tested cutover.
Outstanding pilot gates: real Member isolation, full multi-store restore test,
Slack presentation bug and staged upgrade rehearsal. These are not CI claims.
