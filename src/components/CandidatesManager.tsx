"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useCms } from "@/components/CmsProvider";
import { TruncateCell } from "@/components/CollectionTable";
import { Field } from "@/components/ui";
import { usePagination } from "@/hooks/usePagination";
import {
  deleteApplication,
  fetchApplications,
  resumeDownloadUrl,
  updateApplicationStatus,
} from "@/lib/applicationsApi";
import { getStoredKey, CmsApiError } from "@/lib/api";
import {
  APPLICATION_STATUSES,
  STATUS_LABELS,
  type ApplicationStatus,
  type CareerApplication,
} from "@/types/applications";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-blue-950 text-blue-300 ring-blue-800",
  reviewed: "bg-zinc-800 text-zinc-300 ring-zinc-700",
  shortlisted: "bg-emerald-950 text-emerald-300 ring-emerald-800",
  rejected: "bg-red-950 text-red-300 ring-red-800",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

async function downloadResume(id: string, filename: string) {
  const key = getStoredKey();
  if (!key) return;

  const res = await fetch(resumeDownloadUrl(id), {
    headers: { Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error("Could not download resume");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "resume.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

export default function CandidatesManager() {
  const { cms } = useCms();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerFilter, setCareerFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApplications(careerFilter || undefined);
      setApplications(data);
    } catch (e) {
      setError(e instanceof CmsApiError ? e.message : "Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [careerFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const {
    page,
    setPage,
    total,
    totalPages,
    paginatedItems,
    rangeStart,
    rangeEnd,
  } = usePagination(applications, 10);

  const statusCounts = useMemo(() => {
    const counts: Record<ApplicationStatus, number> = {
      new: 0,
      reviewed: 0,
      shortlisted: 0,
      rejected: 0,
    };
    for (const app of applications) counts[app.status]++;
    return counts;
  }, [applications]);

  async function handleStatusChange(id: string, status: ApplicationStatus) {
    setBusyId(id);
    setError(null);
    try {
      const updated = await updateApplicationStatus(id, status);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (e) {
      setError(e instanceof CmsApiError ? e.message : "Failed to update status");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete application from ${name}? This cannot be undone.`)) return;
    setBusyId(id);
    setError(null);
    try {
      await deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch (e) {
      setError(e instanceof CmsApiError ? e.message : "Failed to delete application");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Candidates</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Review career applications submitted from the public site.
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
        >
          {loading ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {APPLICATION_STATUSES.map((status) => (
          <div
            key={status}
            className={cn(
              "rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider ring-1 ring-inset",
              STATUS_STYLES[status]
            )}
          >
            {STATUS_LABELS[status]}: {statusCounts[status]}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <Field label="Filter by position">
          <select
            value={careerFilter}
            onChange={(e) => {
              setCareerFilter(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All positions</option>
            {(cms?.careers ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/80">
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Applicant
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Position
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Submitted
              </th>
              <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Status
              </th>
              <th className="w-36 px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading && paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  Loading applications…
                </td>
              </tr>
            ) : paginatedItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-500">
                  No applications yet. They appear here when someone applies on the careers page.
                </td>
              </tr>
            ) : (
              paginatedItems.map((app) => {
                const isExpanded = expandedId === app.id;
                const isBusy = busyId === app.id;

                return (
                  <Fragment key={app.id}>
                    <tr
                      className={cn(
                        "transition-colors hover:bg-zinc-900/40",
                        isExpanded && "bg-zinc-900/30"
                      )}
                    >
                      <td className="px-3 py-2.5 align-middle">
                        <p className="font-medium text-white">{app.name}</p>
                        <p className="text-xs text-zinc-500">{app.email}</p>
                      </td>
                      <td className="px-3 py-2.5 align-middle">
                        <TruncateCell text={app.careerTitle} maxWidth="max-w-[200px]" />
                      </td>
                      <td className="px-3 py-2.5 align-middle text-zinc-400">
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-3 py-2.5 align-middle">
                        <span
                          className={cn(
                            "inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
                            STATUS_STYLES[app.status]
                          )}
                        >
                          {STATUS_LABELS[app.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right align-middle">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : app.id)}
                          className="text-xs font-medium text-blue-400 hover:text-blue-300"
                        >
                          {isExpanded ? "Close" : "View"}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-zinc-950/80">
                        <td colSpan={5} className="border-t border-zinc-800/80 px-4 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase text-zinc-500">Email</p>
                              <a
                                href={`mailto:${app.email}`}
                                className="text-sm text-blue-400 hover:underline"
                              >
                                {app.email}
                              </a>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase text-zinc-500">Phone</p>
                              <p className="text-sm text-zinc-200">{app.phone || "—"}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <p className="text-xs font-semibold uppercase text-zinc-500">
                                Cover letter
                              </p>
                              <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">
                                {app.coverLetter || "—"}
                              </p>
                            </div>
                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase text-zinc-500">
                                Status
                              </p>
                              <select
                                value={app.status}
                                disabled={isBusy}
                                onChange={(e) =>
                                  handleStatusChange(app.id, e.target.value as ApplicationStatus)
                                }
                                className="w-full max-w-xs rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                              >
                                {APPLICATION_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="flex flex-wrap items-end gap-3">
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={async () => {
                                  try {
                                    await downloadResume(app.id, app.resumeFilename);
                                  } catch {
                                    setError("Could not download resume");
                                  }
                                }}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                              >
                                Download resume (PDF)
                              </button>
                              {app.resumeUrl && (
                                <a
                                  href={app.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
                                >
                                  View in bucket
                                </a>
                              )}
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() => handleDelete(app.id, app.name)}
                                className="rounded-md border border-red-900 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-950/50 disabled:opacity-50"
                              >
                                Delete application
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <p>
            Showing <span className="text-zinc-200">{rangeStart}</span>–
            <span className="text-zinc-200">{rangeEnd}</span> of{" "}
            <span className="text-zinc-200">{total}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="min-w-[4rem] text-center text-xs">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
