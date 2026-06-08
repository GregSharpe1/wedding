CREATE TABLE invites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT,
  invite_type TEXT NOT NULL DEFAULT 'day' CHECK (invite_type IN ('day', 'evening')),
  surname TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted')),
  submitted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invite_people (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invite_id INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  FOREIGN KEY (invite_id) REFERENCES invites(id) ON DELETE CASCADE
);

CREATE TABLE rsvps (
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

CREATE INDEX idx_invites_surname_status ON invites (surname, status);
CREATE INDEX idx_invite_people_invite_id ON invite_people (invite_id);
CREATE INDEX idx_invite_people_first_name ON invite_people (first_name);
CREATE INDEX idx_rsvps_created_at ON rsvps (created_at);
