# Infrastructure

Terraform for Cloudflare lives in this directory. The current scope is the staging Pages project plus a separate production Pages project.

## Managed now

- Pages project: `thesharpes-wedding-staging`
- Custom domain: `staging.thesharpes.wedding`
- Cloudflare DNS CNAME for the staging hostname
- Production Pages project: `thesharpes-wedding`
- Production apex domain: `thesharpes.wedding`
- Production www domain: `www.thesharpes.wedding`

## Planned later

- RSVP infrastructure such as D1, Turnstile, and Pages Functions bindings

## Required environment variables

```bash
export CLOUDFLARE_API_TOKEN="..."
export CLOUDFLARE_ACCOUNT_ID="..."
export CLOUDFLARE_ZONE_ID="..."
```

The Cloudflare provider reads `CLOUDFLARE_API_TOKEN` directly. The Makefile forwards the account and zone IDs to Terraform as `TF_VAR_*` variables.

## Local prerequisites

- Terraform 1.9.8 or newer
- Node.js and npm
- Wrangler available through `npx`

## First-time bootstrap

The staging Pages project was created manually and should be imported before the first apply. The production Pages project is created by Terraform.

```bash
make init
make import-project
make plan
make apply
```

After `apply`, Terraform will keep the staging project managed, create the production project, create the staging/production DNS records, and attach the custom domains.

## Day-to-day commands

```bash
make fmt
make validate
make plan
make apply
make deploy
make deploy-production
```

`make deploy` and `make deploy-staging` publish to the staging Pages project. `make deploy-production` publishes the same built site to the production Pages project. This is compatible with a later move to GitHub Actions because CI can call the same targets with the same environment variables.

## Notes

- Terraform state is local for now.
- The default `*.pages.dev` hostname remains enabled.
- `production_branch` stays set to `main` on the direct-upload projects even though deployments are currently run locally.
