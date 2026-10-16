import { adminGuard } from "@/server/auth";
import { errorResponse, json, parseBody } from "@/server/http";
import { getSettings, saveSettings, storeSettingsSchema } from "@/server/settings";

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  try {
    return json({ settings: await getSettings() });
  } catch (err) {
    return errorResponse(err);
  }
}

/** Save the essential store settings (store details, tax configuration, shipping, stock alert level). */
export async function PUT(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const parsed = await parseBody(req, storeSettingsSchema);
  if (!parsed.ok) return parsed.response;
  try {
    await saveSettings(parsed.data);
    return json({ ok: true });
  } catch (err) {
    return errorResponse(err);
  }
}
