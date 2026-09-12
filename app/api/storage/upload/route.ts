import "server-only";

import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";

/* =========================================================
   CONFIG
========================================================= */

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const STORAGE_BUCKET =
  "products";

const MAX_FORM_FILE_COUNT = 1;

const imageExtensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type SupportedImageMime =
  keyof typeof imageExtensions;

/* =========================================================
   FILE SIGNATURES
========================================================= */

const JPEG_SIGNATURE = [
  0xff,
  0xd8,
  0xff,
] as const;

const PNG_SIGNATURE = [
  0x89,
  0x50,
  0x4e,
  0x47,
  0x0d,
  0x0a,
  0x1a,
  0x0a,
] as const;

/*
 * WebP container:
 *
 * bytes 0..3   => RIFF
 * bytes 8..11  => WEBP
 */
const WEBP_RIFF_SIGNATURE = [
  0x52,
  0x49,
  0x46,
  0x46,
] as const;

const WEBP_SIGNATURE = [
  0x57,
  0x45,
  0x42,
  0x50,
] as const;

/* =========================================================
   HELPERS
========================================================= */

function matchesBytes(
  bytes: Uint8Array,
  signature: readonly number[],
  offset = 0,
) {
  if (
    bytes.length <
    offset + signature.length
  ) {
    return false;
  }

  return signature.every(
    (value, index) =>
      bytes[offset + index] ===
      value,
  );
}

function hasValidImageSignature(
  mimeType: SupportedImageMime,
  bytes: Uint8Array,
) {
  if (
    mimeType === "image/jpeg"
  ) {
    return matchesBytes(
      bytes,
      JPEG_SIGNATURE,
    );
  }

  if (
    mimeType === "image/png"
  ) {
    return matchesBytes(
      bytes,
      PNG_SIGNATURE,
    );
  }

  if (
    mimeType === "image/webp"
  ) {
    return (
      matchesBytes(
        bytes,
        WEBP_RIFF_SIGNATURE,
        0,
      ) &&
      matchesBytes(
        bytes,
        WEBP_SIGNATURE,
        8,
      )
    );
  }

  return false;
}

function isSupportedImageMime(
  value: string,
): value is SupportedImageMime {
  return (
    value in imageExtensions
  );
}

function jsonError(
  message: string,
  status: number,
) {
  return NextResponse.json(
    {
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control":
          "no-store",
      },
    },
  );
}

/* =========================================================
   POST — ADMIN IMAGE UPLOAD
========================================================= */

export async function POST(
  request: Request,
) {
  /* =======================================================
     01 — ADMIN AUTHENTICATION
  ======================================================= */

  const auth =
    await requireAdmin(
      request,
    );

  if (!auth.ok) {
    return auth.response;
  }

  /* =======================================================
     02 — RATE LIMIT
  ======================================================= */

  /*
   * Uploading files is more expensive than ordinary API
   * requests, so it receives a dedicated limiter.
   *
   * 20 upload attempts / minute / client.
   *
   * The existing security helper uses Upstash when
   * configured and falls back to a process-local limiter.
   */

  const rateLimited =
    await isRateLimited(
      "storage-upload",
      request,
      20,
      60_000,
    );

  if (rateLimited) {
    return jsonError(
      "Too many upload requests",
      429,
    );
  }

  try {
    /* =====================================================
       03 — CONTENT TYPE
    ===================================================== */

    const requestContentType =
      request.headers.get(
        "content-type",
      ) ?? "";

    if (
      !requestContentType
        .toLowerCase()
        .startsWith(
          "multipart/form-data",
        )
    ) {
      return jsonError(
        "Invalid upload request",
        400,
      );
    }

    /* =====================================================
       04 — READ FORM DATA
    ===================================================== */

    const formData =
      await request.formData();

    /*
     * We intentionally accept exactly one file field named
     * `file`, matching the current ImageUploader contract.
     */

    const file =
      formData.get("file");

    if (!(file instanceof File)) {
      return jsonError(
        "Invalid file",
        400,
      );
    }

    /*
     * Reject unexpected additional file fields.
     *
     * This is defensive hardening against malformed multipart
     * requests. The frontend sends only one file.
     */

    let fileCount = 0;

    for (
      const [, value] of formData.entries()
    ) {
      if (
        value instanceof File
      ) {
        fileCount += 1;
      }
    }

    if (
      fileCount !==
      MAX_FORM_FILE_COUNT
    ) {
      return jsonError(
        "Invalid upload payload",
        400,
      );
    }

    /* =====================================================
       05 — MIME TYPE VALIDATION
    ===================================================== */

    const rawMime =
      file.type
        .trim()
        .toLowerCase();

    if (
      !isSupportedImageMime(
        rawMime,
      )
    ) {
      return jsonError(
        "Only JPEG, PNG and WebP images are allowed",
        400,
      );
    }

    /* =====================================================
       06 — DECLARED FILE SIZE
    ===================================================== */

    if (
      file.size <= 0 ||
      file.size > MAX_IMAGE_SIZE
    ) {
      return jsonError(
        "Image size must be between 1 byte and 5 MB",
        400,
      );
    }

    /* =====================================================
       07 — READ ACTUAL BYTES
    ===================================================== */

    const arrayBuffer =
      await file.arrayBuffer();

    const bytes =
      new Uint8Array(
        arrayBuffer,
      );

    /*
     * Never rely only on the browser-provided File.size.
     *
     * The authoritative value for the data we are about to
     * persist is the byte length of the actual ArrayBuffer.
     */

    if (
      bytes.byteLength <= 0 ||
      bytes.byteLength >
        MAX_IMAGE_SIZE
    ) {
      return jsonError(
        "Invalid image size",
        400,
      );
    }

    /* =====================================================
       08 — BINARY SIGNATURE VALIDATION
    ===================================================== */

    if (
      !hasValidImageSignature(
        rawMime,
        bytes,
      )
    ) {
      return jsonError(
        "Invalid image content",
        400,
      );
    }

    /* =====================================================
       09 — GENERATE SAFE STORAGE PATH
    ===================================================== */

    /*
     * Never trust the original filename.
     *
     * A server-generated UUID prevents:
     * - path traversal
     * - filename collisions
     * - executable-looking names
     * - overwriting another object
     *
     * Objects are namespaced by the authenticated admin user.
     */

    const extension =
      imageExtensions[
        rawMime
      ];

    const filePath =
      `products/${auth.userId}/${crypto.randomUUID()}.${extension}`;

    /* =====================================================
       10 — ADMIN STORAGE CLIENT
    ===================================================== */

    /*
     * requireAdmin() already verified:
     *
     * 1. authenticated Supabase user
     * 2. user exists in admin_users
     * 3. same-origin browser request
     *
     * We therefore use the server-side admin client for the
     * actual Storage operation. The client secret never reaches
     * the browser.
     */

    const supabase =
      createAdminClient();

    /* =====================================================
       11 — UPLOAD
    ===================================================== */

    const {
      data,
      error,
    } =
      await supabase.storage
        .from(
          STORAGE_BUCKET,
        )
        .upload(
          filePath,
          bytes,
          {
            cacheControl:
              "3600",

            upsert:
              false,

            contentType:
              rawMime,
          },
        );

    if (error) {
      console.error(
        "PRODUCT IMAGE UPLOAD ERROR:",
        {
          userId:
            auth.userId,
          error,
        },
      );

      return jsonError(
        "Unable to upload image",
        400,
      );
    }

    /* =====================================================
       12 — PUBLIC URL
    ===================================================== */

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          STORAGE_BUCKET,
        )
        .getPublicUrl(
          filePath,
        );

    const publicUrl =
      publicUrlData.publicUrl;

    if (!publicUrl) {
      /*
       * The object was uploaded, but we could not generate the
       * URL required by the current frontend contract.
       *
       * Attempt cleanup to avoid an orphaned object.
       */

      const {
        error:
          cleanupError,
      } =
        await supabase.storage
          .from(
            STORAGE_BUCKET,
          )
          .remove([
            filePath,
          ]);

      if (cleanupError) {
        console.error(
          "PRODUCT IMAGE CLEANUP ERROR:",
          {
            path:
              filePath,
            error:
              cleanupError,
          },
        );
      }

      return jsonError(
        "Unable to generate image URL",
        500,
      );
    }

    /* =====================================================
       13 — AUDIT
    ===================================================== */

    await writeAuditLog(
      {
        actorId:
          auth.userId,

        action:
          "storage.upload",

        targetType:
          "storage_object",

        targetId:
          filePath,

        request,

        metadata: {
          bucket:
            STORAGE_BUCKET,

          mimeType:
            rawMime,

          size:
            bytes.byteLength,
        },
      },
    );

    /* =====================================================
       14 — RESPONSE
    ===================================================== */

    return NextResponse.json(
      {
        path:
          data?.path ??
          filePath,

        publicUrl,
      },
      {
        status: 200,

        headers: {
          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "PRODUCT IMAGE UPLOAD ROUTE ERROR:",
      {
        userId:
          auth.userId,
        error,
      },
    );

    return jsonError(
      process.env.NODE_ENV ===
        "development"
        ? error instanceof Error
          ? error.message
          : "Unable to upload image"
        : "Unable to upload image",
      500,
    );
  }
}