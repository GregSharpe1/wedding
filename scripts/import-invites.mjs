import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { spawn } from 'node:child_process';

function parseArgs(argv) {
  const options = {
    input: '',
    database: '',
    clearExisting: false,
    dryRun: false,
    remote: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--input') {
      options.input = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--database') {
      options.database = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--clear-existing') {
      options.clearExisting = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--remote') {
      options.remote = true;
    }
  }

  if (!options.input) {
    throw new Error('Missing required --input <file> argument.');
  }

  if (!options.database && !options.dryRun) {
    throw new Error('Missing required --database <name> argument.');
  }

  return options;
}

function escapeSql(value) {
  return value.replaceAll("'", "''");
}

function createToken() {
  return randomBytes(24).toString('base64url');
}

function normalizeInviteType(value) {
  const inviteType = String(value ?? 'day').trim().toLowerCase();

  if (inviteType !== 'day' && inviteType !== 'evening') {
    throw new Error(`Invalid inviteType '${value}'. Use 'day' or 'evening'.`);
  }

  return inviteType;
}

function buildInviteExistsClause(invite) {
  const labelValue = invite.label ? `'${escapeSql(invite.label)}'` : 'NULL';
  const peopleCount = invite.people.length;
  const firstPeople = invite.people
    .map(
      (person) =>
        `SELECT '${escapeSql(person.firstName)}' AS first_name, '${escapeSql(person.surname)}' AS surname`
    )
    .join(' UNION ALL ');

  return `EXISTS (
    SELECT 1
    FROM invites existing_invites
    WHERE existing_invites.surname = '${escapeSql(invite.surname)}'
      AND existing_invites.invite_type = '${invite.inviteType}'
      AND ${invite.label ? `existing_invites.label = ${labelValue}` : 'existing_invites.label IS NULL'}
      AND (
        SELECT COUNT(*)
        FROM invite_people existing_people
        WHERE existing_people.invite_id = existing_invites.id
      ) = ${peopleCount}
      AND NOT EXISTS (
        SELECT 1
        FROM (${firstPeople}) incoming_people
        WHERE NOT EXISTS (
          SELECT 1
          FROM invite_people existing_people
          WHERE existing_people.invite_id = existing_invites.id
            AND existing_people.first_name = incoming_people.first_name
            AND existing_people.surname = incoming_people.surname
        )
      )
  )`;
}

function validateInvite(invite, inviteIndex) {
  if (!invite || typeof invite !== 'object') {
    throw new Error(`Invite ${inviteIndex + 1} must be an object.`);
  }

  if (!Array.isArray(invite.people) || invite.people.length < 1) {
    throw new Error(`Invite ${inviteIndex + 1} must contain at least 1 person.`);
  }

  const normalizedPeople = invite.people.map((person, personIndex) => {
    if (!person || typeof person !== 'object') {
      throw new Error(`Invite ${inviteIndex + 1}, person ${personIndex + 1} must be an object.`);
    }

    const firstName = String(person.firstName ?? '').trim();
    const surname = String(person.surname ?? '').trim();

    if (!firstName || !surname) {
      throw new Error(`Invite ${inviteIndex + 1}, person ${personIndex + 1} must include firstName and surname.`);
    }

    return { firstName, surname };
  });

  const surname = normalizedPeople[0].surname;

  for (const person of normalizedPeople) {
    if (person.surname.toLowerCase() !== surname.toLowerCase()) {
      throw new Error(`Invite ${inviteIndex + 1} must use one shared surname for lookup.`);
    }
  }

  return {
    label: typeof invite.label === 'string' ? invite.label.trim() : '',
    inviteType: normalizeInviteType(invite.inviteType),
    surname,
    people: normalizedPeople,
  };
}

function buildSql(invites, clearExisting) {
  const statements = [];

  if (clearExisting) {
    statements.push('DELETE FROM rsvps;');
    statements.push('DELETE FROM invite_people;');
    statements.push('DELETE FROM invites;');
  }

  for (const invite of invites) {
    const token = createToken();
    const labelValue = invite.label ? `'${escapeSql(invite.label)}'` : 'NULL';
    const inviteExistsClause = buildInviteExistsClause(invite);

    statements.push(
      `INSERT INTO invites (label, invite_type, surname, token)
       SELECT ${labelValue}, '${invite.inviteType}', '${escapeSql(invite.surname)}', '${token}'
       WHERE NOT ${inviteExistsClause};`
    );

    for (const person of invite.people) {
      statements.push(
        `INSERT INTO invite_people (invite_id, first_name, surname)
         SELECT id, '${escapeSql(person.firstName)}', '${escapeSql(person.surname)}'
         FROM invites
         WHERE token = '${token}';`
      );
    }
  }

  return `${statements.join('\n')}\n`;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}.`));
    });
  });
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const fileContents = await readFile(options.input, 'utf8');
  const parsedInvites = JSON.parse(fileContents);

  if (!Array.isArray(parsedInvites) || parsedInvites.length === 0) {
    throw new Error('Invite JSON must be a non-empty array.');
  }

  const invites = parsedInvites.map(validateInvite);
  const sql = buildSql(invites, options.clearExisting);

  if (options.dryRun) {
    process.stdout.write(sql);
    return;
  }

  const tempDirectory = await mkdtemp(join(tmpdir(), 'wedding-invites-'));
  const tempFile = join(tempDirectory, 'import.sql');

  try {
    await writeFile(tempFile, sql, 'utf8');
    const args = ['wrangler', 'd1', 'execute', options.database, '--file', tempFile];

    if (options.remote) {
      args.push('--remote');
    }

    await run('npx', args);
  } finally {
    await rm(tempDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
