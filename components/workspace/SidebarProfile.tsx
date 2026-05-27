import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export async function SidebarProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims as { email?: string } | null | undefined;
  const email = claims?.email ?? null;

  if (!email) {
    return (
      <div className="flex flex-col gap-2">
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
          {email.slice(0, 1).toUpperCase()}
        </div>
        <span className="truncate text-sm text-muted-foreground">{email}</span>
      </div>
      <LogoutButton />
    </div>
  );
}