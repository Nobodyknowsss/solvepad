import { Topbar } from "@/components/workspace/Topbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <Topbar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
