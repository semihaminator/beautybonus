import { redis } from "./db";

export const AGENCY_STATUSES = ["new", "contacted", "approved", "rejected"];
export const AGENCY_STATUS_LABELS = { new: "New", contacted: "Contacted", approved: "Approved", rejected: "Rejected" };

const LIST = "agency:apps";
const key = (id) => `agency:app:${id}`;

export const ID_RE = /^[A-Za-z0-9._-]{2,40}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^\+?[0-9 ()-]{7,22}$/;
export const MIN_STREAMERS = 5;
export const MAX_STREAMERS = 30;

const str = (v, max) => String(v ?? "").trim().slice(0, max);

// Returns { data } or { errors } — field names match the form.
export function validateAgency(body) {
  const data = {
    name: str(body.name, 80),
    agentId: str(body.agentId, 40),
    email: str(body.email, 120).toLowerCase(),
    phone: str(body.phone, 24),
    country: str(body.country, 60),
    city: str(body.city, 60),
    address: str(body.address, 160),
    comment: str(body.comment, 1000),
    streamerIds: Array.isArray(body.streamerIds)
      ? body.streamerIds.map((s) => str(s, 40)).filter(Boolean).slice(0, MAX_STREAMERS)
      : [],
  };
  const errors = {};
  if (!ID_RE.test(data.agentId)) errors.agentId = true;
  if (!EMAIL_RE.test(data.email)) errors.email = true;
  if (!PHONE_RE.test(data.phone) || data.phone.replace(/\D/g, "").length < 7) errors.phone = true;
  if (data.country.length < 2) errors.country = true;
  if (data.city.length < 2) errors.city = true;
  if (data.address.length < 3) errors.address = true;
  const unique = [...new Set(data.streamerIds.map((s) => s.toLowerCase()))];
  if (unique.length < MIN_STREAMERS || unique.length !== data.streamerIds.length || !data.streamerIds.every((s) => ID_RE.test(s))) {
    errors.streamers = true;
  }
  return Object.keys(errors).length ? { errors } : { data };
}

export async function createAgencyApp(data) {
  const id = crypto.randomUUID();
  const record = { id, createdAt: Date.now(), status: "new", note: "", ...data };
  const r = redis();
  await r.set(key(id), record);
  await r.zadd(LIST, { score: record.createdAt, member: id });
  return record;
}

export async function listAgencyApps() {
  const r = redis();
  const ids = await r.zrange(LIST, 0, -1, { rev: true });
  const out = [];
  for (let i = 0; i < ids.length; i += 200) {
    const rows = await r.mget(...ids.slice(i, i + 200).map(key));
    rows.forEach((row) => row && out.push(row));
  }
  return out;
}

export async function updateAgencyApp(id, patch) {
  const r = redis();
  const cur = await r.get(key(id));
  if (!cur) return null;
  const next = { ...cur };
  if (AGENCY_STATUSES.includes(patch.status)) next.status = patch.status;
  if (typeof patch.note === "string") next.note = patch.note.slice(0, 1000);
  await r.set(key(id), next);
  return next;
}

export async function deleteAgencyApp(id) {
  const r = redis();
  await r.del(key(id));
  await r.zrem(LIST, id);
}
