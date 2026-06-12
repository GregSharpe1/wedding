import {
  NEUTRAL_ERROR_MESSAGE,
  findPendingInvitesBySurname,
  isLookupRateLimited,
  isAllowedRequestOrigin,
  json,
  normalizeName,
  normalizeTurnstileToken,
  readJson,
  selectInviteByFirstName,
  validateInviteCode,
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

  if (!validateInviteCode(env, body.inviteCode)) {
    return json({ ok: false, error: 'Please enter the invite code from your invitation.' }, { status: 401 });
  }

  if (await isLookupRateLimited(env, request)) {
    return json({ ok: false, error: 'Please wait a few minutes before trying again.' }, { status: 429 });
  }

  const turnstileValid = await verifyTurnstile(request, env, normalizeTurnstileToken(body.turnstileToken), 'lookup');

  if (!turnstileValid) {
    return json({ ok: false, error: 'We could not verify your lookup. Please try again.' }, { status: 400 });
  }

  const surname = normalizeName(body.surname);

  if (!surname) {
    return json({ ok: false, error: 'Please enter a surname from your invitation.' }, { status: 400 });
  }

  const matches = await findPendingInvitesBySurname(env, surname);

  if (matches.length === 0) {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  if (matches.length === 1) {
    return json({ ok: true, redirectUrl: `/rsvp?token=${encodeURIComponent(matches[0].token)}` });
  }

  const firstName = normalizeName(body.firstName);

  if (!firstName) {
    return json({ ok: true, needsFirstName: true });
  }

  const narrowedMatches = selectInviteByFirstName(matches, firstName);

  if (narrowedMatches.length !== 1) {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  return json({ ok: true, redirectUrl: `/rsvp?token=${encodeURIComponent(narrowedMatches[0].token)}` });
};
