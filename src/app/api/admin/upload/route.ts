import { randomBytes } from "node:crypto";
import { adminGuard } from "@/server/auth";
import { json, jsonError } from "@/server/http";
import { listUploads, saveUpload } from "@/lib/persist";

/**
 * Admin image upload.
 *
 * Safety measures:
 *  - admin session + Origin check (adminGuard)
 *  - the file TYPE is decided by sniffing the file's magic bytes, never by the
 *    client-supplied name or Content-Type (so a renamed .html/.svg/.exe is refused)
 *  - only PNG, JPEG and WebP are accepted (no SVG: it can carry scripts)
 *  - size limit of 4 MB (Vercel's request body limit is 4.5 MB)
 *  - the stored name is generated here (sanitised base + random suffix): user input
 *    can never choose a path, and an upload can never overwrite another file
 */

const MAX_BYTES = 4 * 1024 * 1024;

type Sniffed = { ext: "png" | "jpg" | "webp"; mime: string };

function sniffImage(buf: Buffer): Sniffed | null {
  if (buf.length >= 12) {
    if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
      return { ext: "png", mime: "image/png" };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
      return { ext: "jpg", mime: "image/jpeg" };
    }
    if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
      return { ext: "webp", mime: "image/webp" };
    }
  }
  return null;
}

export async function POST(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BYTES + 512 * 1024) {
    return jsonError("Image is too large. The maximum size is 4 MB.", 413);
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("No file was provided.", 400);
    if (file.size === 0) return jsonError("The file is empty.", 400);
    if (file.size > MAX_BYTES) return jsonError("Image is too large. The maximum size is 4 MB.", 413);

    const buffer = Buffer.from(await file.arrayBuffer());
    const kind = sniffImage(buffer);
    if (!kind) return jsonError("Unsupported file. Upload a PNG, JPG or WebP image.", 415);

    const base =
      file.name
        .replace(/\.[^.]*$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .toLowerCase()
        .slice(0, 40) || "image";
    const filename = `${base}-${randomBytes(6).toString("hex")}.${kind.ext}`;

    const url = await saveUpload(filename, buffer, kind.mime);
    return json({
      ok: true,
      url,
      filename,
      originalName: file.name,
      format: kind.ext.toUpperCase(),
      size: file.size,
      mimeType: kind.mime,
    });
  } catch (err) {
    console.error("[upload] failed:", err instanceof Error ? err.message : err);
    const message = err instanceof Error && /Blob store/i.test(err.message) ? err.message : "Could not save the image. Please try again.";
    return jsonError(message, 500);
  }
}

export async function GET(req: Request) {
  const denied = await adminGuard(req);
  if (denied) return denied;
  return json({ files: await listUploads() });
}
