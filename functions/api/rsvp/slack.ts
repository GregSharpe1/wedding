import {
  buildNotifyUrl,
  formatInviteTitle,
  isValidNotifyToken,
  json,
  normalizeText,
  readJson,
  type Env,
  type InviteRecord,
  type ValidatedSubmitPayload,
} from './_lib';

interface NotifyPayload {
  invite: InviteRecord;
  response: ValidatedSubmitPayload;
}

function formatAttendanceLine(invite: InviteRecord, response: ValidatedSubmitPayload) {
  return invite.people
    .map((person) => {
      const attendee = response.attendees.find((entry) => entry.invitePersonId === person.id);
      const status = attendee?.attendanceStatus === 'attending' ? 'attending' : 'not attending';
      return `- ${person.firstName} ${person.surname}: ${status}`;
    })
    .join('\n');
}

function buildSlackText(invite: InviteRecord, response: ValidatedSubmitPayload) {
  const lines = [
    `New wedding RSVP from ${formatInviteTitle(invite)}`,
    `Invite type: ${invite.inviteType}`,
    `Overall response: ${response.attendanceStatus}`,
    `Attending guests: ${response.guestNames || 'None'}`,
    `Guest count: ${response.guestCount}`,
    'Guest responses:',
    formatAttendanceLine(invite, response),
    `Song request: ${response.songRequest || 'None'}`,
    `Message: ${response.message || 'None'}`,
  ];

  return lines.join('\n');
}

function isNotifyPayload(value: unknown): value is NotifyPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return 'invite' in value && 'response' in value;
}

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!isValidNotifyToken(env, request)) {
    return json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  const webhookUrl = normalizeText(env.SLACK_WEBHOOK_URL);

  if (!webhookUrl) {
    return json({ ok: true, skipped: true });
  }

  const body = await readJson(request);

  if (!isNotifyPayload(body)) {
    return json({ ok: false, error: 'Invalid payload' }, { status: 400 });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      text: buildSlackText(body.invite, body.response),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return json({ ok: false, error: errorText || 'Slack webhook failed' }, { status: 502 });
  }

  return json({ ok: true });
};

export async function sendSlackRsvpNotification(
  request: Request,
  env: Env,
  invite: InviteRecord,
  response: ValidatedSubmitPayload
) {
  const notifyToken = normalizeText(env.RSVP_SLACK_NOTIFY_TOKEN);

  if (!notifyToken || !normalizeText(env.SLACK_WEBHOOK_URL)) {
    return;
  }

  const notifyResponse = await fetch(buildNotifyUrl(request), {
    method: 'POST',
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-rsvp-slack-token': notifyToken,
    },
    body: JSON.stringify({
      invite,
      response,
    }),
  });

  if (!notifyResponse.ok) {
    const errorText = await notifyResponse.text();
    throw new Error(errorText || 'Slack notification failed');
  }
}
