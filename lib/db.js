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
const STATUS_HASH = "bb:statuses"; // in-app ID -> accepted | conditional | rejected

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

export async function getStatuses() {
  return (await redis().hgetall(STATUS_HASH)) || {};
}

export async function setStatus(ids, status) {
  const clean = [...new Set(ids.map((s) => String(s).trim()).filter(Boolean))];
  if (!clean.length) return 0;
  const r = redis();
  if (status === "pending") {
    await r.hdel(STATUS_HASH, ...clean);
  } else {
    await r.hset(STATUS_HASH, Object.fromEntries(clean.map((id) => [id, status])));
  }
  return clean.length;
}
