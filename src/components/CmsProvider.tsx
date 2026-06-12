"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CmsData } from "@/types/cms";
import { fetchCms, getStoredKey, saveCms } from "@/lib/api";

interface CmsContextValue {
  cms: CmsData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  setCms: (data: CmsData) => void;
  save: () => Promise<void>;
  reload: () => Promise<void>;
}

const CmsContext = createContext<CmsContextValue | null>(null);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [cms, setCms] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const key = getStoredKey();
    if (!key) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCms(key);
      setCms(data);
    } catch {
      setError("Could not load content. Check API URL and admin key.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async () => {
    const key = getStoredKey();
    if (!key || !cms) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await saveCms(key, cms);
      setCms(saved);
    } catch {
      setError("Save failed. Check your admin API key.");
    } finally {
      setSaving(false);
    }
  }, [cms]);

  return (
    <CmsContext.Provider
      value={{ cms, loading, saving, error, setCms, save, reload }}
    >
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within CmsProvider");
  return ctx;
}
