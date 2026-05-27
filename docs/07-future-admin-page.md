# Future Admin Page

## Purpose

The admin page is deferred until after the first release. Its purpose would be to make RSVP management easier without using Cloudflare dashboard or CLI tools directly.

## Possible Features

- View all RSVP submissions.
- Filter by accepting or declining.
- Search by name or email.
- View dietary requirements.
- View song requests.
- Export CSV.
- Mark duplicate submissions.
- Delete spam submissions.

## Possible Route

```text
/admin
```

## Access Control Options

Recommended first choice:

- Cloudflare Access protecting `/admin`.

Alternative:

- Basic password gate using an environment variable.

Avoid building full user authentication unless there is a clear need.

## API Endpoints Later

Potential endpoints:

```text
GET /api/admin/rsvps
GET /api/admin/rsvps.csv
DELETE /api/admin/rsvps/:id
```

## Data Export

CSV export should include:

- Submission date
- Name
- Email
- Attendance status
- Guest count
- Guest names
- Dietary requirements
- Song request
- Message
