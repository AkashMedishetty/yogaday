/**
 * Unified Postgres data layer.
 *
 * - In production (Vercel) set DATABASE_URL to your Neon connection string and
 *   queries run against Neon over HTTP (serverless-friendly).
 * - Locally, with no DATABASE_URL, it falls back to PGlite — a real Postgres
 *   engine running in-process, persisted to ./.pglite-data. No install, no
 *   Docker. Same SQL, so deploying is just setting the env var.
 */

type Row = Record<string, unknown>;

interface DbClient {
  query: (text: string, params?: unknown[]) => Promise<{ rows: Row[] }>;
}

declare global {
  // eslint-disable-next-line no-var
  var __yogaDb: Promise<DbClient> | undefined;
}

const isPostgresUrl = (url?: string | null) =>
  !!url && /^postgres(ql)?:\/\//.test(url);

async function createClient(): Promise<DbClient> {
  const url = process.env.DATABASE_URL;

  if (isPostgresUrl(url)) {
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(url!);
    const client: DbClient = {
      query: async (text, params = []) => {
        // neon's parameterized .query(text, params) exists at runtime; its
        // type signature doesn't expose it, so we call through a typed shim.
        const run = (sql as unknown as {
          query: (t: string, p: unknown[]) => Promise<Row[]>;
        }).query;
        const rows = await run(text, params);
        return { rows };
      },
    };
    await ensureSchema(client);
    return client;
  }

  // Local fallback: PGlite (Postgres in WASM, persisted to disk).
  const { PGlite } = await import("@electric-sql/pglite");
  const pg = new PGlite(".pglite-data");
  const client: DbClient = {
    query: async (text, params = []) => {
      const res = await pg.query(text, params);
      return { rows: (res.rows ?? []) as Row[] };
    },
  };
  await ensureSchema(client);
  return client;
}

async function ensureSchema(client: DbClient) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS registrations (
      id          SERIAL PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT NOT NULL,
      mobile      TEXT NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await client.query(
    `CREATE UNIQUE INDEX IF NOT EXISTS registrations_email_key ON registrations (lower(email));`
  );
}

export function getDb(): Promise<DbClient> {
  if (!globalThis.__yogaDb) {
    globalThis.__yogaDb = createClient();
  }
  return globalThis.__yogaDb;
}

export interface Registration {
  id: number;
  name: string;
  email: string;
  mobile: string;
  created_at: string;
}

export async function insertRegistration(input: {
  name: string;
  email: string;
  mobile: string;
}): Promise<Registration> {
  const db = await getDb();
  const { rows } = await db.query(
    `INSERT INTO registrations (name, email, mobile)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, mobile, created_at;`,
    [input.name, input.email, input.mobile]
  );
  return rows[0] as unknown as Registration;
}

export async function listRegistrations(): Promise<Registration[]> {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT id, name, email, mobile, created_at
     FROM registrations
     ORDER BY created_at DESC;`
  );
  return rows as unknown as Registration[];
}

export async function countRegistrations(): Promise<number> {
  const db = await getDb();
  const { rows } = await db.query(`SELECT COUNT(*)::int AS count FROM registrations;`);
  return (rows[0] as { count: number }).count;
}
