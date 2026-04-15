import { NextResponse } from "next/server";

function apiBase(): string {
  const base =
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:5235";
  return base.replace(/\/$/, "");
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const body = await req.text();

  const upstream = await fetch(`${apiBase()}/api/kudos-coach/suggest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(auth ? { Authorization: auth } : {}),
    },
    body,
  });

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";

  if (!upstream.ok) {
    const errText = await upstream.text();
    return new NextResponse(errText, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}
