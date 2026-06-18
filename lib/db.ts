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

const isServerless = () =>
  !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Find a Postgres connection string from the environment.
 *
 * Prefers an explicit DATABASE_URL, but also auto-detects the variables the
 * Vercel/Neon integration creates — which may be prefixed (e.g. when the
 * storage is connected with a custom prefix you get DATABASE_URL_POSTGRES_URL,
 * DATABASE_URL_DATABASE_URL, etc.). Pooled URLs are preferred for serverless.
 */
function resolveDatabaseUrl(): string | undefined {
  if (isPostgresUrl(process.env.DATABASE_URL)) return process.env.DATABASE_URL;

  const rank = (name: string): number => {
    if (/(^|_)POSTGRES_URL$/.test(name)) return 0; // pooled connection
    if (/(^|_)DATABASE_URL$/.test(name)) return 1;
    if (/POSTGRES_PRISMA_URL$/.test(name)) return 2;
    if (/POSTGRES_URL_NON_POOLING$/.test(name)) return 3;
    if (/(^|_)POSTGRES_URL_NO_SSL$/.test(name)) return 4;
    return 9;
  };

  const candidate = Object.entries(process.env)
    .filter(([, v]) => isPostgresUrl(v))
    .sort(([a], [b]) => rank(a) - rank(b))[0];

  return candidate?.[1];
}

async function createClient(): Promise<DbClient> {
  const url = resolveDatabaseUrl();

  if (isPostgresUrl(url)) {
    const { neon } = await import("@neondatabase/serverless");
    // neon's HTTP driver: the returned function runs a parameterized query when
    // called directly as sql(queryText, paramsArray). With default options it
    // resolves to an array of row objects. (There is no sql.query in this build.)
    const sql = neon(url!) as unknown as (
      t: string,
      p: unknown[]
    ) => Promise<Row[] | { rows: Row[] }>;
    const client: DbClient = {
      query: async (text, params = []) => {
        const result = await sql(text, params);
        const rows = Array.isArray(result) ? result : result?.rows ?? [];
        return { rows };
      },
    };
    await ensureSchema(client);
    return client;
  }

  // No Postgres URL found. PGlite writes to disk, which is read-only on
  // serverless — so fail loudly with guidance instead of an EROFS crash.
  if (isServerless()) {
    throw new Error(
      "No Postgres connection string found. Connect a Neon/Postgres database " +
        "and expose its URL as DATABASE_URL (or POSTGRES_URL / *_POSTGRES_URL), " +
        "then redeploy."
    );
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
