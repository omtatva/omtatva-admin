"use client";

import Link from "next/link";
import { ADMIN_SECTIONS } from "@/lib/sections";
import { useCms } from "@/components/CmsProvider";

export default function DashboardPage() {
  const { cms, loading } = useCms();

  return (
    <div>
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>
      <p className="mt-2 text-zinc-500">
        Manage each homepage section and content library. Changes apply to the live site after you
        save.
      </p>

      <Link
        href="/candidates"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-blue-600/40 bg-blue-950/30 px-4 py-3 text-sm text-blue-200 transition-colors hover:border-blue-500/60 hover:bg-blue-950/50"
      >
        <span className="font-semibold text-white">Candidates</span>
        <span className="text-zinc-400">— review job applications & resumes</span>
      </Link>

      {loading ? (
        <p className="mt-8 text-zinc-500">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section) => (
            <Link
              key={section.slug}
              href={`/edit/${section.slug}`}
              className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5 transition-colors hover:border-blue-600/50 hover:bg-zinc-900"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {section.group}
              </p>
              <h3 className="mt-2 font-semibold text-white">{section.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{section.description}</p>
            </Link>
          ))}
        </div>
      )}

      {cms && (
        <div className="mt-10 rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-sm text-zinc-400">
          <p>
            <strong className="text-white">API:</strong>{" "}
            <code>GET {process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}/api/content</code>
          </p>
          <p className="mt-2">
            <strong className="text-white">Admin API:</strong>{" "}
            <code>PUT /api/admin/content</code> (Bearer token)
          </p>
        </div>
      )}
    </div>
  );
}
