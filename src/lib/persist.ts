import fs from "node:fs/promises";
import path from "node:path";
import { put, list } from "@vercel/blob";

/**
 * Durable storage. On Vercel the filesystem is read-only, so when
 * BLOB_READ_WRITE_TOKEN is set we use Vercel Blob; otherwise (local dev) the
 * local filesystem. `durable` tells callers whether data survives a deploy.
 */
/** Token auth, or Vercel OIDC (BLOB_STORE_ID + runtime OIDC token) — the SDK picks the credentials itself. */
export const hasBlob = () => {
  // Vercel prefixes a second store's variables (e.g. BLOB_IMAGE_STORE_ID). The SDK only reads the unprefixed
  // names, so point it at the prefixed store when one exists (it is the PUBLIC image store).
  const prefixedToken = Object.keys(process.env).find((k) => /^BLOB_.+_READ_WRITE_TOKEN$/.test(k) && process.env[k]);
  if (!process.env.BLOB_READ_WRITE_TOKEN && prefixedToken) process.env.BLOB_READ_WRITE_TOKEN = process.env[prefixedToken];
  if (!process.env.BLOB_READ_WRITE_TOKEN && process.env.BLOB_IMAGE_STORE_ID) process.env.BLOB_STORE_ID = process.env.BLOB_IMAGE_STORE_ID;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
};

const CONFIG_KEY = "tmug/site-controls.json";

export async function readJson(localPath: string): Promise<unknown | null> {
  // No network calls while prerendering at build time — use the bundled seed file; runtime reads hit Blob.
  const building = process.env.NEXT_PHASE === "phase-production-build";
  if (hasBlob() && !building) {
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
