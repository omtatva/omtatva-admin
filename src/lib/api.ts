import type { CmsData } from "@/types/cms";

/** Browser calls same-origin proxy; avoids CORS to the main site. */
const CMS_ENDPOINT = "/api/cms";

export class CmsApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = "CmsApiError";
  }
}

export function getStoredKey(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("omtatva_admin_key");
}

export function storeKey(key: string) {
  sessionStorage.setItem("omtatva_admin_key", key);
}

export function clearKey() {
  sessionStorage.removeItem("omtatva_admin_key");
}

async function parseCmsResponse(res: Response): Promise<CmsData> {
  if (res.ok) return res.json();

  let detail = "";
  try {
    const body = (await res.json()) as { error?: string };
    detail = body.error ?? "";
  } catch {
    /* non-JSON body */
  }

  if (res.status === 401) {
    throw new CmsApiError(
      detail ||
        "Invalid admin API key. Use the same ADMIN_API_KEY as in the main site .env.local.",
      401
    );
  }
  if (res.status === 502) {
    throw new CmsApiError(
      detail ||
        "Main site unreachable. Start omtatva on port 3000 and set NEXT_PUBLIC_API_URL in .env.local.",
      502
    );
  }
  if (res.status === 503) {
    throw new CmsApiError(
      detail ||
        "The main site is running but cannot reach the database. Check DATABASE_URL and that Cloud SQL allows this server's IP.",
      503
    );
  }
  throw new CmsApiError(detail || "Failed to reach CMS API", res.status);
}

export async function fetchCms(key: string): Promise<CmsData> {
  const res = await fetch(CMS_ENDPOINT, {
    headers: { Authorization: `Bearer ${key}` },
    cache: "no-store",
  });
  return parseCmsResponse(res);
}

export async function saveCms(key: string, data: CmsData): Promise<CmsData> {
  const res = await fetch(CMS_ENDPOINT, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return parseCmsResponse(res);
}
