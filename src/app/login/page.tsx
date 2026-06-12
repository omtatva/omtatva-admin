"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { storeKey, fetchCms, CmsApiError } from "@/lib/api";
import { Input, Field } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await fetchCms(key);
      storeKey(key);
      router.push("/");
    } catch (err) {
      setError(
        err instanceof CmsApiError
          ? err.message
          : "Sign-in failed. Check that the main site is running and your admin key matches ADMIN_API_KEY."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-8"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">
          Om Tatva Digitals
        </p>
        <h1 className="mt-2 text-2xl font-bold text-white">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Enter the <code className="text-zinc-400">ADMIN_API_KEY</code> from the main site{" "}
          <code className="text-zinc-400">.env.local</code>.
        </p>
        <div className="mt-6">
          <Field label="Admin API key">
            <Input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Your secret key"
              required
            />
          </Field>
        </div>
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
