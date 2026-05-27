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

Create a D1 database, for example:

```bash
npx wrangler d1 create wedding-rsvps
```

Apply the migration once migrations exist:

```bash
npx wrangler d1 migrations apply wedding-rsvps
```

For production, apply with the current Wrangler production flag at implementation time.

## Pages Bindings

Bind the D1 database to the Pages project with binding name:

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

## Turnstile Setup

1. Create a Turnstile widget in Cloudflare.
2. Add the production domain.
3. Add the preview Pages domain if needed.
4. Store the site key in Pages environment variables.
5. Store the secret key in Pages environment variables.

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
- Test validation errors.
- Test Turnstile protection in production.
