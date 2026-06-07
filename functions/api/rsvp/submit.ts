import {
  NEUTRAL_ERROR_MESSAGE,
  findInviteByToken,
  isAllowedRequestOrigin,
  json,
  normalizeText,
  readJson,
  validateSubmitPayload,
  verifyTurnstile,
  type Env,
} from './_lib';

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!isAllowedRequestOrigin(request)) {
    return json({ ok: false, error: 'Please return to the RSVP page and try again.' }, { status: 403 });
  }

  const body = await readJson(request);

  if (!body) {
    return json({ ok: false, error: 'Please try again.' }, { status: 400 });
  }

  const token = normalizeText(body.token);

  if (!token) {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  const invite = await findInviteByToken(env, token);

  if (!invite || invite.status !== 'pending') {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  let payload;

  try {
    payload = validateSubmitPayload(body);
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : 'Please check your RSVP and try again.' },
      { status: 400 }
    );
  }

  const turnstileValid = await verifyTurnstile(request, env, payload.turnstileToken, 'submit');

  if (!turnstileValid) {
    return json({ ok: false, error: 'We could not verify your submission. Please try again.' }, { status: 400 });
  }

  const insertResult = await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO rsvps (
        invite_id,
        attendance_status,
        guest_count,
        guest_names,
        dietary_requirements,
        song_request,
        message
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    ).bind(
      invite.id,
      payload.attendanceStatus,
      payload.guestCount,
      payload.guestNames || null,
      payload.dietaryRequirements || null,
      payload.songRequest || null,
      payload.message || null
    ),
    env.DB.prepare(`UPDATE invites SET status = 'submitted', submitted_at = CURRENT_TIMESTAMP WHERE id = ?1 AND status = 'pending'`).bind(
      invite.id
    ),
  ]);

  const updatedInvite = insertResult[1];

  if (!updatedInvite.success) {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 409 });
  }

  return json({ ok: true });
};
