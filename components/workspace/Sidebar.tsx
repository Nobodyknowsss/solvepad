import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { SidebarProfile } from "./SidebarProfile";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="flex h-14 items-center gap-2 px-5">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground">
          S
        </div>
        <span className="text-sm font-semibold tracking-tight">solvepad</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        <Link
          href="/workspace"
          className="flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground"
        >
          <Plus className="size-4 text-red-700 dark:text-red-400" />
          New problem
        </Link>
      </nav>

      <div className="border-t border-border p-3">
        <Suspense
          fallback={<div className="h-9 animate-pulse rounded-md bg-muted" />}
        >
          <SidebarProfile />
        </Suspense>
      </div>
    </aside>
  );
}