import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const COOKIE = "tmug-admin";
const SESSION_VALUE = "ok";

async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  return store.get(COOKIE)?.value === SESSION_VALUE;
}

export async function POST(req: Request) {
  const authed = await isAuthed();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized. Please log in as admin." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const slotType = (formData.get("slotType") as string) || "general";

    if (!file) {
      return NextResponse.json({ error: "No file was provided in the upload request." }, { status: 400 });
    }

    // Supported formats check: PNG, JPG, JPEG, WEBP
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file extension (${ext}). Allowed: PNG, JPG, JPEG, WEBP.` },
        { status: 400 }
      );
    }

    // Sanitize file base name
    const rawName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const safeFilename = `${rawName}-${timestamp}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const destinationPath = path.join(uploadsDir, safeFilename);

    await fs.writeFile(destinationPath, buffer);

    const relativeUrl = `/uploads/${safeFilename}`;

    return NextResponse.json({
      ok: true,
      url: relativeUrl,
      filename: safeFilename,
      originalName: file.name,
      format: ext.replace(".", "").toUpperCase(),
      size: file.size,
      mimeType: file.type,
      slotType,
    });
  } catch (error) {
    console.error("Admin file upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload and save image to server storage." },
      { status: 500 }
    );
  }
}
