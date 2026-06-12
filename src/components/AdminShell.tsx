"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_SECTIONS } from "@/lib/sections";
import { clearKey, getStoredKey } from "@/lib/api";
import { useCms } from "@/components/CmsProvider";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { save, saving, error, cms } = useCms();

  useEffect(() => {
    if (!getStoredKey()) router.replace("/login");
  }, [router]);

  const groups = ["Homepage", "Content", "Site"] as const;

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-black">
        <div className="border-b border-zinc-800 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
            Om Tatva
          </p>
          <h1 className="mt-1 font-semibold text-white">Content Admin</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <Link
            href="/"
            className={cn(
              "mb-4 block rounded-md px-3 py-2 text-sm font-medium",
              pathname === "/" ? "bg-blue-600 text-white" : "text-zinc-400 hover:bg-zinc-900"
            )}
          >
            Dashboard
          </Link>
          <div className="mb-4">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Hiring
            </p>
            <Link
              href="/candidates"
              className={cn(
                "mt-0.5 block rounded-md px-3 py-2 text-sm transition-colors",
                pathname === "/candidates"
                  ? "bg-zinc-800 font-semibold text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              Candidates
            </Link>
          </div>
          {groups.map((group) => (
            <div key={group} className="mb-4">
              <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {group}
              </p>
              <ul className="space-y-0.5">
                {ADMIN_SECTIONS.filter((s) => s.group === group).map((section) => (
                  <li key={section.slug}>
                    <Link
                      href={`/edit/${section.slug}`}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === `/edit/${section.slug}`
                          ? "bg-zinc-800 font-semibold text-white"
                          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      )}
                    >
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-3 space-y-2">
          <a
            href={process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000"}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md px-3 py-2 text-xs text-zinc-500 hover:text-white"
          >
            View live site →
          </a>
          <button
            type="button"
            onClick={() => {
              clearKey();
              router.push("/login");
            }}
            className="w-full rounded-md px-3 py-2 text-left text-xs text-zinc-500 hover:bg-zinc-900 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
          <div>
            {cms && (
              <p className="text-xs text-zinc-500">
                Last updated: {new Date(cms.updatedAt).toLocaleString()}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => save()}
            disabled={saving || !cms}
            className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </header>
        {error && (
          <div className="border-b border-red-900 bg-red-950/50 px-6 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
