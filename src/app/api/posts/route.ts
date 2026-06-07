import { getPosts } from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  const take = parseInt(searchParams.get("take") || "12", 10);

  try {
    const posts = await getPosts(skip, take);
    const response = NextResponse.json(posts);
    
    // Cache on Edge/CDN for 30 seconds to prevent DDoS and reduce Fast Origin Transfer
    response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=59");
    return response;
  } catch (error) {
    console.error("Error in GET /api/posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}