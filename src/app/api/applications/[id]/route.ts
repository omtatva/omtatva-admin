import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RouteContext = { params: Promise<{ id: string }> };

async function proxyRequest(request: NextRequest, id: string) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  const url = `${API_URL}/api/admin/applications/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      method: request.method,
      headers: {
        Authorization: auth,
        ...(request.method === "PATCH"
          ? { "Content-Type": request.headers.get("content-type") ?? "application/json" }
          : {}),
      },
      body: request.method === "PATCH" ? await request.text() : undefined,
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
        error: `Could not reach the main site at ${API_URL}. Start the omtatva app (npm run dev on port 3000).`,
      },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, id);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, id);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  return proxyRequest(request, id);
}
