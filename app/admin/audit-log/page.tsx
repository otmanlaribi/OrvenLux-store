import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  FilePlus2,
  Filter,
  LockKeyhole,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Wrench,
} from "lucide-react";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminUser } from "@/lib/security";

type AuditLog = {
  id: string | number;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

function formatDate(
  value: string,
) {
  try {
    return new Intl.DateTimeFormat(
      "ar-DZ",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

function formatShortDate(
  value: string,
) {
  try {
    return new Intl.DateTimeFormat(
      "ar-DZ",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      },
    ).format(
      new Date(value),
    );
  } catch {
    return value;
  }
}

function normalizeAction(
  action: string,
) {
  return String(action ?? "")
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_");
}

function formatAction(
  action: string,
) {
  const normalized =
    normalizeAction(action);

  const actions: Record<
    string,
    string
  > = {
    "product.create":
      "إنشاء منتج",

    "product.update":
      "تحديث منتج",

    "product.delete":
      "حذف منتج",

    "order.create":
      "إنشاء طلب",

    "order.update":
      "تحديث طلب",

    "order.delete":
      "حذف طلب",

    "customer.create":
      "إنشاء عميل",

    "customer.update":
      "تحديث عميل",

    "customer.delete":
      "حذف عميل",

    create: "إنشاء",

    update: "تعديل",

    delete: "حذف",

    login: "تسجيل دخول",

    logout: "تسجيل خروج",

    create_order:
      "إنشاء طلب",

    update_order:
      "تحديث طلب",

    delete_order:
      "حذف طلب",

    create_product:
      "إنشاء منتج",

    update_product:
      "تحديث منتج",

    delete_product:
      "حذف منتج",
  };

  return (
    actions[normalized] ??
    action
  );
}

function formatTargetType(
  type: string,
) {
  const normalized =
    String(type ?? "")
      .trim()
      .toLowerCase();

  const types: Record<
    string,
    string
  > = {
    order: "طلب",
    product: "منتج",
    customer: "عميل",
    user: "مستخدم",
    admin: "مدير",
    settings: "إعدادات",
  };

  return (
    types[normalized] ??
    type
  );
}

function getActionTone(
  action: string,
) {
  const normalized =
    normalizeAction(action);

  if (
    normalized.includes(
      "delete",
    )
  ) {
    return {
      label:
        "DESTRUCTIVE",
      icon: Trash2,
      wrapper:
        "border-red-400/15 bg-red-400/[0.06] text-red-300",
      dot:
        "bg-red-300",
      glow:
        "shadow-[0_0_18px_rgba(248,113,113,0.18)]",
    };
  }

  if (
    normalized.includes(
      "create",
    )
  ) {
    return {
      label:
        "CREATED",
      icon: FilePlus2,
      wrapper:
        "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
      dot:
        "bg-emerald-300",
      glow:
        "shadow-[0_0_18px_rgba(52,211,153,0.16)]",
    };
  }

  if (
    normalized.includes(
      "update",
    )
  ) {
    return {
      label:
        "UPDATED",
      icon: Wrench,
      wrapper:
        "border-sky-400/15 bg-sky-400/[0.06] text-sky-300",
      dot:
        "bg-sky-300",
      glow:
        "shadow-[0_0_18px_rgba(56,189,248,0.14)]",
    };
  }

  if (
    normalized.includes(
      "login",
    )
  ) {
    return {
      label:
        "ACCESS",
      icon: LockKeyhole,
      wrapper:
        "border-violet-400/15 bg-violet-400/[0.06] text-violet-300",
      dot:
        "bg-violet-300",
      glow:
        "shadow-[0_0_18px_rgba(167,139,250,0.14)]",
    };
  }

  return {
    label:
      "SYSTEM",
    icon: Activity,
    wrapper:
      "border-white/[0.08] bg-white/[0.025] text-white/55",
    dot:
      "bg-white/35",
    glow: "",
  };
}

function shortenId(
  value: string | null,
) {
  if (!value) {
    return "SYSTEM";
  }

  if (value.length <= 18) {
    return value;
  }

  return `${value.slice(
    0,
    8,
  )}…${value.slice(-6)}`;
}

function metadataEntries(
  metadata:
    | Record<string, unknown>
    | null,
) {
  if (
    !metadata ||
    Object.keys(metadata)
      .length === 0
  ) {
    return [];
  }

  return Object.entries(
    metadata,
  ).slice(0, 8);
}

function StatCard({
  value,
  label,
  caption,
  icon: Icon,
}: {
  value: string | number;
  label: string;
  caption: string;
  icon: typeof Activity;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#111111] p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#C9A227]/20">
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[#C9A227]/[0.04] blur-3xl transition duration-500 group-hover:bg-[#C9A227]/[0.08]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
            {label}
          </p>

          <p className="mt-3 font-serif text-3xl leading-none text-[#F7F5F0]">
            {value}
          </p>

          <p className="mt-2 text-[9px] leading-5 text-white/25">
            {caption}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.025] text-[#C9A227]">
          <Icon
            size={17}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  );
}

export default async function AuditLogsPage() {
  const admin =
    await getAdminUser();

  if (!admin) {
    redirect("/admin");
  }

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } = await supabase
    .from("audit_logs")
    .select(
      "id, actor_id, action, target_type, target_id, ip_address, metadata, created_at",
    )
    .order(
      "created_at",
      {
        ascending: false,
      },
    )
    .limit(100);

  const logs =
    (data ?? []) as AuditLog[];

  const createCount =
    logs.filter(
      (log) =>
        normalizeAction(
          log.action,
        ).includes(
          "create",
        ),
    ).length;

  const updateCount =
    logs.filter(
      (log) =>
        normalizeAction(
          log.action,
        ).includes(
          "update",
        ),
    ).length;

  const deleteCount =
    logs.filter(
      (log) =>
        normalizeAction(
          log.action,
        ).includes(
          "delete",
        ),
    ).length;

  const uniqueActors =
    new Set(
      logs
        .map(
          (log) =>
            log.actor_id,
        )
        .filter(Boolean),
    ).size;

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#0A0A0A] text-[#F7F5F0]"
    >
      {/* =====================================================
          AMBIENT FIELD
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute -right-48 top-20 h-[34rem] w-[34rem] rounded-full bg-[#C9A227]/[0.045] blur-[130px]" />

        <div className="absolute -left-56 top-[42rem] h-[30rem] w-[30rem] rounded-full bg-white/[0.015] blur-[120px]" />

        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(rgba(255,255,255,0.18)_0.5px,transparent_0.5px)] [background-size:16px_16px]" />
      </div>

      <main className="relative z-10 mx-auto max-w-[1700px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
        {/* ===================================================
            HERO
        ==================================================== */}

        <section className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#111111]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(201,162,39,0.08),transparent_28%)]" />

          <div className="pointer-events-none absolute right-[20%] top-0 h-px w-[30%] bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-[#C9A227]" />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                    ORVEN LUX
                  </span>

                  <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                    / SECURITY ATELIER
                  </span>
                </div>

                <div className="mt-7 flex items-center gap-2">
                  <ShieldCheck
                    size={15}
                    strokeWidth={1.5}
                    className="text-[#C9A227]"
                  />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    ADMINISTRATIVE ACTIVITY LEDGER
                  </span>
                </div>

                <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-[#F7F5F0] sm:text-5xl lg:text-6xl">
                  سجل العمليات
                  <span className="block text-white/30">
                    بكل دقة.
                  </span>
                </h1>

                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40">
                  طبقة مراقبة إدارية تسجل العمليات
                  المهمة داخل ORVEN LUX وتمنحك
                  أثرًا واضحًا لما تم إنشاؤه أو
                  تعديله أو حذفه داخل النظام.
                </p>
              </div>

              <div className="relative hidden min-w-[250px] lg:block">
                <div className="rounded-[24px] border border-[#C9A227]/15 bg-[#0D0D0D] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/25">
                      SECURITY STATUS
                    </span>

                    <span className="flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                      ACTIVE
                    </span>
                  </div>

                  <p className="mt-6 font-serif text-5xl leading-none text-[#C9A227]">
                    100
                  </p>

                  <p className="mt-2 text-[8px] uppercase tracking-[0.18em] text-white/25">
                    RECORDS CAPACITY VIEW
                  </p>

                  <div className="mt-5 h-px bg-white/[0.06]">
                    <div className="h-full w-full bg-[#C9A227]" />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[8px] text-white/20">
                      CURRENT WINDOW
                    </span>

                    <span className="text-[8px] font-semibold text-[#C9A227]">
                      LAST 100
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                value={
                  logs.length
                }
                label="Visible records"
                caption="آخر العمليات المحملة من السجل."
                icon={
                  Activity
                }
              />

              <StatCard
                value={
                  createCount
                }
                label="Created"
                caption="عمليات إنشاء مسجلة."
                icon={
                  FilePlus2
                }
              />

              <StatCard
                value={
                  updateCount
                }
                label="Updated"
                caption="عمليات تعديل مسجلة."
                icon={
                  Wrench
                }
              />

              <StatCard
                value={
                  uniqueActors
                }
                label="Active actors"
                caption="مديرون ظهروا في السجل."
                icon={
                  UserRound
                }
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            COMMAND BAR
        ==================================================== */}

        <section className="mt-6 rounded-[24px] border border-white/[0.07] bg-[#111111] p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Filter
                  size={14}
                  className="text-[#C9A227]"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  LEDGER CONTROLS
                </span>
              </div>

              <p className="mt-2 text-[10px] text-white/25">
                واجهة المراقبة الحالية تعرض آخر
                100 عملية مرتبة من الأحدث إلى الأقدم.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <Database
                  size={13}
                  className="text-white/25"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  SUPABASE
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </div>

              <div className="inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <Clock3
                  size={13}
                  className="text-white/25"
                />

                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  LIVE LEDGER
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            LEDGER
        ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#111111]">
          <div className="flex flex-col justify-between gap-4 border-b border-white/[0.06] px-5 py-5 sm:px-6 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-semibold tracking-[0.2em] text-[#C9A227]">
                  01
                </span>

                <span className="h-px w-5 bg-[#C9A227]/35" />

                <span className="text-[9px] uppercase tracking-[0.2em] text-white/30">
                  ACTIVITY LEDGER
                </span>
              </div>

              <h2 className="mt-3 font-serif text-2xl text-[#F7F5F0] sm:text-3xl">
                آخر العمليات
              </h2>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                كل عملية هنا مرتبطة بالفاعل والهدف
                والوقت والسياق المسجل.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" />

                <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-white/35">
                  {logs.length} RECORDS
                </span>
              </div>

              {deleteCount > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full border border-red-400/10 bg-red-400/[0.04] px-3 py-2">
                  <Trash2
                    size={11}
                    className="text-red-300"
                  />

                  <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-red-300/70">
                    {deleteCount} DELETE
                  </span>
                </div>
              )}
            </div>
          </div>

          {error ? (
            <div className="px-5 py-14 sm:px-6">
              <div className="mx-auto max-w-[650px] rounded-[22px] border border-red-400/15 bg-red-400/[0.045] p-6 text-center">
                <AlertTriangle
                  size={22}
                  className="mx-auto text-red-300"
                />

                <h3 className="mt-4 font-serif text-xl text-[#F7F5F0]">
                  تعذر تحميل سجل العمليات
                </h3>

                <p className="mt-2 text-[10px] leading-6 text-white/30">
                  حدث خطأ أثناء قراءة جدول
                  audit_logs من Supabase.
                </p>

                <p className="mt-4 break-words font-mono text-[9px] text-red-300/70">
                  {error.message}
                </p>
              </div>
            </div>
          ) : logs.length === 0 ? (
            <div className="px-5 py-16 text-center sm:px-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025] text-white/20">
                <Search
                  size={20}
                />
              </div>

              <h3 className="mt-5 font-serif text-xl text-white/65">
                لا توجد سجلات بعد
              </h3>

              <p className="mt-2 text-[10px] leading-5 text-white/25">
                ستظهر العمليات الإدارية هنا عند
                تنفيذها من داخل النظام.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto xl:block">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-[#0D0D0D]">
                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        الوقت
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        العملية
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        الهدف
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        المنفذ
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        الشبكة
                      </th>

                      <th className="whitespace-nowrap px-6 py-4 text-right text-[8px] font-semibold uppercase tracking-[0.16em] text-white/25">
                        السياق
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map(
                      (
                        log,
                        index,
                      ) => {
                        const tone =
                          getActionTone(
                            log.action,
                          );

                        const ActionIcon =
                          tone.icon;

                        const entries =
                          metadataEntries(
                            log.metadata,
                          );

                        return (
                          <tr
                            key={String(
                              log.id,
                            )}
                            className="group border-b border-white/[0.045] transition duration-300 hover:bg-white/[0.018]"
                          >
                            <td className="whitespace-nowrap px-6 py-5">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[9px] text-white/15">
                                  {String(
                                    index +
                                      1,
                                  ).padStart(
                                    2,
                                    "0",
                                  )}
                                </span>

                                <div>
                                  <p className="text-[10px] font-medium text-white/65">
                                    {formatShortDate(
                                      log.created_at,
                                    )}
                                  </p>

                                  <p className="mt-1 text-[8px] text-white/20">
                                    {formatDate(
                                      log.created_at,
                                    )}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tone.wrapper} ${tone.glow}`}
                                >
                                  <ActionIcon
                                    size={
                                      15
                                    }
                                    strokeWidth={
                                      1.6
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="text-[10px] font-semibold text-white/75">
                                    {formatAction(
                                      log.action,
                                    )}
                                  </p>

                                  <div className="mt-1 flex items-center gap-2">
                                    <span
                                      className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                                    />

                                    <span className="text-[8px] uppercase tracking-[0.1em] text-white/20">
                                      {
                                        tone.label
                                      }
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <p className="text-[10px] font-semibold text-white/65">
                                {formatTargetType(
                                  log.target_type,
                                )}
                              </p>

                              {log.target_id && (
                                <p className="mt-1 font-mono text-[9px] text-[#C9A227]/60">
                                  #
                                  {
                                    log.target_id
                                  }
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-white/35">
                                  <UserRound
                                    size={
                                      13
                                    }
                                  />
                                </div>

                                <div>
                                  <p className="font-mono text-[9px] text-white/50">
                                    {shortenId(
                                      log.actor_id,
                                    )}
                                  </p>

                                  <p className="mt-1 text-[8px] text-white/20">
                                    Administrator
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="h-7 w-7 rounded-lg border border-white/[0.06] bg-white/[0.02]" />

                                <div>
                                  <p className="font-mono text-[9px] text-white/45">
                                    {log.ip_address ??
                                      "—"}
                                  </p>

                                  <p className="mt-1 text-[8px] text-white/20">
                                    REQUEST ORIGIN
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              {entries.length >
                              0 ? (
                                <details className="max-w-[300px]">
                                  <summary className="flex cursor-pointer list-none items-center gap-2 text-[9px] font-semibold text-[#C9A227]/70 transition hover:text-[#C9A227]">
                                    <Eye
                                      size={
                                        12
                                      }
                                    />

                                    عرض السياق
                                  </summary>

                                  <div className="mt-3 space-y-2 rounded-xl border border-white/[0.05] bg-[#0C0C0C] p-3">
                                    {entries.map(
                                      ([
                                        key,
                                        value,
                                      ]) => (
                                        <div
                                          key={
                                            key
                                          }
                                          className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
                                        >
                                          <span className="text-[8px] uppercase tracking-[0.1em] text-white/20">
                                            {
                                              key
                                            }
                                          </span>

                                          <span className="max-w-[180px] break-words text-left font-mono text-[8px] text-white/45">
                                            {typeof value ===
                                            "object"
                                              ? JSON.stringify(
                                                  value,
                                                )
                                              : String(
                                                  value,
                                                )}
                                          </span>
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </details>
                              ) : (
                                <span className="text-[9px] text-white/15">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile / tablet ledger */}
              <div className="divide-y divide-white/[0.05] xl:hidden">
                {logs.map(
                  (
                    log,
                    index,
                  ) => {
                    const tone =
                      getActionTone(
                        log.action,
                      );

                    const ActionIcon =
                      tone.icon;

                    const entries =
                      metadataEntries(
                        log.metadata,
                      );

                    return (
                      <article
                        key={String(
                          log.id,
                        )}
                        className="relative overflow-hidden px-5 py-5 transition hover:bg-white/[0.018] sm:px-6"
                      >
                        <div className="absolute right-0 top-0 h-full w-px bg-[#C9A227]/10" />

                        <div className="flex items-start gap-4">
                          <div
                            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tone.wrapper}`}
                          >
                            <ActionIcon
                              size={
                                16
                              }
                              strokeWidth={
                                1.6
                              }
                            />

                            <span
                              className={`absolute -bottom-1 -left-1 h-2 w-2 rounded-full border-2 border-[#111111] ${tone.dot}`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-[11px] font-semibold text-white/75">
                                  {formatAction(
                                    log.action,
                                  )}
                                </p>

                                <p className="mt-1 text-[8px] uppercase tracking-[0.1em] text-white/20">
                                  {
                                    tone.label
                                  }{" "}
                                  ·{" "}
                                  {log.action}
                                </p>
                              </div>

                              <span className="shrink-0 font-mono text-[8px] text-white/20">
                                #
                                {String(
                                  index +
                                    1,
                                ).padStart(
                                  2,
                                  "0",
                                )}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
                                <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-white/20">
                                  TARGET
                                </p>

                                <p className="mt-2 text-[10px] font-semibold text-white/60">
                                  {formatTargetType(
                                    log.target_type,
                                  )}
                                </p>

                                {log.target_id && (
                                  <p className="mt-1 font-mono text-[8px] text-[#C9A227]/55">
                                    #
                                    {
                                      log.target_id
                                    }
                                  </p>
                                )}
                              </div>

                              <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
                                <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-white/20">
                                  ACTOR
                                </p>

                                <p className="mt-2 font-mono text-[9px] text-white/50">
                                  {shortenId(
                                    log.actor_id,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
                                <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-white/20">
                                  TIME
                                </p>

                                <p className="mt-2 text-[9px] text-white/50">
                                  {formatDate(
                                    log.created_at,
                                  )}
                                </p>
                              </div>

                              <div className="rounded-xl border border-white/[0.05] bg-white/[0.018] p-3">
                                <p className="text-[7px] font-semibold uppercase tracking-[0.15em] text-white/20">
                                  IP
                                </p>

                                <p className="mt-2 break-all font-mono text-[9px] text-white/45">
                                  {log.ip_address ??
                                    "—"}
                                </p>
                              </div>
                            </div>

                            {entries.length >
                              0 && (
                              <details className="mt-3 rounded-xl border border-white/[0.05] bg-[#0C0C0C] p-3">
                                <summary className="flex cursor-pointer list-none items-center gap-2 text-[9px] font-semibold text-[#C9A227]/70">
                                  <Eye
                                    size={
                                      12
                                    }
                                  />

                                  عرض التفاصيل المسجلة
                                </summary>

                                <div className="mt-3 space-y-2">
                                  {entries.map(
                                    ([
                                      key,
                                      value,
                                    ]) => (
                                      <div
                                        key={
                                          key
                                        }
                                        className="flex items-start justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0"
                                      >
                                        <span className="text-[8px] uppercase tracking-[0.1em] text-white/20">
                                          {
                                            key
                                          }
                                        </span>

                                        <span className="max-w-[65%] break-words text-left font-mono text-[8px] text-white/45">
                                          {typeof value ===
                                          "object"
                                            ? JSON.stringify(
                                                value,
                                              )
                                            : String(
                                                value,
                                              )}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </details>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            </>
          )}
        </section>

        {/* ===================================================
            SECURITY NOTE
        ==================================================== */}

        <section className="mt-6 rounded-[24px] border border-[#C9A227]/10 bg-[#111111] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#C9A227]/15 bg-[#C9A227]/[0.06] text-[#C9A227]">
              <ShieldCheck
                size={18}
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C9A227]">
                SECURITY PRINCIPLE
              </p>

              <h3 className="mt-2 font-serif text-xl text-white/80">
                Trace every important administrative action.
              </h3>

              <p className="mt-2 max-w-3xl text-[10px] leading-6 text-white/30">
                سجل العمليات لا يغيّر البيانات بنفسه؛
                وظيفته توثيق ما يحدث داخل لوحة الإدارة
                حتى يبقى لديك أثر واضح للمراجعة
                والتشخيص والأمان.
              </p>
            </div>

            <div className="mr-auto hidden items-center gap-2 self-center rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-3 py-2 sm:flex">
              <CheckCircle2
                size={12}
                className="text-emerald-300"
              />

              <span className="text-[8px] font-semibold uppercase tracking-[0.12em] text-emerald-300/70">
                AUDIT ACTIVE
              </span>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] py-6 text-[8px] uppercase tracking-[0.16em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span>
            ORVEN LUX — SECURITY ATELIER
          </span>

          <span>
            Administrative activity ledger
          </span>
        </footer>
      </main>
    </div>
  );
}