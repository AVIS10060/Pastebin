"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResultUrl("");

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded border w-full max-w-md space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Pastebin</h1>

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Enter your paste here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="TTL (seconds, optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          min="1"
        />

        <input
          type="number"
          className="w-full border p-2 rounded"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          min="1"
        />

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded"
        >
          Create Paste
        </button>

        {resultUrl && (
          <div className="text-sm break-words">
            <p className="font-semibold">Your paste URL:</p>
            <a
              href={resultUrl}
              className="text-blue-600 underline"
              target="_blank"
            >
              {resultUrl}
            </a>
          </div>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </main>
  );
}
