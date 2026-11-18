
import TemplateSelector from "@/features/document-templates/components/TemplateSelector";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Document templates
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a design for your invoices, quotations, estimates and receipts.
        </p>
      </div>

      <TemplateSelector />
    </div>
  );
}
