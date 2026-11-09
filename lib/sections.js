import { notFound } from "next/navigation";
import { isAdmin } from "./auth";
import { getSettings } from "./settings";

// Hidden sections return "page not found" to visitors; signed-in admins can still preview them.
export async function requireSection(key) {
  const settings = await getSettings();
  if (settings.sections[key]) return { settings, preview: false };
  if (await isAdmin()) return { settings, preview: true };
  notFound();
}
