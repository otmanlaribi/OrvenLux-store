import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const contentSecurityPolicy = isDevelopment
  ? "default-src 'self'; img-src 'self' https://fmbprcpnalobfsoanhnr.supabase.co blob: data:; connect-src 'self' https://fmbprcpnalobfsoanhnr.supabase.co https://challenges.cloudflare.com ws: wss:; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  : "default-src 'self'; img-src 'self' https://fmbprcpnalobfsoanhnr.supabase.co blob: data:; connect-src 'self' https://fmbprcpnalobfsoanhnr.supabase.co https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fmbprcpnalobfsoanhnr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: contentSecurityPolicy },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ],
    }];
  },
};

export default nextConfig;
