import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => request.cookies.getAll(), setAll: (values) => values.forEach(({ name, value, options }) => { request.cookies.set(name, value); response.cookies.set(name, value, options); }) },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const protectedRoute = request.nextUrl.pathname.startsWith("/admin") || request.nextUrl.pathname.startsWith("/dashboard");
  if (protectedRoute && !user) return NextResponse.redirect(new URL("/login", request.url));
  return response;
}
export const config = { matcher: ["/admin/:path*", "/dashboard/:path*", "/login"] };
