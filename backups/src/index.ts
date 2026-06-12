interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

interface ScheduledController {
  cron: string;
  scheduledTime: number;
}

interface R2ObjectInfo {
  key: string;
  uploaded: Date;
}

interface R2ListResult {
  objects: R2ObjectInfo[];
  truncated: boolean;
  cursor?: string;
}

interface R2Bucket {
  put(
    key: string,
    value: string,
    options?: {
      httpMetadata?: {
        contentType?: string;
      };
      customMetadata?: Record<string, string>;
    }
  ): Promise<void>;
  list(options?: { prefix?: string; cursor?: string }): Promise<R2ListResult>;
  delete(keys: string | string[]): Promise<void>;
}

interface Env {
  DB: D1Database;
  BACKUPS: R2Bucket;
  BACKUP_ENVIRONMENT: string;
  BACKUP_RETENTION_DAYS: string;
}

interface TableSchemaRow {
  name: string;
  sql: string | null;
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function buildBackupKey(environment: string, timestamp: string) {
  const [date] = timestamp.split('T');
  return `${environment}/${date}/${timestamp}.json`;
}

function buildLatestKey(environment: string) {
  return `${environment}/latest.json`;
}

function parseRetentionDays(value: string) {
  const days = Number(value);

  if (!Number.isInteger(days) || days < 1) {
    throw new Error(`Invalid BACKUP_RETENTION_DAYS value '${value}'.`);
  }

  return days;
}

async function loadTables(env: Env) {
  const tableResult = await env.DB.prepare(
    `SELECT name, sql
     FROM sqlite_schema
     WHERE type = 'table'
       AND name NOT LIKE 'sqlite_%'
       AND name != '_cf_KV'
     ORDER BY name ASC`
  ).all<TableSchemaRow>();

  const tables = tableResult.results ?? [];

  return Promise.all(
    tables.map(async (table) => {
      const rowResult = await env.DB.prepare(`SELECT * FROM ${quoteIdentifier(table.name)}`).all<Record<string, unknown>>();

      return {
        name: table.name,
        schema: table.sql,
        rows: rowResult.results ?? [],
      };
    })
  );
}

async function pruneExpiredBackups(env: Env, environment: string, retentionDays: number) {
  const prefix = `${environment}/`;
  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  const keysToDelete: string[] = [];
  let cursor: string | undefined;

  do {
    const result = await env.BACKUPS.list({ prefix, cursor });

    for (const object of result.objects) {
      if (object.uploaded.getTime() < cutoff) {
        keysToDelete.push(object.key);
      }
    }

    cursor = result.truncated ? result.cursor : undefined;
  } while (cursor);

  if (keysToDelete.length > 0) {
    await env.BACKUPS.delete(keysToDelete);
  }
}

async function createBackup(env: Env) {
  const environment = env.BACKUP_ENVIRONMENT.trim();
  const retentionDays = parseRetentionDays(env.BACKUP_RETENTION_DAYS);
  const generatedAt = new Date().toISOString();
  const tables = await loadTables(env);

  const body = JSON.stringify(
    {
      generatedAt,
      environment,
      retentionDays,
      tables,
    },
    null,
    2
  );

  const backupKey = buildBackupKey(environment, generatedAt);

  await env.BACKUPS.put(backupKey, body, {
    httpMetadata: {
      contentType: 'application/json; charset=utf-8',
    },
    customMetadata: {
      environment,
      generatedAt,
    },
  });

  await env.BACKUPS.put(
    buildLatestKey(environment),
    JSON.stringify(
      {
        generatedAt,
        environment,
        backupKey,
      },
      null,
      2
    ),
    {
      httpMetadata: {
        contentType: 'application/json; charset=utf-8',
      },
      customMetadata: {
        environment,
        generatedAt,
      },
    }
  );

  await pruneExpiredBackups(env, environment, retentionDays);
}

export default {
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(createBackup(env));
  },

  async fetch() {
    return new Response('Not found', { status: 404 });
  },
};
