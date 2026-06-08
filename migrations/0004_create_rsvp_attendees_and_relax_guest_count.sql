CREATE TABLE rsvps_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id INTEGER NOT NULL UNIQUE,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('accepts', 'declines')),
  guest_count INTEGER NOT NULL CHECK (guest_count >= 1),
  guest_names TEXT,
  dietary_requirements TEXT,
  song_request TEXT,
  message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE
);

INSERT INTO rsvps_new (
  id,
  invite_id,
  attendance_status,
  guest_count,
  guest_names,
  dietary_requirements,
  song_request,
  message,
  created_at
)
SELECT
  id,
  invite_id,
  attendance_status,
  guest_count,
  guest_names,
  dietary_requirements,
  song_request,
  message,
  created_at
FROM rsvps;

DROP TABLE rsvps;
ALTER TABLE rsvps_new RENAME TO rsvps;
CREATE INDEX idx_rsvps_created_at ON rsvps (created_at);

CREATE TABLE rsvp_attendees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id INTEGER NOT NULL,
  invite_person_id INTEGER NOT NULL,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('attending', 'not_attending')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE,
  FOREIGN KEY (invite_person_id) REFERENCES invite_people(id) ON DELETE CASCADE,
  UNIQUE (invite_id, invite_person_id)
);

CREATE INDEX idx_rsvp_attendees_invite_id ON rsvp_attendees (invite_id);
