import fs from "node:fs/promises";
import path from "node:path";
import { put, list } from "@vercel/blob";

/**
 * Durable storage. On Vercel the filesystem is read-only, so when
 * BLOB_READ_WRITE_TOKEN is set we use Vercel Blob; otherwise (local dev) the
 * local filesystem. `durable` tells callers whether data survives a deploy.
 */
/** Token auth, or Vercel OIDC (BLOB_STORE_ID + runtime OIDC token) — the SDK picks the credentials itself. */
export const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

const CONFIG_KEY = "tmug/site-controls.json";

export async function readJson(localPath: string): Promise<unknown | null> {
  if (hasBlob()) {
    try {
      const { blobs } = await list({ prefix: CONFIG_KEY, limit: 1 });
      if (blobs[0]) {
        const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) return await res.json();
      }
    } catch {
      /* fall through to the bundled seed file */
    }
  }
  try {
    return JSON.parse(await fs.readFile(localPath, "utf-8"));
  } catch {
    return null;
  }
}

export async function writeJson(
  localPath: string,
  data: unknown,
): Promise<{ persisted: boolean; durable: boolean; note?: string }> {
  const body = JSON.stringify(data, null, 2);
  if (hasBlob()) {
    try {
      await put(CONFIG_KEY, body, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
      return { persisted: true, durable: true };
    } catch (err) {
      return { persisted: false, durable: false, note: `Blob save failed: ${(err as Error).message}` };
    }
  }
  try {
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, body, "utf-8");
    return {
      persisted: true,
      durable: !process.env.VERCEL,
      note: process.env.VERCEL
        ? "Not permanent: connect a Vercel Blob store (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN) to keep settings across deployments."
        : undefined,
    };
  } catch (err) {
    return {
      persisted: false,
      durable: false,
      note: process.env.VERCEL
        ? "NOT SAVED: production storage is not configured. Connect a Vercel Blob store (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN) in Vercel → Storage."
        : `Not saved: ${(err as Error).message}`,
    };
  }
}

export async function saveUpload(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  if (hasBlob()) {
    const blob = await put(`tmug/uploads/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType,
    });
    return blob.url;
  }
  if (process.env.VERCEL) {
    throw new Error("Uploads need a Vercel Blob store (BLOB_STORE_ID or BLOB_READ_WRITE_TOKEN) in production.");
  }
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function listUploads(): Promise<{ url: string; name: string }[]> {
  if (hasBlob()) {
    try {
      const { blobs } = await list({ prefix: "tmug/uploads/", limit: 200 });
      return blobs.map((b) => ({ url: b.url, name: b.pathname.split("/").pop() || b.pathname }));
    } catch {
      return [];
    }
  }
  try {
    const dir = path.join(process.cwd(), "public", "uploads");
    return (await fs.readdir(dir)).map((n) => ({ url: `/uploads/${n}`, name: n }));
  } catch {
    return [];
  }
}
