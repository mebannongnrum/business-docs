
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileCheck2,
  FileText,
  Receipt,
  ClipboardList,
} from "lucide-react";

const documentTypes = [
  {
    title: "Invoice",
    description: "Request payment for products or services.",
    icon: Receipt,
    href: "/documents/new?type=invoice",
  },
  {
    title: "Quotation",
    description: "Share a price offer with your customer.",
    icon: FileCheck2,
    href: "/documents/new?type=quotation",
  },
  {
    title: "Estimate",
    description: "Provide an estimated project cost.",
    icon: ClipboardList,
    href: "/documents/new?type=estimate",
  },
  {
    title: "Receipt",
    description: "Confirm a payment received.",
    icon: FileText,
    href: "/documents/new?type=receipt",
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          What would you like to create?
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a document to get started.
        </p>
      </section>

      <section>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {documentTypes.map(({ title, description, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/2"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <ArrowRight
                  size={17}
                  className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {title}
              </h3>

              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <h3 className="text-base font-semibold text-foreground">
            Personalise your documents
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Set up your business details and choose your preferred design.
          </p>
        </div>

        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          <Link
            href="/business-profile"
            className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/40 sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Business Profile
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your business name, logo, contact and tax details.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
            />
          </Link>

          <Link
            href="/templates"
            className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/40 sm:p-5"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText size={20} />
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-foreground">
                Document Templates
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose a document design that matches your business.
              </p>
            </div>

            <ArrowRight
              size={18}
              className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
