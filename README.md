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
cd infra
make init
make import-project
make plan
make apply
make deploy
make deploy-production
```

See `infra/README.md` for required environment variables and the staging bootstrap flow.

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

The RSVP form is currently shown as "opening soon" and disabled. The Cloudflare D1-backed RSVP flow will be added in a later step.
