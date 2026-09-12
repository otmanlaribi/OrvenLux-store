import { NextResponse } from "next/server";

import {
  sendTelegramTestMessage,
} from "@/lib/integrations/telegram";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const message =
      await sendTelegramTestMessage();

    return NextResponse.json(
      {
        success: true,
        message: "Telegram test message sent successfully",
        telegramMessageId:
          message.message_id,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(
      "TELEGRAM TEST ERROR:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to send Telegram test message",
      },
      {
        status: 500,
      },
    );
  }
}