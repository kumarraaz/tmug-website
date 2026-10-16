import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminPage } from "@/server/auth";
import { AdminLogo } from "../_components/AdminLogo";
import { AdminNav, LogoutButton } from "../_components/AdminNav";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Every page ALSO re-checks the session (layouts are not re-rendered on client navigation).
  await requireAdminPage();

  return (
    <div className="min-h-dvh bg-warm-ivory text-charcoal lg:flex">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-charcoal/10 bg-white p-4 lg:flex">
        <Link href="/admin" className="mb-5 flex items-center gap-3 px-1">
          <AdminLogo priority />
          <span className="rounded-full bg-tea-gold px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-deep-plum">Admin</span>
        </Link>
        <AdminNav orientation="vertical" />
        <div className="mt-auto space-y-1 border-t border-charcoal/10 pt-3 text-sm">
          <Link href="/" target="_blank" className="block rounded-xl px-3 py-2 font-bold text-charcoal/70 hover:bg-warm-surface">
            View store ↗
          </Link>
          <LogoutButton className="w-full rounded-xl px-3 py-2 text-left font-bold text-berry hover:bg-berry/10 cursor-pointer" />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-white/95 px-3 py-2 backdrop-blur lg:hidden">
          <div className="mb-2 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <AdminLogo heightClass="h-5" />
              <span className="rounded-full bg-tea-gold px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-deep-plum">Admin</span>
            </Link>
            <div className="flex items-center gap-3 text-xs font-bold">
              <Link href="/" target="_blank" className="text-charcoal/70">
                Store ↗
              </Link>
              <LogoutButton className="text-berry cursor-pointer" />
            </div>
          </div>
          <AdminNav orientation="horizontal" />
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
