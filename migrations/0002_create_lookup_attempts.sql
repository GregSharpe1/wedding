CREATE TABLE rsvp_lookup_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_rsvp_lookup_attempts_requester_created_at
  ON rsvp_lookup_attempts (requester_hash, created_at);
