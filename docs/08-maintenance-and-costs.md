# Maintenance And Costs

## Expected Monthly Costs

For normal wedding site traffic, expected Cloudflare cost is likely zero.

```text
Cloudflare Pages: $0/month likely
Pages Functions: $0/month likely
D1: $0/month likely
Turnstile: $0/month
Audio hosted in Pages assets: $0/month likely
Cloudflare DNS and SSL: $0/month
```

The main likely recurring cost is the domain name.

Typical domain cost:

```text
Approximately $10-20/year
Approximately $1-2/month equivalent
```

## Editing Content

In the first release, edit content directly in Astro components under:

```text
src/components/
```

If content editing becomes too scattered, move content into a single data file later.

## Replacing The Music Track

Replace:

```text
public/audio/wedding-track.mp3
```

Keep the same filename if possible so code does not need to change.

## Viewing RSVP Data

Before an admin page exists, inspect RSVP rows through Cloudflare D1.

Example query:

```sql
SELECT * FROM rsvps ORDER BY created_at DESC;
```

## Backing Up RSVP Data

The repo now supports scheduled JSON snapshots of each D1 database into R2:

- Production: daily snapshots, 90-day retention
- Staging: weekly snapshots, 30-day retention

Each snapshot stores the schema and rows for every application table in the database, which keeps the backup files small and easy to inspect.

At the current RSVP data size, these backups should remain well within Cloudflare's free R2 tier. Expected ongoing cost is likely still $0/month unless the dataset grows dramatically or the account is already incurring Workers/R2 charges elsewhere.

If the backup Workers are not deployed yet, periodically export the D1 tables to CSV or SQL before the RSVP deadline.

Suggested backup moments:

- After first successful production test
- Weekly once invites are sent
- Daily during the final week before the RSVP deadline
- Immediately after the RSVP deadline

## Routine Deployment

Typical update flow:

```bash
npm run build
git add .
git commit -m "Update wedding site"
git push
```

Cloudflare Pages should deploy automatically after push.

## Operational Risks

- Browser autoplay rules may block music on some devices until a manual fallback is used.
- RSVP submissions depend on D1 binding and Turnstile environment variables being configured correctly.
- If the public audio file is very large, first load performance may suffer.
- If the domain is not on Cloudflare DNS, Pages custom domain setup may require extra DNS configuration.
