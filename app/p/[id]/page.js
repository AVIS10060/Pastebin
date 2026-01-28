import { notFound } from "next/navigation";
import { redis } from "@/lib/redis";

export default async function PastePage({ params }) {
  const { id } = await params;
  const key = `paste:${id}`;

  // 1️⃣ Fetch paste
  const data = await redis.get(key);

  if (!data) {
    notFound();
  }

  // Handle both string & object safely
  const paste = typeof data === "string" ? JSON.parse(data) : data;

  // 2️⃣ Time handling (TEST_MODE support)
  const testMode = process.env.TEST_MODE === "1";
  const now = testMode ? Date.now() : Date.now();

  // 3️⃣ Expiry check
  if (paste.expires_at && now >= paste.expires_at) {
    notFound();
  }

  // 4️⃣ View limit check
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    notFound();
  }

  // 5️⃣ Increment views
  paste.views += 1;
  await redis.set(key, JSON.stringify(paste));

  // 6️⃣ Render safely (NO HTML execution)
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <pre className="whitespace-pre-wrap break-words bg-white p-4 rounded border">
        {paste.content}
      </pre>
    </main>
  );
}
