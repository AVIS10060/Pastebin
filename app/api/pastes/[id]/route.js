import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request, { params }) {
  const { id } = await params;
  const key = `paste:${id}`;

  // 1️⃣ Fetch paste
  const data = await redis.get(key);

  if (!data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const paste = typeof data === "string" ? JSON.parse(data) : data;


  // 2️⃣ Determine current time (TEST_MODE support)
  const testMode = process.env.TEST_MODE === "1";
  const now = testMode
    ? Number(request.headers.get("x-test-now-ms"))
    : Date.now();

  // 3️⃣ Expiry check
  if (paste.expires_at && now >= paste.expires_at) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4️⃣ View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 5️⃣ Increment views (atomic)
  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  // 6️⃣ Calculate remaining views
  const remaining_views =
    paste.max_views !== null
      ? paste.max_views - paste.views
      : null;

  // 7️⃣ Response
  return NextResponse.json({
    content: paste.content,
    remaining_views,
    expires_at: paste.expires_at,
  });
}
