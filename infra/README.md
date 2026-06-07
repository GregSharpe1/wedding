# Infrastructure

Terraform for Cloudflare lives in this directory. Staging and production are separate Terraform roots so they can be planned and applied independently.

## Layout

- `infra/staging`
  - staging Pages project, staging domain, staging D1 database, staging Turnstile widget
- `infra/production`
  - production Pages project, apex + `www` domains, production D1 database, production Turnstile widget
- `infra/modules/pages_rsvp_site`
  - shared module used by both roots

## Required environment variables

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
export CLOUDFLARE_ZONE_ID="..."
export RSVP_INVITE_CODE="..."
```

The Cloudflare provider reads `CLOUDFLARE_API_TOKEN` directly. The Makefile forwards the account and zone IDs to both Terraform roots as `TF_VAR_*` variables.

## Local prerequisites

- Terraform 1.9.8 or newer
- Node.js and npm
- Wrangler available through `npx`

## First-time bootstrap

The existing Pages and DNS resources from the old single-root state are now declared with Terraform `import` blocks inside the new staging and production roots.

```bash
make init-staging
make plan-staging
make apply-staging
```

Production uses the same pattern:

```bash
make init-production
make plan-production
make apply-production
```

## Day-to-day commands

```bash
make fmt
make validate-staging
make validate-production
make plan-staging
make plan-production
make apply-staging
make apply-production
make migrate-staging
make migrate-production
make update-guests-staging
make update-guests-production
make deploy-staging
make deploy-production
```

`make migrate-staging` and `make migrate-production` apply the SQL files under `../migrations/` to the D1 database from the matching Terraform root output.

`make update-guests-staging` and `make update-guests-production` import new invites from `../invites.json` without removing existing guests or RSVP statuses. Override the file with `INVITES_FILE=/path/to/file.json` if needed.

`make reset-guests-staging` and `make reset-guests-production` fully replace the invite list and should only be used when you intentionally want to wipe RSVP data.

## Notes

- Terraform state is local for now, separately under `infra/staging/` and `infra/production/`.
- The default `*.pages.dev` hostnames remain enabled.
- `production_branch` stays set to `main` on the direct-upload projects even though deployments are currently run locally.
- Terraform manages the Turnstile secret and Pages secret environment variables, so each environment's `terraform.tfstate` contains sensitive data. Treat both as sensitive.
- The widgets currently allow only the custom domains defined in each environment root. If you need extra preview hostnames later, add them explicitly in Terraform.
