import { getStoredKey, CmsApiError } from "@/lib/api";
import type { ApplicationStatus, CareerApplication } from "@/types/applications";

const APPLICATIONS_ENDPOINT = "/api/applications";

async function parseJsonResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json() as Promise<T>;

  let detail = "";
  try {
    const body = (await res.json()) as { error?: string };
    detail = body.error ?? "";
  } catch {
    /* non-JSON body */
  }

  if (res.status === 401) {
    throw new CmsApiError(detail || "Invalid admin API key.", 401);
  }
  if (res.status === 502) {
    throw new CmsApiError(
      detail ||
        "Main site unreachable. Start omtatva on port 3000 and set NEXT_PUBLIC_API_URL in .env.local.",
      502
    );
  }
  throw new CmsApiError(detail || "Request failed", res.status);
}

function authHeaders(): HeadersInit {
  const key = getStoredKey();
  if (!key) throw new CmsApiError("Not signed in.", 401);
  return { Authorization: `Bearer ${key}` };
}

export async function fetchApplications(careerId?: string): Promise<CareerApplication[]> {
  const qs = careerId ? `?careerId=${encodeURIComponent(careerId)}` : "";
  const res = await fetch(`${APPLICATIONS_ENDPOINT}${qs}`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const data = await parseJsonResponse<{ applications: CareerApplication[] }>(res);
  return data.applications;
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus
): Promise<CareerApplication> {
  const res = await fetch(`${APPLICATIONS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await parseJsonResponse<{ application: CareerApplication }>(res);
  return data.application;
}

export async function deleteApplication(id: string): Promise<void> {
  const res = await fetch(`${APPLICATIONS_ENDPOINT}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await parseJsonResponse<{ ok: boolean }>(res);
}

export function resumeDownloadUrl(id: string): string {
  return `${APPLICATIONS_ENDPOINT}/${encodeURIComponent(id)}/resume`;
}
