"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { IconCheck, IconTrash, IconSparkle } from "@/components/icons";

interface MediaUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  slotType: "product-cutout" | "hero-banner" | "product-back" | "thumbnail" | "lifestyle";
  aspectRatio?: string;
  recommendedDimensions?: string;
  recommendedFormat?: string;
  transparencyPreferred?: boolean;
}

interface UploadedMetadata {
  previewUrl: string;
  file: File;
  name: string;
  format: string;
  sizeKb: string;
  width: number;
  height: number;
  isTransparent: boolean;
}

export default function MediaUploadField({
  label,
  value,
  onChange,
  slotType,
  aspectRatio = "1:1",
  recommendedDimensions = "1200 × 1200 px",
  recommendedFormat = "PNG / WEBP",
  transparencyPreferred = false,
}: MediaUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pendingUpload, setPendingUpload] = useState<UploadedMetadata | null>(null);

  const handleTriggerPicker = () => {
    setErrorMsg("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be picked again if desired
    e.target.value = "";

    const ext = file.name.split(".").pop()?.toUpperCase() || "IMG";
    const sizeKb = (file.size / 1024).toFixed(1);
    const objectUrl = URL.createObjectURL(file);

    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      // Check transparency for PNG cutouts
      let isTransparent = false;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = Math.min(img.width, 80);
          canvas.height = Math.min(img.height, 80);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          for (let i = 3; i < imgData.length; i += 4) {
            if (imgData[i] < 240) {
              isTransparent = true;
              break;
            }
          }
        }
      } catch {
        // canvas fallback
      }

      setPendingUpload({
        previewUrl: objectUrl,
        file,
        name: file.name,
        format: ext,
        sizeKb,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        isTransparent,
      });
    };

    img.onerror = () => {
      setErrorMsg("Failed to read image properties. Please choose a valid image file.");
    };
  };

  const handleApplyUpload = async () => {
    if (!pendingUpload) return;
    setUploading(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", pendingUpload.file);
      formData.append("slotType", slotType);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setPendingUpload(null);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to upload file to server.");
    } finally {
      setUploading(false);
    }
  };

  const handleDiscardPending = () => {
    if (pendingUpload) {
      URL.revokeObjectURL(pendingUpload.previewUrl);
    }
    setPendingUpload(null);
  };

  const handleRemoveCurrent = () => {
    if (confirm(`Remove ${label}?`)) {
      onChange("");
    }
  };

  return (
    <div className="rounded-xl border border-[#3A3438]/12 bg-[#FFF7EF]/50 p-3.5 sm:p-4">
      {/* Hidden native system file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#33243A]">
          {label}
        </label>
        <span className="rounded-md bg-[#FFF183] border border-[#F8B77C] px-2 py-0.5 text-[10px] font-bold text-[#33243A]">
          Slot: {aspectRatio} ({recommendedFormat})
        </span>
      </div>

      {/* Slot Instructions Box */}
      <div className="mb-3 rounded-lg border border-[#3A3438]/8 bg-white/80 p-2.5 text-[11px] text-[#3A3438]/80 leading-relaxed">
        <p className="font-bold text-[#33243A]">IMAGE REQUIREMENTS</p>
        <p>• Recommended: {recommendedDimensions} ({aspectRatio})</p>
        <p>
          • Format: {recommendedFormat}
          {transparencyPreferred ? " • Transparent cutout preferred" : " • Sharp composition"}
        </p>
      </div>

      {/* Current Active Image View */}
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-[#3A3438]/10 bg-white p-2">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-[#3A3438]/10 bg-[#FBE7DC]/60">
            <Image
              src={value}
              alt={label}
              fill
              sizes="60px"
              className={transparencyPreferred ? "object-contain p-1" : "object-cover"}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-mono font-bold text-[#33243A]" title={value}>
              {value}
            </p>
            <p className="text-[10px] text-[#3A3438]/60">Active in Storefront</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleTriggerPicker}
              className="rounded-md border border-[#3A3438]/20 bg-white px-2.5 py-1 text-[11px] font-black text-[#33243A] hover:bg-[#FFF183] transition-colors cursor-pointer"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemoveCurrent}
              className="rounded-md border border-[#FAA4B5]/40 bg-[#FAA4B5]/15 p-1 text-[#33243A] hover:bg-[#FAA4B5] transition-colors cursor-pointer"
              title="Remove"
            >
              <IconTrash className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-lg border border-dashed border-[#3A3438]/20 bg-white/60 p-3">
          <span className="text-xs text-[#3A3438]/50 italic">No image assigned</span>
          <button
            type="button"
            onClick={handleTriggerPicker}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FAA4B5] hover:bg-[#F8B77C] text-[#33243A] px-4 py-1.5 text-xs font-black shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <IconSparkle className="h-3.5 w-3.5" /> UPLOAD IMAGE
          </button>
        </div>
      )}

      {/* Manual path fallback input */}
      <div className="mt-2 flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/products/... or /hero/... or /banners/..."
          className="w-full rounded-md border border-[#3A3438]/15 bg-white px-2.5 py-1 text-[11px] font-mono text-[#33243A] outline-none focus:border-[#FAA4B5]"
        />
        <button
          type="button"
          onClick={handleTriggerPicker}
          className="shrink-0 rounded-md bg-[#33243A] px-3 py-1 text-[11px] font-black text-white hover:bg-[#4A3554] cursor-pointer"
        >
          Browse...
        </button>
      </div>

      {errorMsg && (
        <p className="mt-2 text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded border border-red-200">
          {errorMsg}
        </p>
      )}

      {/* ── Pending Upload Preview & Metadata Inspection Modal ── */}
      {pendingUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border-2 border-white/60 bg-white p-5 shadow-2xl">
            <h4 className="font-display text-base font-black text-[#33243A]">
              Confirm Image Upload
            </h4>
            <p className="text-xs text-[#3A3438]/70">
              Inspect detected file properties before saving to site storage.
            </p>

            {/* Preview image */}
            <div className="relative mt-4 aspect-square max-h-56 w-full overflow-hidden rounded-xl border border-[#3A3438]/10 bg-[#FFF7EF] p-2 flex items-center justify-center">
              <div className="relative h-full w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pendingUpload.previewUrl}
                  alt="Upload preview"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Detected Metadata */}
            <div className="mt-3 space-y-1 rounded-xl border border-[#3A3438]/10 bg-[#FFF7EF]/60 p-3 text-xs">
              <p className="flex justify-between font-mono">
                <span className="font-sans font-bold text-[#3A3438]/70">Filename:</span>
                <span className="truncate max-w-[200px] font-bold text-[#33243A]">{pendingUpload.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-[#3A3438]/70">Dimensions:</span>
                <span className="font-bold text-[#33243A]">{pendingUpload.width} × {pendingUpload.height} px</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-[#3A3438]/70">Format:</span>
                <span className="font-bold text-[#33243A]">{pendingUpload.format}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-[#3A3438]/70">File Size:</span>
                <span className="font-bold text-[#33243A]">{pendingUpload.sizeKb} KB</span>
              </p>
              <p className="flex justify-between">
                <span className="font-bold text-[#3A3438]/70">Transparency:</span>
                <span className={`font-bold ${pendingUpload.isTransparent ? "text-emerald-700" : "text-[#33243A]"}`}>
                  {pendingUpload.isTransparent ? "Transparent PNG Cutout ✓" : "Opaque Background"}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleDiscardPending}
                disabled={uploading}
                className="rounded-full border border-[#3A3438]/20 bg-white px-4 py-2 text-xs font-bold text-[#33243A] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerPicker}
                disabled={uploading}
                className="rounded-full border border-[#3A3438]/20 bg-white px-4 py-2 text-xs font-bold text-[#33243A] hover:bg-[#FFF183] cursor-pointer"
              >
                Choose Another
              </button>
              <button
                type="button"
                onClick={handleApplyUpload}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FAA4B5] hover:bg-[#F8B77C] px-5 py-2 text-xs font-black text-[#33243A] shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Save & Use Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
