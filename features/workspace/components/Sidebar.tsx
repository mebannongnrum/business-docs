
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Files,
  LayoutDashboard,
  Palette,
  Settings,
  FileText,
} from "lucide-react";

type SidebarProps = {
  isMobileOpen: boolean;
  onNavigate: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Documents",
    href: "/documents",
    icon: Files,
  },
  {
    label: "Templates",
    href: "/templates",
    icon: Palette,
  },
];

const workspaceNavigation = [
  {
    label: "Business Profile",
    href: "/business-profile",
    icon: Building2,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar({
  isMobileOpen,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const renderNavigation = (items: typeof navigation) =>
    items.map(({ label, href, icon: Icon }) => {
      const active = isActive(href);

      return (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon size={18} strokeWidth={1.8} />
          <span>{label}</span>
        </Link>
      );
    });

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onNavigate}
          className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <FileText size={19} />
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight text-foreground">
              Business Docs
            </p>
            <p className="text-xs text-muted-foreground">
              Document workspace
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-3 py-4">
          <section>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </p>

            <nav className="space-y-1">{renderNavigation(navigation)}</nav>
          </section>

          <section>
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Configuration
            </p>

            <nav className="space-y-1">
              {renderNavigation(workspaceNavigation)}
            </nav>
          </section>
        </div>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-xl border border-border/70 bg-muted/70 p-3">
            <p className="text-sm font-semibold text-foreground">
              Your workspace
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Create professional business documents in one place.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
