"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { validateImageFile } from "@/lib/storage";

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({
  value,
  onChange,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const objectUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile]
  );

  const previewUrl = objectUrl || value;

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validationError = validateImageFile(file);

    if (validationError) {
      toast.error(validationError);
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error ?? "Upload failed.");
      }

      const { publicUrl } = await response.json();
      onChange(publicUrl);
      toast.success("Image uploaded successfully.");
    } catch (error: unknown) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Upload failed.");
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-medium text-slate-700">Product image</p>
        <p className="text-sm text-slate-500">JPG, JPEG, PNG, WEBP — max 5MB.</p>
      </div>

      {previewUrl ? (
        <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-52 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500">
          No image selected
        </div>
      )}

      <label className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:border-slate-400 hover:bg-slate-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-slate-400">
        <span>{uploading ? "Uploading image..." : "Select a product image"}</span>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          disabled={uploading}
        />
      </label>

      {uploading && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">Upload progress: {progress}%</p>
        </div>
      )}
    </div>
  );
}