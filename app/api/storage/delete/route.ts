import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";

/* =========================================================
   CONFIG
========================================================= */

const STORAGE_BUCKET = "products";

const MAX_PATHS_PER_REQUEST = 10;

const MAX_PATH_LENGTH = 512;

/*
 * Current upload structure:
 *
 * products/{userId}/{uuid}.jpg
 * products/{userId}/{uuid}.png
 * products/{userId}/{uuid}.webp
 *
 * The UUID segments are deliberately strict.
 */
const validPath =
  /^products\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

/* =========================================================
   VALIDATION
========================================================= */

const deleteSchema = z
  .object({
    paths: z
      .array(
        z
          .string()
          .trim()
          .min(1)
          .max(MAX_PATH_LENGTH),
      )
      .min(1)
      .max(MAX_PATHS_PER_REQUEST),
  })
  .strict();

/* =========================================================
   HELPERS
========================================================= */

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

function isSafeStoragePath(
  path: string,
) {
  /*
   * Reject any path using Windows separators or traversal
   * even before testing the canonical path structure.
   */
  if (
    path.includes("\\") ||
    path.includes("..") ||
    path.startsWith("/") ||
    path.includes("\0")
  ) {
    return false;
  }

  return validPath.test(
    path,
  );
}

/* =========================================================
   POST — DELETE STORAGE OBJECTS
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
   * Storage deletion is a privileged destructive operation.
   *
   * Dedicated limiter:
   * 20 requests / minute / client.
   *
   * The security layer uses Upstash when configured and
   * process-local fallback otherwise.
   */

  const rateLimited =
    await isRateLimited(
      "storage-delete",
      request,
      20,
      60_000,
    );

  if (rateLimited) {
    return jsonError(
      "Too many delete requests",
      429,
    );
  }

  try {
    /* =====================================================
       03 — CONTENT TYPE
    ===================================================== */

    const contentType =
      request.headers.get(
        "content-type",
      ) ?? "";

    /*
     * This endpoint expects JSON only.
     */

    if (
      !contentType
        .toLowerCase()
        .startsWith(
          "application/json",
        )
    ) {
      return jsonError(
        "Invalid request content type",
        400,
      );
    }

    /* =====================================================
       04 — PARSE + VALIDATE BODY
    ===================================================== */

    const body =
      await request
        .json()
        .catch(
          () => null,
        );

    const parsed =
      deleteSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return jsonError(
        "Invalid image paths",
        400,
      );
    }

    /* =====================================================
       05 — NORMALIZE PATHS
    ===================================================== */

    /*
     * Remove duplicates so one object is never requested
     * multiple times in the same Storage operation.
     */

    const paths = [
      ...new Set(
        parsed.data.paths.map(
          (path) =>
            path.trim(),
        ),
      ),
    ];

    if (
      paths.length === 0 ||
      paths.length >
        MAX_PATHS_PER_REQUEST
    ) {
      return jsonError(
        "Invalid image paths",
        400,
      );
    }

    /* =====================================================
       06 — STRICT PATH VALIDATION
    ===================================================== */

    if (
      !paths.every(
        isSafeStoragePath,
      )
    ) {
      return jsonError(
        "Invalid image paths",
        400,
      );
    }

    /*
     * Extra bucket-level defense:
     *
     * Every path must belong to the expected bucket structure.
     * `validPath` already enforces this, but keeping the check
     * explicit makes future maintenance safer.
     */

    if (
      paths.some(
        (path) =>
          !path.startsWith(
            `${STORAGE_BUCKET}/`,
          ),
      )
    ) {
      return jsonError(
        "Invalid storage bucket path",
        400,
      );
    }

    /* =====================================================
       07 — SERVER-SIDE ADMIN STORAGE CLIENT
    ===================================================== */

    /*
     * requireAdmin() has already established that the caller
     * is an authenticated administrator.
     *
     * The actual deletion is therefore performed with the
     * server-side admin client instead of the browser session
     * client.
     */

    const supabase =
      createAdminClient();

    /* =====================================================
       08 — DELETE STORAGE OBJECTS
    ===================================================== */

    const {
      data: deletedObjects,
      error,
    } =
      await supabase.storage
        .from(
          STORAGE_BUCKET,
        )
        .remove(paths);

    if (error) {
      console.error(
        "STORAGE DELETE ERROR:",
        {
          adminUserId:
            auth.userId,
          paths,
          error,
        },
      );

      return jsonError(
        "Unable to delete image",
        400,
      );
    }

    /* =====================================================
       09 — AUDIT LOG
    ===================================================== */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "storage.delete",

      targetType:
        "storage_object",

      targetId:
        paths.length === 1
          ? paths[0]
          : `batch:${paths.length}`,

      request,

      metadata: {
        bucket:
          STORAGE_BUCKET,

        requestedPaths:
          paths,

        deletedCount:
          deletedObjects?.length ??
          0,
      },
    });

    /* =====================================================
       10 — SUCCESS
    ===================================================== */

    return NextResponse.json(
      {
        ok: true,

        requested:
          paths.length,

        deleted:
          deletedObjects?.length ??
          0,
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
      "STORAGE DELETE ROUTE ERROR:",
      {
        adminUserId:
          auth.userId,
        error,
      },
    );

    return jsonError(
      "Unable to delete image",
      500,
    );
  }
}