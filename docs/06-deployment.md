# Deployment Plan

## Initial Setup

After the Astro project is created:

```bash
npm install
npm run dev
```

## Cloudflare Pages Setup

1. Open Cloudflare Dashboard.
2. Go to Workers & Pages.
3. Create a Pages project.
4. Connect the GitHub repository `GregSharpe1/wedding`.
5. Select the production branch.
6. Configure the build settings.

Recommended build settings:

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
```

## D1 Setup

Create the D1 databases through the separate Terraform roots in `infra/`:

```bash
make -C infra apply-staging
make -C infra apply-production
```

Apply the migrations after Terraform has created the databases:

```bash
make -C infra migrate-staging
make -C infra migrate-production
```

If production infrastructure is disabled, skip the production migration target.

## Pages Bindings

Terraform configures the Turnstile widget, the Pages bindings, and the environment variables for each Pages project.

Expected D1 binding name:

```text
DB
```

Add Turnstile secret variable:

```text
TURNSTILE_SECRET_KEY
```

Add public site key for the frontend build:

```text
PUBLIC_TURNSTILE_SITE_KEY
```

Optional Slack notification variables:

```text
RSVP_SLACK_NOTIFY_TOKEN
SLACK_WEBHOOK_URL
```

## Turnstile Setup

1. Terraform creates the Turnstile widget.
2. Each environment root registers its own custom domains on its widget.
3. If you want extra preview hostnames later, add them to the matching Terraform root.

## Production Domain

1. Add the custom domain to the Pages project.
2. Ensure DNS is managed by Cloudflare.
3. Let Cloudflare issue the SSL certificate.
4. Confirm both apex and `www` behaviour if required.

## Smoke Tests

Before sharing the site:

- Load the homepage on desktop.
- Load the homepage on mobile.
- Confirm navigation anchors work.
- Scroll and confirm music playback attempts.
- Confirm fallback music control works if needed.
- Submit an RSVP accepting.
- Submit an RSVP declining.
- Verify D1 rows are created.
- Verify the Slack message arrives if notifications are configured.
- Test validation errors.
- Test Turnstile protection in staging and production.
