"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const element = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !element.current || !window.turnstile || widgetId.current) return;
    widgetId.current = window.turnstile.render(element.current, {
      sitekey: siteKey,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
  }, [onToken, siteKey]);

  if (!siteKey) return null;
  return <><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={() => { if (element.current && window.turnstile && !widgetId.current) { widgetId.current = window.turnstile.render(element.current, { sitekey: siteKey, callback: onToken, "expired-callback": () => onToken(""), "error-callback": () => onToken("") }); } }} /><div ref={element} /></>;
}
