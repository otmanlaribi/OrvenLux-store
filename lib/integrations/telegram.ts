import "server-only";

type TelegramApiResponse<T> = {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
};

type TelegramMessage = {
  message_id: number;
  date: number;
  chat: {
    id: number;
    type: string;
  };
  text?: string;
};

function getTelegramConfig() {
  const botToken =
    process.env.TELEGRAM_BOT_TOKEN;

  const chatId =
    process.env.TELEGRAM_ADMIN_CHAT_ID;

  if (!botToken) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN is not configured",
    );
  }

  if (!chatId) {
    throw new Error(
      "TELEGRAM_ADMIN_CHAT_ID is not configured",
    );
  }

  return {
    botToken,
    chatId,
  };
}

async function callTelegram<T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { botToken } =
    getTelegramConfig();

  const response =
    await fetch(
      `https://api.telegram.org/bot${botToken}/${method}`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          body,
        ),
        cache: "no-store",
        signal:
          AbortSignal.timeout(
            10_000,
          ),
      },
    );

  const data =
    (await response.json()) as TelegramApiResponse<T>;

  if (
    !response.ok ||
    !data.ok
  ) {
    throw new Error(
      `Telegram API error${
        data.error_code
          ? ` ${data.error_code}`
          : ""
      }: ${
        data.description ??
        "Unknown error"
      }`,
    );
  }

  if (
    data.result ===
    undefined
  ) {
    throw new Error(
      "Telegram API returned no result",
    );
  }

  return data.result;
}

export async function sendTelegramMessage(
  text: string,
) {
  if (
    !text ||
    text.trim().length ===
      0
  ) {
    throw new Error(
      "Telegram message cannot be empty",
    );
  }

  if (
    text.length > 4096
  ) {
    throw new Error(
      "Telegram message exceeds the 4096 character limit",
    );
  }

  const { chatId } =
    getTelegramConfig();

  return callTelegram<TelegramMessage>(
    "sendMessage",
    {
      chat_id: chatId,
      text,
    },
  );
}

export async function sendTelegramTestMessage() {
  return sendTelegramMessage(
    [
      "🔔 ORVEN LUX",
      "",
      "Telegram integration test",
      "",
      "✅ Bot connection works",
      "✅ Chat ID works",
      "✅ Server integration is ready",
    ].join("\n"),
  );
}

export type NewOrderNotificationInput = {
  id: number;
  customerName?: string | null;
  phone?: string | null;
  totalPrice?: number | string | null;
  status?: string | null;
  wilaya?: number | string | null;
  commune?: string | null;
  deliveryType?: string | null;
};

function formatOrderStatus(
  status: string | null | undefined,
) {
  const normalized =
    String(status ?? "")
      .trim()
      .toLowerCase();

  const labels: Record<
    string,
    string
  > = {
    pending: "جديد",
    new: "جديد",
    confirmed:
      "تم التأكيد",
    processing:
      "قيد المعالجة",
    shipped:
      "تم الشحن",
    delivered:
      "تم التسليم",
    cancelled:
      "ملغي",
    canceled:
      "ملغي",
  };

  return (
    labels[normalized] ??
    status ??
    "غير محدد"
  );
}

function formatDzd(
  value: number | string | null | undefined,
) {
  const amount =
    Number(value ?? 0);

  return new Intl.NumberFormat(
    "fr-DZ",
  ).format(
    Number.isFinite(
      amount,
    )
      ? amount
      : 0,
  );
}

export async function sendNewOrderTelegramNotification(
  order: NewOrderNotificationInput,
) {
  const delivery =
    order.deliveryType ===
    "office"
      ? "مكتب"
      : order.deliveryType ===
          "home"
        ? "منزل"
        : order.deliveryType ??
          "غير محدد";

  const location =
    [
      order.commune,
      order.wilaya
        ? `Wilaya ${order.wilaya}`
        : null,
    ]
      .filter(Boolean)
      .join(" · ") ||
    "غير محدد";

  const message = [
    "🔔 ORVEN LUX",
    "",
    "طلب جديد وصل الآن",
    "",
    `🧾 الطلب: #${order.id}`,
    `👤 العميل: ${
      order.customerName ??
      "غير محدد"
    }`,
    `📞 الهاتف: ${
      order.phone ??
      "غير محدد"
    }`,
    `💰 المبلغ: ${formatDzd(
      order.totalPrice,
    )} DZD`,
    `📍 الموقع: ${location}`,
    `🚚 التوصيل: ${delivery}`,
    `📦 الحالة: ${formatOrderStatus(
      order.status,
    )}`,
    "",
    "افتح لوحة التحكم لمراجعة الطلب.",
  ].join("\n");

  return sendTelegramMessage(
    message,
  );
}
