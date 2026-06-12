import { spawn } from 'node:child_process';

function parseArgs(argv) {
  const options = {
    database: '',
    config: '',
    environment: '',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--database') {
      options.database = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--config') {
      options.config = argv[index + 1] ?? '';
      index += 1;
    } else if (arg === '--environment') {
      options.environment = argv[index + 1] ?? '';
      index += 1;
    }
  }

  if (!options.database) {
    throw new Error('Missing required --database <name> argument.');
  }

  if (!options.config) {
    throw new Error('Missing required --config <path> argument.');
  }

  if (!options.environment) {
    throw new Error('Missing required --environment <name> argument.');
  }

  return options;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(stderr.trim() || `${command} ${args.join(' ')} exited with code ${code}.`));
    });
  });
}

function formatPercent(numerator, denominator) {
  if (denominator === 0) {
    return '0.0%';
  }

  return `${((numerator / denominator) * 100).toFixed(1)}%`;
}

function padLabel(label) {
  return label.padEnd(18, ' ');
}

function printMetric(label, value, detail = '') {
  const line = `${padLabel(label)} ${value}`;
  process.stdout.write(detail ? `${line}   ${detail}\n` : `${line}\n`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM invites) AS total_invites,
      (SELECT COUNT(*) FROM invites WHERE status = 'submitted') AS submitted_invites,
      (SELECT COUNT(*) FROM invites WHERE status = 'pending') AS pending_invites,
      (SELECT COUNT(*) FROM invite_people) AS total_people,
      (SELECT COUNT(*) FROM rsvp_attendees WHERE attendance_status = 'attending') AS attending_people,
      (SELECT COUNT(*) FROM rsvps WHERE created_at >= datetime('now', '-7 days')) AS replies_last_7d
  `;

  const output = await run('npx', [
    'wrangler',
    'd1',
    'execute',
    options.database,
    '--config',
    options.config,
    '--remote',
    '--json',
    '--command',
    sql,
  ]);

  const payload = JSON.parse(output);
  const row = payload[0]?.results?.[0];

  if (!row) {
    throw new Error('No KPI data returned from D1.');
  }

  const totalInvites = Number(row.total_invites ?? 0);
  const submittedInvites = Number(row.submitted_invites ?? 0);
  const pendingInvites = Number(row.pending_invites ?? 0);
  const totalPeople = Number(row.total_people ?? 0);
  const attendingPeople = Number(row.attending_people ?? 0);
  const repliesLast7d = Number(row.replies_last_7d ?? 0);

  process.stdout.write(`RSVP KPI: ${options.environment}\n\n`);
  printMetric('Response rate', formatPercent(submittedInvites, totalInvites), `(${submittedInvites} / ${totalInvites} invites)`);
  printMetric('Attendance rate', formatPercent(attendingPeople, totalPeople), `(${attendingPeople} / ${totalPeople} people)`);
  printMetric('7d velocity', String(repliesLast7d), 'invites replied in last 7 days');
  printMetric('Pending households', String(pendingInvites));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
