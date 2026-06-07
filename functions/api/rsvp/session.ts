import { NEUTRAL_ERROR_MESSAGE, findInviteByToken, formatInviteTitle, json, normalizeText, type Env } from './_lib';

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  const token = normalizeText(new URL(request.url).searchParams.get('token'));

  if (!token) {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  const invite = await findInviteByToken(env, token);

  if (!invite || invite.status !== 'pending') {
    return json({ ok: false, error: NEUTRAL_ERROR_MESSAGE }, { status: 404 });
  }

  return json({
    ok: true,
    invite: {
      title: formatInviteTitle(invite),
      people: invite.people,
    },
  });
};
