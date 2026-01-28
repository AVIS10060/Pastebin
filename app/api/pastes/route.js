import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // 1️⃣ Validation
    if (!content || typeof content !== "string" || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return NextResponse.json(
          { error: "ttl_seconds must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return NextResponse.json(
          { error: "max_views must be an integer >= 1" },
          { status: 400 }
        );
      }
    }

   
    const id = Math.random().toString(36).slice(2, 10);

    // 3️⃣ Time handling
    const now = Date.now();
    const expires_at =
      ttl_seconds !== undefined ? now + ttl_seconds * 1000 : null;

    // 4️⃣ Paste object
    const paste = {
      id,
      content,
      created_at: now,
      expires_at,
      max_views: max_views ?? null,
      views: 0,
    };

    // 5️⃣ Save to Redis
    const key = `paste:${id}`;
    await redis.set(key, JSON.stringify(paste));

    // 6️⃣ Set TTL in Redis (optional)
    if (ttl_seconds !== undefined) {
      await redis.expire(key, ttl_seconds);
    }

    // 7️⃣ Response
    return NextResponse.json({
      id,
      url: `${request.nextUrl.origin}/p/${id}`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
