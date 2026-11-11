import { Redis } from "@upstash/redis";

export const STATUSES = ["accepted", "conditional", "rejected"];
export const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  conditional: "Conditionally accepted",
  rejected: "Rejected",
};

let client;
export function redis() {
  if (!client) {
    const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("Database is not connected. Add an Upstash Redis store to the Vercel project (see README).");
    }
    client = new Redis({ url, token });
  }
  return client;
}

const APPS = "bb:apps"; // sorted set of application ids by submit time
const appKey = (id) => `bb:app:${id}`;
const STATUS_HASH = "bb:statuses"; // legacy: results before rounds existed (migrated automatically)

export async function createApplication(data) {
  const id = crypto.randomUUID();
  const createdAt = Date.now();
  const record = { id, createdAt, ...data };
  const r = redis();
  await r.set(appKey(id), record);
  await r.zadd(APPS, { score: createdAt, member: id });
  return record;
}

export async function listApplications() {
  const r = redis();
  const ids = await r.zrange(APPS, 0, -1, { rev: true });
  if (!ids.length) return [];
  const out = [];
  for (let i = 0; i < ids.length; i += 200) {
    const chunk = ids.slice(i, i + 200);
    const rows = await r.mget(...chunk.map(appKey));
    rows.forEach((row) => row && out.push(row));
  }
  return out;
}

export async function getApplication(id) {
  return redis().get(appKey(id));
}

export async function deleteApplication(id) {
  const r = redis();
  await r.del(appKey(id));
  await r.zrem(APPS, id);
}

// ── Results are stored per round (bonus start month, "YYYY-MM") ─────────────
// bb:statuses:<YYYY-MM>  hash  in-app ID -> accepted | conditional | rejected
// bb:rounds              set   rounds that have (or had) results
const roundKey = (m) => `bb:statuses:${m}`;
const ROUNDS = "bb:rounds";
export const ROUND_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
// Results saved before rounds existed belong to this round (the November 2026 list).
export const LEGACY_ROUND = "2026-11";

let migrated = false;
async function migrateLegacy() {
  if (migrated) return;
  const r = redis();
  const old = await r.hgetall(STATUS_HASH);
  if (old && Object.keys(old).length) {
    await r.hset(roundKey(LEGACY_ROUND), old);
    await r.sadd(ROUNDS, LEGACY_ROUND);
    await r.del(STATUS_HASH);
  }
  migrated = true;
}

export async function listRounds() {
  await migrateLegacy();
  const rounds = (await redis().smembers(ROUNDS)) || [];
  return rounds.filter((m) => ROUND_RE.test(m)).sort().reverse();
}

// Results for one round: { id: status }
export async function getStatuses(round) {
  await migrateLegacy();
  if (!ROUND_RE.test(String(round || ""))) return {};
  return (await redis().hgetall(roundKey(round))) || {};
}

// Results for every round: { "2026-11": { id: status }, ... }
export async function getAllStatuses() {
  const rounds = await listRounds();
  const rows = await Promise.all(rounds.map((m) => redis().hgetall(roundKey(m))));
  return Object.fromEntries(rounds.map((m, i) => [m, rows[i] || {}]));
}

export async function setStatus(ids, status, round) {
  if (!ROUND_RE.test(String(round || ""))) throw new Error("Choose a round (month).");
  await migrateLegacy();
  const clean = [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))];
  if (!clean.length) return 0;
  const r = redis();
  if (status === "pending") {
    await r.hdel(roundKey(round), ...clean);
  } else {
    await r.hset(roundKey(round), Object.fromEntries(clean.map((id) => [id, status])));
    await r.sadd(ROUNDS, round);
  }
  return clean.length;
}
