---
name: wedding-ui-changes
description: Use when making UI, layout, styling, or content changes to the wedding Astro site in src/**/*.astro, src/styles/**/*.css, or public/**. Read the affected files first, keep changes minimal, and only build/deploy to staging when the user explicitly asks to deploy.
---

# Wedding UI Changes

Use this skill for frontend work on the wedding site.

## Use When

- The user wants visual, layout, typography, spacing, responsive, or content changes.
- The work is primarily in `src/**/*.astro`, `src/styles/**/*.css`, or `public/**`.

## Do Not Use When

- The task is only about `infra/**` or deployment configuration.
- The task is only about docs.
- The task is only a code review or planning request.
- The task is backend or infrastructure work for RSVP, D1, Turnstile, or Cloudflare resources.

## Workflow

1. Read the relevant Astro, CSS, and asset files before editing.
2. Preserve the existing visual language unless the user asks for a broader redesign.
3. Make the smallest correct UI change that satisfies the request.
4. Keep changes scoped to existing components and styles unless a new component is clearly justified.
5. Summarize the visual impact in plain language after the change.

## Deployment Rule

- Only deploy when the user explicitly asks to deploy.
- Do not deploy for normal edit requests unless the user asks.

When the user explicitly asks to deploy:

1. Run `npm run build` from the repo root.
2. Only continue if the build succeeds.
3. Run `make -C infra deploy-staging`.
4. Report the build result, deploy result, and staging URL: `https://staging.thesharpes.wedding`.

## Reporting

Include:

- Changed files
- Brief UI summary
- Build status when a build was run
- Deploy status when a deploy was requested
- Any manual checks worth doing for responsive layout, animation, typography, spacing, or music playback behavior

## Guardrails

- Batch related UI edits into one deploy when possible.
- If build or deploy fails, stop and report the blocker clearly.
- Call out when a change has global impact, such as layout, shared typography, or site-wide spacing.
- If a requested UI change also touches `public/_redirects`, `infra/**`, or deployment config, treat that as separate infrastructure work rather than part of this skill.
