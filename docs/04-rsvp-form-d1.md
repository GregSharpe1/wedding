# RSVP Form And D1 Storage

## Form Fields

Initial fields:

- Full name
- Email
- Attendance status
- Number of guests including the submitter
- Guest names
- Dietary restrictions or allergies
- Song request for the Spotify playlist
- Note for the couple

## Field Names

Use predictable API field names:

```text
fullName
email
attendanceStatus
guestCount
guestNames
dietaryRequirements
songRequest
message
turnstileToken
```

## Attendance Values

Use stable values instead of display text:

```text
accepts
declines
```

The UI can display:

- joyfully accepts
- regretfully declines

## D1 Schema

Proposed table:

```sql
CREATE TABLE rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('accepts', 'declines')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  guest_names TEXT,
  dietary_requirements TEXT,
  song_request TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Recommended indexes:

```sql
CREATE INDEX idx_rsvps_created_at ON rsvps (created_at);
CREATE INDEX idx_rsvps_email ON rsvps (email);
CREATE INDEX idx_rsvps_attendance_status ON rsvps (attendance_status);
```

## API Endpoint

Endpoint:

```text
POST /api/rsvp
```

Expected JSON response on success:

```json
{
  "ok": true
}
```

Expected JSON response on validation failure:

```json
{
  "ok": false,
  "error": "Please enter your name."
}
```

## Validation Rules

- `fullName` is required.
- `email` is required and must look like an email address.
- `attendanceStatus` must be `accepts` or `declines`.
- `guestCount` must be a whole number between 1 and a sensible maximum, such as 6.
- Text fields should be trimmed.
- Text fields should have maximum lengths.
- Turnstile token is required in production.

Suggested maximum lengths:

```text
fullName: 120
email: 254
guestNames: 1000
dietaryRequirements: 1000
songRequest: 300
message: 1500
```

## Spam Protection

Use Cloudflare Turnstile on the RSVP form.

The Pages Function should verify the token by posting to:

```text
https://challenges.cloudflare.com/turnstile/v0/siteverify
```

## Duplicate Submissions

For the first version, allow duplicate submissions. This lets guests update by submitting again.

Later options:

- Add an admin process to reconcile duplicates.
- Add unique invite links.
- Add an update flow using email verification.

## Viewing RSVPs Before Admin Page Exists

Until an admin page is built, view or export data using Cloudflare D1 tooling.

Example query:

```sql
SELECT * FROM rsvps ORDER BY created_at DESC;
```
