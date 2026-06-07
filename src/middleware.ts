import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "",
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(200, "1 m"), // 200 requests per minute
  ephemeralCache: new Map(),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  // Only limit API routes and server actions
  if (
    request.nextUrl.pathname.startsWith("/api/") ||
    request.method === "POST"
  ) {
    if (!process.env.UPSTASH_REDIS_REST_URL && !process.env.KV_REST_API_URL) {
      // Skip rate limiting if KV is not configured (e.g., local dev)
      return NextResponse.next();
    }

    let ip = request.headers.get("x-real-ip");
    if (!ip) {
      const forwardedFor = request.headers.get("x-forwarded-for");
      if (forwardedFor) {
        const ips = forwardedFor.split(",");
        ip = ips[ips.length - 1].trim();
      }
    }
    ip = ip || "127.0.0.1";

    const { success, limit, reset, remaining } = await ratelimit.limit(`ratelimit_${ip}`);

    const res = success
      ? NextResponse.next()
      : new NextResponse("Too Many Requests", { status: 429 });

    res.headers.set("X-RateLimit-Limit", limit.toString());
    res.headers.set("X-RateLimit-Remaining", remaining.toString());
    res.headers.set("X-RateLimit-Reset", reset.toString());

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};