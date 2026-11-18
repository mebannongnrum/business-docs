
import type {
  DocumentTemplate,
  DocumentTemplateId,
} from "../types/document-template.types";

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean, timeless and professional.",
    style: "classic",
    accentColor: "#334155",
    accentForeground: "#FFFFFF",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary styling with a bold accent.",
    style: "modern",
    accentColor: "#3346A8",
    accentForeground: "#FFFFFF",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined typography with a premium feel.",
    style: "elegant",
    accentColor: "#856448",
    accentForeground: "#FFFFFF",
  },
];

export const DEFAULT_DOCUMENT_TEMPLATE: DocumentTemplateId =
  "classic";

export function getDocumentTemplate(
  id: DocumentTemplateId
): DocumentTemplate {
  return (
    documentTemplates.find((template) => template.id === id) ??
    documentTemplates[0]
  );
}
