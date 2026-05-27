import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Topbar() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">New problem</span>
      </nav>
      <div className="flex items-center gap-1">
        <ThemeSwitcher />
      </div>
    </header>
  );
}