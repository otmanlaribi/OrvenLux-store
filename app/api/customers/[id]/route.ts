import { NextResponse } from "next/server";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  isRateLimited,
  requireAdmin,
  writeAuditLog,
} from "@/lib/security";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  params: Promise<{
    id: string;
  }>;
};

/* =========================================================
   VALIDATION
========================================================= */

const idSchema = z.coerce
  .number()
  .int()
  .positive();

const customerPatchSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(
        2,
        "Customer name is required",
      )
      .max(
        120,
        "Customer name is too long",
      ),

    email: z
      .union([
        z
          .string()
          .trim()
          .email("Invalid email address")
          .max(254),

        z.literal(""),

        z.null(),
      ])
      .optional()
      .transform((value) => {
        if (
          value === null ||
          value === undefined
        ) {
          return null;
        }

        const normalized =
          value.trim();

        return normalized || null;
      }),

    phone: z
      .string()
      .trim()
      .min(
        5,
        "Customer phone is required",
      )
      .max(
        30,
        "Customer phone is too long",
      ),

    active: z
      .boolean(),
  })
  .strict();

/* =========================================================
   GET — CUSTOMER
========================================================= */

export async function GET(
  request: Request,
  { params }: Props,
) {
  /* -------------------------------------------------------
     01 — ADMIN AUTHENTICATION
  ------------------------------------------------------- */

  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* -------------------------------------------------------
     02 — RATE LIMIT
  ------------------------------------------------------- */

  if (
    await isRateLimited(
      "customer-read",
      request,
      60,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  /* -------------------------------------------------------
     03 — VALIDATE ID
  ------------------------------------------------------- */

  const { id: rawId } =
    await params;

  const parsedId =
    idSchema.safeParse(
      rawId,
    );

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error:
          "Invalid customer id",
      },
      {
        status: 400,
      },
    );
  }

  try {
    /* -----------------------------------------------------
       04 — LOAD CUSTOMER
    ----------------------------------------------------- */

    const {
      data,
      error,
    } = await createAdminClient()
      .from("customers")
      .select(
        "id, name, email, phone, active, created_at, updated_at",
      )
      .eq(
        "id",
        parsedId.data,
      )
      .maybeSingle();

    if (error) {
      console.error(
        "CUSTOMER GET ERROR:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,

          message:
            error.message,

          details:
            error.details,

          hint:
            error.hint,

          code:
            error.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to load customer",
        },
        {
          status: 500,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Customer not found",
        },
        {
          status: 404,
        },
      );
    }

    /* -----------------------------------------------------
       05 — AUDIT
    ----------------------------------------------------- */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "customer.view",

      targetType:
        "customer",

      targetId:
        parsedId.data,

      request,
    });

    /* -----------------------------------------------------
       06 — RESPONSE
    ----------------------------------------------------- */

    return NextResponse.json(
      data,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "CUSTOMER GET ROUTE ERROR:",
      {
        customerId:
          parsedId.data,

        adminUserId:
          auth.userId,

        error,
      },
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   PATCH — UPDATE CUSTOMER
========================================================= */

export async function PATCH(
  request: Request,
  { params }: Props,
) {
  /* -------------------------------------------------------
     01 — ADMIN AUTHENTICATION
  ------------------------------------------------------- */

  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* -------------------------------------------------------
     02 — RATE LIMIT
  ------------------------------------------------------- */

  if (
    await isRateLimited(
      "customer-update",
      request,
      30,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  /* -------------------------------------------------------
     03 — VALIDATE ID
  ------------------------------------------------------- */

  const { id: rawId } =
    await params;

  const parsedId =
    idSchema.safeParse(
      rawId,
    );

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error:
          "Invalid customer id",
      },
      {
        status: 400,
      },
    );
  }

  try {
    /* -----------------------------------------------------
       04 — PARSE BODY
    ----------------------------------------------------- */

    const body =
      await request
        .json()
        .catch(() => null);

    const parsed =
      customerPatchSchema.safeParse(
        body,
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid customer data",
        },
        {
          status: 400,
        },
      );
    }

    /* -----------------------------------------------------
       05 — UPDATE CUSTOMER
    ----------------------------------------------------- */

    const {
      data,
      error,
    } = await createAdminClient()
      .from("customers")
      .update({
        name:
          parsed.data.name,

        email:
          parsed.data.email,

        phone:
          parsed.data.phone,

        active:
          parsed.data.active,
      })
      .eq(
        "id",
        parsedId.data,
      )
      .select(
        "id, name, email, phone, active, created_at, updated_at",
      )
      .maybeSingle();

    if (error) {
      console.error(
        "CUSTOMER UPDATE ERROR:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,

          message:
            error.message,

          details:
            error.details,

          hint:
            error.hint,

          code:
            error.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to update customer",
        },
        {
          status: 400,
        },
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "Customer not found",
        },
        {
          status: 404,
        },
      );
    }

    /* -----------------------------------------------------
       06 — AUDIT
    ----------------------------------------------------- */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "customer.update",

      targetType:
        "customer",

      targetId:
        parsedId.data,

      request,
    });

    /* -----------------------------------------------------
       07 — RESPONSE
    ----------------------------------------------------- */

    return NextResponse.json(
      data,
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "CUSTOMER PATCH ROUTE ERROR:",
      {
        customerId:
          parsedId.data,

        adminUserId:
          auth.userId,

        error,
      },
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error",
      },
      {
        status: 500,
      },
    );
  }
}

/* =========================================================
   DELETE — DELETE CUSTOMER
========================================================= */

export async function DELETE(
  request: Request,
  { params }: Props,
) {
  /* -------------------------------------------------------
     01 — ADMIN AUTHENTICATION
  ------------------------------------------------------- */

  const auth =
    await requireAdmin(request);

  if (!auth.ok) {
    return auth.response;
  }

  /* -------------------------------------------------------
     02 — RATE LIMIT
  ------------------------------------------------------- */

  if (
    await isRateLimited(
      "customer-delete",
      request,
      15,
      60_000,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Too many requests",
      },
      {
        status: 429,
      },
    );
  }

  /* -------------------------------------------------------
     03 — VALIDATE ID
  ------------------------------------------------------- */

  const { id: rawId } =
    await params;

  const parsedId =
    idSchema.safeParse(
      rawId,
    );

  if (!parsedId.success) {
    return NextResponse.json(
      {
        error:
          "Invalid customer id",
      },
      {
        status: 400,
      },
    );
  }

  try {
    const supabase =
      createAdminClient();

    /* -----------------------------------------------------
       04 — VERIFY CUSTOMER EXISTS
    ----------------------------------------------------- */

    const {
      data: existingCustomer,
      error:
        lookupError,
    } = await supabase
      .from("customers")
      .select("id")
      .eq(
        "id",
        parsedId.data,
      )
      .maybeSingle();

    if (lookupError) {
      console.error(
        "CUSTOMER DELETE LOOKUP ERROR:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,

          message:
            lookupError.message,

          details:
            lookupError.details,

          hint:
            lookupError.hint,

          code:
            lookupError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to verify customer",
        },
        {
          status: 500,
        },
      );
    }

    if (!existingCustomer) {
      return NextResponse.json(
        {
          error:
            "Customer not found",
        },
        {
          status: 404,
        },
      );
    }

    /* -----------------------------------------------------
       05 — DELETE CUSTOMER
    ----------------------------------------------------- */

    const {
      data: deletedCustomer,
      error: deleteError,
    } = await supabase
      .from("customers")
      .delete()
      .eq(
        "id",
        parsedId.data,
      )
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error(
        "CUSTOMER DELETE ERROR:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,

          message:
            deleteError.message,

          details:
            deleteError.details,

          hint:
            deleteError.hint,

          code:
            deleteError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Unable to delete customer",
        },
        {
          status: 400,
        },
      );
    }

    if (!deletedCustomer) {
      return NextResponse.json(
        {
          error:
            "Customer was not deleted",
        },
        {
          status: 500,
        },
      );
    }

    /* -----------------------------------------------------
       06 — FINAL VERIFICATION
    ----------------------------------------------------- */

    const {
      data:
        remainingCustomer,
      error:
        verifyError,
    } = await supabase
      .from("customers")
      .select("id")
      .eq(
        "id",
        parsedId.data,
      )
      .maybeSingle();

    if (verifyError) {
      console.error(
        "CUSTOMER DELETE VERIFICATION ERROR:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,

          message:
            verifyError.message,

          details:
            verifyError.details,

          hint:
            verifyError.hint,

          code:
            verifyError.code,
        },
      );

      return NextResponse.json(
        {
          error:
            "Customer deleted but verification failed",
        },
        {
          status: 500,
        },
      );
    }

    if (remainingCustomer) {
      console.error(
        "CUSTOMER DELETE ROW STILL EXISTS:",
        {
          customerId:
            parsedId.data,

          adminUserId:
            auth.userId,
        },
      );

      return NextResponse.json(
        {
          error:
            "Customer still exists after delete",
        },
        {
          status: 500,
        },
      );
    }

    /* -----------------------------------------------------
       07 — AUDIT
    ----------------------------------------------------- */

    await writeAuditLog({
      actorId:
        auth.userId,

      action:
        "customer.delete",

      targetType:
        "customer",

      targetId:
        parsedId.data,

      request,
    });

    /* -----------------------------------------------------
       08 — RESPONSE
    ----------------------------------------------------- */

    return NextResponse.json(
      {
        success: true,
        id:
          deletedCustomer.id,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "CUSTOMER DELETE ROUTE ERROR:",
      {
        customerId:
          parsedId.data,

        adminUserId:
          auth.userId,

        error,
      },
    );

    return NextResponse.json(
      {
        error:
          "Unexpected server error",
      },
      {
        status: 500,
      },
    );
  }
}