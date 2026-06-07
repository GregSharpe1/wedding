import { json, readJson, validateInviteCode, type Env } from './_lib';

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  const body = await readJson(request);

  if (!body) {
    return json({ ok: false, error: 'Please try again.' }, { status: 400 });
  }

  if (!validateInviteCode(env, body.inviteCode)) {
    return json({ ok: false, error: 'Please enter the correct invite code from your invitation.' }, { status: 401 });
  }

  return json({ ok: true });
};
