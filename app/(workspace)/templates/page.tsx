
import TemplateSelector from "@/features/document-templates/components/TemplateSelector";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Templates
        </h1>
        <p className="text-sm text-muted-foreground">
          Choose how your business documents look.
        </p>
      </div>

      <TemplateSelector />
    </div>
  );
}
