import { copyFile, rename, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';

function parseArgs(argv) {
  const separatorIndex = argv.indexOf('--');

  if (separatorIndex === -1) {
    throw new Error('Expected -- before the command to run.');
  }

  const options = {
    config: '',
    command: argv.slice(separatorIndex + 1),
  };

  for (let index = 0; index < separatorIndex; index += 1) {
    const arg = argv[index];

    if (arg === '--config') {
      options.config = argv[index + 1] ?? '';
      index += 1;
    }
  }

  if (!options.config) {
    throw new Error('Missing required --config <file> argument.');
  }

  if (options.command.length === 0) {
    throw new Error('Missing command to run.');
  }

  return options;
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
  const projectRoot = process.cwd();
  const wranglerConfigPath = join(projectRoot, 'wrangler.toml');
  const backupPath = join(projectRoot, 'wrangler.toml.backup-opencode');

  await copyFile(wranglerConfigPath, backupPath);

  try {
    await copyFile(join(projectRoot, options.config), wranglerConfigPath);
    const [command, ...args] = options.command;
    await run(command, args);
  } finally {
    await rename(backupPath, wranglerConfigPath).catch(async () => {
      await rm(backupPath, { force: true });
    });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
