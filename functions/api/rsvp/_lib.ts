export const NEUTRAL_ERROR_MESSAGE =
  "We couldn't open an RSVP from those details. If you've already replied or need help, please contact Greg or Lucy.";

const PERSON_ATTENDANCE_VALUES = new Set(['attending', 'not_attending']);

export interface Env {
  DB: D1Database;
  RSVP_INVITE_CODE?: string;
  RSVP_SLACK_NOTIFY_TOKEN?: string;
  SLACK_WEBHOOK_URL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const LOOKUP_WINDOW_MINUTES = 10;
const LOOKUP_MAX_ATTEMPTS = 10;

interface InviteRow {
  invite_id: number;
  label: string | null;
  invite_type: 'day' | 'evening';
  surname: string;
  token: string;
  status: 'pending' | 'submitted';
  invite_person_id: number;
  first_name: string;
  person_surname: string;
}

export interface InviteRecord {
  id: number;
  label: string | null;
  inviteType: 'day' | 'evening';
  surname: string;
  token: string;
  status: 'pending' | 'submitted';
  people: Array<{
    id: number;
    firstName: string;
    surname: string;
  }>;
}

export interface SubmitPayload {
  attendees: unknown;
  dietaryRequirements: unknown;
  songRequest: unknown;
  message: unknown;
  turnstileToken: unknown;
}

export interface ValidatedSubmitPayload {
  attendees: Array<{
    invitePersonId: number;
    attendanceStatus: 'attending' | 'not_attending';
  }>;
  attendanceStatus: 'accepts' | 'declines';
  guestCount: number;
  guestNames: string;
  dietaryRequirements: string;
  songRequest: string;
  message: string;
  turnstileToken: string;
}

interface TurnstileVerificationResult {
  success?: boolean;
  action?: string;
  hostname?: string;
}

export function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers ?? {}),
    },
  });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function normalizeText(value: unknown) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

export function normalizeName(value: unknown) {
  return normalizeText(value).toLocaleLowerCase('en-GB');
}

export function normalizeInviteCode(value: unknown) {
  return normalizeText(value).toLocaleLowerCase('en-GB');
}

export function normalizeTurnstileToken(value: unknown) {
  return normalizeText(value);
}

export function isAllowedRequestOrigin(request: Request) {
  const requestUrl = new URL(request.url);
  const allowedOrigin = requestUrl.origin;
  const originHeader = normalizeText(request.headers.get('origin'));

  if (originHeader) {
    return originHeader === allowedOrigin;
  }

  const refererHeader = normalizeText(request.headers.get('referer'));

  if (!refererHeader) {
    return false;
  }

  try {
    return new URL(refererHeader).origin === allowedOrigin;
  } catch {
    return false;
  }
}

export function validateInviteCode(env: Env, inviteCode: unknown) {
  const configuredCode = normalizeInviteCode(env.RSVP_INVITE_CODE);

  if (!configuredCode || normalizeInviteCode(inviteCode) !== configuredCode) {
    return false;
  }

  return true;
}

function groupInvites(rows: InviteRow[]): InviteRecord[] {
  const invites = new Map<number, InviteRecord>();

  for (const row of rows) {
    const invite = invites.get(row.invite_id) ?? {
      id: row.invite_id,
      label: row.label,
      inviteType: row.invite_type,
      surname: row.surname,
      token: row.token,
      status: row.status,
      people: [],
    };

    invite.people.push({
      id: row.invite_person_id,
      firstName: row.first_name,
      surname: row.person_surname,
    });

    invites.set(row.invite_id, invite);
  }

  return [...invites.values()];
}

async function loadInviteRows(env: Env, whereClause: string, binding: string) {
  const statement = env.DB.prepare(
    `SELECT
      invites.id AS invite_id,
      invites.label,
      invites.invite_type,
      invites.surname,
      invites.token,
      invites.status,
      invite_people.id AS invite_person_id,
      invite_people.first_name,
      invite_people.surname AS person_surname
    FROM invites
    INNER JOIN invite_people ON invite_people.invite_id = invites.id
    WHERE ${whereClause}
    ORDER BY invites.id ASC, invite_people.id ASC`
  );

  const result = await statement.bind(binding).all<InviteRow>();
  return groupInvites(result.results ?? []);
}

export async function findPendingInvitesBySurname(env: Env, surname: string) {
  return loadInviteRows(env, 'LOWER(invites.surname) = ?1 AND invites.status = \'pending\'', surname);
}

export async function findInviteByToken(env: Env, token: string) {
  const matches = await loadInviteRows(env, 'invites.token = ?1', token);
  return matches[0] ?? null;
}

export function selectInviteByFirstName(invites: InviteRecord[], firstName: string) {
  return invites.filter((invite) =>
    invite.people.some((person) => normalizeName(person.firstName) === firstName)
  );
}

export function formatInviteTitle(invite: InviteRecord) {
  if (invite.label) {
    return invite.label;
  }

  const firstNames = invite.people.map((person) => person.firstName);
  return firstNames.join(' & ');
}

function requireLength(value: string, maxLength: number, message: string) {
  if (value.length > maxLength) {
    throw new Error(message);
  }
}

function normalizeAttendees(value: unknown) {
  if (!Array.isArray(value)) {
    throw new Error('Please respond for each invited guest.');
  }

  return value.map((attendee) => {
    if (!attendee || typeof attendee !== 'object') {
      throw new Error('Please respond for each invited guest.');
    }

    const invitePersonId = Number((attendee as { invitePersonId?: unknown }).invitePersonId);
    const attendanceStatus = normalizeText((attendee as { attendanceStatus?: unknown }).attendanceStatus);

    if (!Number.isInteger(invitePersonId) || invitePersonId < 1) {
      throw new Error('Please respond for each invited guest.');
    }

    if (!PERSON_ATTENDANCE_VALUES.has(attendanceStatus)) {
      throw new Error('Please choose attending or not attending for each invited guest.');
    }

    return {
      invitePersonId,
      attendanceStatus: attendanceStatus as 'attending' | 'not_attending',
    };
  });
}

export function validateSubmitPayload(payload: SubmitPayload, invite: InviteRecord): ValidatedSubmitPayload {
  const attendees = normalizeAttendees(payload.attendees);
  const dietaryRequirements = normalizeText(payload.dietaryRequirements);
  const songRequest = normalizeText(payload.songRequest);
  const message = normalizeText(payload.message);
  const turnstileToken = normalizeText(payload.turnstileToken);

  if (attendees.length !== invite.people.length) {
    throw new Error('Please respond for each invited guest.');
  }

  const invitePersonIds = new Set(invite.people.map((person) => person.id));
  const seenPersonIds = new Set<number>();

  for (const attendee of attendees) {
    if (!invitePersonIds.has(attendee.invitePersonId)) {
      throw new Error('Please respond only for the guests listed on your invitation.');
    }

    if (seenPersonIds.has(attendee.invitePersonId)) {
      throw new Error('Please respond for each invited guest once.');
    }

    seenPersonIds.add(attendee.invitePersonId);
  }

  requireLength(dietaryRequirements, 1000, 'Dietary requirements must be 1000 characters or fewer.');
  requireLength(songRequest, 300, 'Song requests must be 300 characters or fewer.');
  requireLength(message, 1500, 'Your message must be 1500 characters or fewer.');

  if (normalizeText(payload.turnstileToken) && !turnstileToken) {
    throw new Error('We could not verify your submission. Please try again.');
  }

  const attendingPeople = attendees.filter((attendee) => attendee.attendanceStatus === 'attending');
  const guestNames = invite.people
    .filter((person) => attendingPeople.some((attendee) => attendee.invitePersonId === person.id))
    .map((person) => `${person.firstName} ${person.surname}`)
    .join(', ');

  return {
    attendees,
    attendanceStatus: (attendingPeople.length > 0 ? 'accepts' : 'declines') as 'accepts' | 'declines',
    guestCount: Math.max(attendingPeople.length, 1),
    guestNames,
    dietaryRequirements,
    songRequest,
    message,
    turnstileToken,
  };
}

export function buildNotifyUrl(request: Request) {
  return new URL('/api/rsvp/slack', request.url).toString();
}

export function isValidNotifyToken(env: Env, request: Request) {
  const configuredToken = normalizeText(env.RSVP_SLACK_NOTIFY_TOKEN);

  if (!configuredToken) {
    return false;
  }

  return normalizeText(request.headers.get('x-rsvp-slack-token')) === configuredToken;
}

export async function verifyTurnstile(request: Request, env: Env, token: string, expectedAction: string) {
  const secret = normalizeText(env.TURNSTILE_SECRET_KEY);

  if (!secret) {
    return true;
  }

  if (!token) {
    return false;
  }

  const formData = new URLSearchParams({
    secret,
    response: token,
  });

  const remoteIp = request.headers.get('CF-Connecting-IP');

  if (remoteIp) {
    formData.set('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as TurnstileVerificationResult;

  if (result.success !== true) {
    return false;
  }

  const expectedHostname = new URL(request.url).hostname;

  if (result.hostname !== expectedHostname) {
    return false;
  }

  return result.action === expectedAction;
}

async function hashText(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function isLookupRateLimited(env: Env, request: Request) {
  const requesterIp = normalizeText(request.headers.get('CF-Connecting-IP'));

  if (!requesterIp) {
    return false;
  }

  const requesterHash = await hashText(requesterIp);
  const countResult = await env.DB.prepare(
    `SELECT COUNT(*) AS request_count
    FROM rsvp_lookup_attempts
    WHERE requester_hash = ?1
      AND created_at >= datetime('now', '-${LOOKUP_WINDOW_MINUTES} minutes')`
  )
    .bind(requesterHash)
    .all<{ request_count: number }>();

  const attemptCount = Number(countResult.results?.[0]?.request_count ?? 0);

  if (attemptCount >= LOOKUP_MAX_ATTEMPTS) {
    return true;
  }

  await env.DB.prepare(`INSERT INTO rsvp_lookup_attempts (requester_hash) VALUES (?1)`).bind(requesterHash).all();

  return false;
}
