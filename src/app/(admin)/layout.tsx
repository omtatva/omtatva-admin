import { CmsProvider } from "@/components/CmsProvider";
import AdminShell from "@/components/AdminShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <CmsProvider>
      <AdminShell>{children}</AdminShell>
    </CmsProvider>
  );
}
