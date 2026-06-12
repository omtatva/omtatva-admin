import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = request.headers.get("authorization");
  if (!auth) {
    return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
  }

  const { id } = await context.params;
  const url = `${API_URL}/api/admin/applications/${encodeURIComponent(id)}/resume`;

  try {
    const res = await fetch(url, {
      headers: { Authorization: auth },
      cache: "no-store",
    });

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") ?? "application/pdf",
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
