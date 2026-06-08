ALTER TABLE invites ADD COLUMN invite_type TEXT NOT NULL DEFAULT 'day';

CREATE INDEX idx_invites_type_status ON invites (invite_type, status);
