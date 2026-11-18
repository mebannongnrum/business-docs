
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileCheck2,
  FileText,
  Receipt,
  ClipboardList,
  Plus,
  Sparkles,
} from "lucide-react";

const documentTypes = [
  {
    title: "Invoice",
    description: "Create a professional invoice for your customer.",
    icon: Receipt,
    href: "/documents/new?type=invoice",
  },
  {
    title: "Quotation",
    description: "Share pricing and project details before work begins.",
    icon: FileCheck2,
    href: "/documents/new?type=quotation",
  },
  {
    title: "Estimate",
    description: "Provide an estimated cost for products or services.",
    icon: ClipboardList,
    href: "/documents/new?type=estimate",
  },
  {
    title: "Receipt",
    description: "Create a receipt for a payment received.",
    icon: FileText,
    href: "/documents/new?type=receipt",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles size={15} />
            Your document workspace
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Create documents with ease.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Everything you need to create clean, professional business
            documents—all in one place.
          </p>
        </div>

        <Link
          href="/documents/new"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Plus size={17} />
          Create document
        </Link>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-base font-bold text-foreground">
            Start with a document
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the type of document you want to create.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {documentTypes.map((document) => {
            const Icon = document.icon;

            return (
              <Link
                key={document.title}
                href={document.href}
                className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon size={20} strokeWidth={1.8} />
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-muted-foreground/50 transition-all group-hover:translate-x-1 group-hover:text-primary"
                  />
                </div>

                <h4 className="text-sm font-bold text-foreground">
                  {document.title}
                </h4>

                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {document.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid md:grid-cols-[1fr_auto]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
              <Building2 size={20} />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground">
              Set up your business profile
            </h3>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Add your business name, logo, contact information and tax
              details. Your information will automatically appear on
              your documents.
            </p>

            <Link
              href="/business-profile"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Set up business profile
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="hidden w-56 items-center justify-center bg-secondary/40 md:flex">
            <div className="flex size-24 items-center justify-center rounded-2xl border border-primary/10 bg-card shadow-sm">
              <Building2
                size={42}
                strokeWidth={1.2}
                className="text-primary/30"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-primary/25 bg-secondary/20 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
            <Sparkles size={17} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-foreground">
              Make every document yours
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Add your business branding, choose a template and customise
              your documents to suit the way your business works.
            </p>

            <Link
              href="/templates"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Explore templates
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
