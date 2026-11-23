
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FilePlus2,
  LayoutDashboard,
  Palette,
  Settings,
  FileText,
  X,
} from "lucide-react";

type SidebarProps = {
  isMobileOpen: boolean;
  onNavigate: () => void;
};

const navigation = [
  { label: "Studio", href: "/", icon: LayoutDashboard },
  { label: "Create document", href: "/documents/new", icon: FilePlus2 },
  { label: "Templates", href: "/templates", icon: Palette },
];

const settingsNavigation = [
  { label: "Business Profile", href: "/business-profile", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({
  isMobileOpen,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const renderLinks = (
    items: typeof navigation | typeof settingsNavigation
  ) =>
    items.map(({ label, href, icon: Icon }) => {
      const active = isActive(href);

      return (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Icon size={18} strokeWidth={1.8} />
          {label}
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
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-5">
          <Link
            href="/"
            onClick={onNavigate}
            className="flex items-center gap-3"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
          </Link>

          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-7 overflow-y-auto px-3 py-4">
          <section>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Main
            </p>
            <nav className="space-y-1">
              {renderLinks(navigation)}
            </nav>
          </section>

          <section>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Preferences
            </p>
            <nav className="space-y-1">
              {renderLinks(settingsNavigation)}
            </nav>
          </section>
        </div>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Create and manage your business documents.
          </p>
        </div>
      </aside>
    </>
  );
}
