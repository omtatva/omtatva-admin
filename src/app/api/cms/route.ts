import { NextRequest, NextResponse } from "next/server";

const CMS_API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

async function proxyRequest(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  const url = `${CMS_API_URL}/api/admin/content`;

  try {
    const res = await fetch(url, {
      method: request.method,
      headers: {
        Authorization: auth,
        ...(request.method === "PUT"
          ? { "Content-Type": request.headers.get("content-type") ?? "application/json" }
          : {}),
      },
      body: request.method === "PUT" ? await request.text() : undefined,
      cache: "no-store",
    });

    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: `Could not reach the main site at ${CMS_API_URL}. Start the omtatva app (npm run dev on port 3000).`,
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request);
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request);
}
