import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function proxyRequest(request: NextRequest, path: string) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  const url = new URL(`${API_URL}/api/admin/applications${path}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  try {
    const res = await fetch(url.toString(), {
      method: request.method,
      headers: {
        Authorization: auth,
        ...(request.method !== "GET" && request.method !== "DELETE"
          ? { "Content-Type": request.headers.get("content-type") ?? "application/json" }
          : {}),
      },
      body: ["GET", "DELETE", "HEAD"].includes(request.method)
        ? undefined
        : await request.text(),
      cache: "no-store",
    });

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
        ...(res.headers.get("content-disposition")
          ? { "Content-Disposition": res.headers.get("content-disposition")! }
          : {}),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: `Could not reach the main site at ${API_URL}. Start the omtatva app (npm run dev on port 3000).`,
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "");
}
