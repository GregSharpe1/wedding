# The Sharpes Wedding

Astro rebuild of the Greg + Lucy wedding website for `thesharpes.wedding`.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Infrastructure

Cloudflare infrastructure lives in `infra/`.

```bash
make -C infra init-staging
make -C infra plan-staging
make -C infra apply-staging
make -C infra deploy-staging

make -C infra init-production
make -C infra plan-production
make -C infra apply-production
make -C infra deploy-production

make -C infra update-guests-staging
```

See `infra/README.md` for required environment variables and the per-environment bootstrap flow.

Cloudflare Pages should use:

```text
Build command: npm run build
Build output directory: dist
```

## Music Track

Drop the final two-minute audio file here:

```text
public/audio/wedding-track.mp3
```

Keep that exact filename. Once the file exists, the site will include the music player and attempt to play the track on the visitor's first scroll, touch, pointer, wheel, or keyboard interaction.

Until the file exists, the music player is not rendered, so there is no broken audio request.

## RSVP

The RSVP flow lives on `/rsvp` and depends on the Cloudflare resources managed under `infra/staging` and `infra/production`.

If `RSVP_SLACK_NOTIFY_TOKEN` and `SLACK_WEBHOOK_URL` are configured through Terraform, successful RSVP submissions also trigger a Slack notification.
