
import Link from "next/link";
import { Menu, Plus } from "lucide-react";

type HeaderProps = {
  title: string;
  subtitle: string;
  onMenuClick: () => void;
};

export default function Header({
  title,
  subtitle,
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold tracking-tight text-foreground sm:text-base">
            {title}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      <Link
        href="/documents/new"
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:px-4"
      >
        <Plus size={16} />
        <span>New document</span>
      </Link>
    </header>
  );
}
