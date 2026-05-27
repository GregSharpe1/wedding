# Cloudflare Architecture

## Services

```text
Cloudflare Pages
  Hosts the Astro site.

Pages Functions
  Handles API routes such as POST /api/rsvp.

Cloudflare D1
  Stores RSVP form submissions.

Cloudflare Turnstile
  Protects the RSVP form from basic bot submissions.

Cloudflare DNS and SSL
  Hosts the production domain and provides HTTPS.
```

## Request Flow

```text
Visitor opens site
  -> Cloudflare Pages serves static Astro page

Visitor submits RSVP form
  -> Browser posts to /api/rsvp
  -> Pages Function validates request
  -> Pages Function verifies Turnstile token
  -> Pages Function inserts RSVP into D1
  -> Browser receives success or error response
```

## Environment Bindings

Expected Cloudflare bindings:

```text
DB
  D1 database binding for RSVP submissions

TURNSTILE_SECRET_KEY
  Secret key used by the RSVP function to verify Turnstile responses
```

Expected public environment value:

```text
PUBLIC_TURNSTILE_SITE_KEY
  Site key used by the RSVP form widget
```

## Pages Functions Location

For Cloudflare Pages, API functions should be placed under:

```text
functions/
  api/
    rsvp.ts
```

This creates an endpoint at:

```text
/api/rsvp
```

## Wrangler Configuration

Use `wrangler.toml` for local development and binding documentation.

Example shape:

```toml
name = "wedding"
compatibility_date = "2026-05-27"
pages_build_output_dir = "dist"

[[d1_databases]]
binding = "DB"
database_name = "wedding-rsvps"
database_id = "replace-with-cloudflare-d1-id"
```

## Local Development

Local development should use:

```bash
npm run dev
```

For testing Pages Functions and D1 bindings locally, use Wrangler once the project exists:

```bash
npx wrangler pages dev dist
```

or the current Cloudflare-recommended Pages development command at implementation time.
