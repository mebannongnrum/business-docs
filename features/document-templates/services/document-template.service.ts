
import {
  DEFAULT_DOCUMENT_TEMPLATE,
} from "../config/document-templates";

import type {
  DocumentTemplateId,
} from "../types/document-template.types";

export const DOCUMENT_TEMPLATE_STORAGE_KEY =
  "business-docs:document-template";

export const DOCUMENT_TEMPLATE_UPDATED_EVENT =
  "document-template-updated";

const validTemplateIds: DocumentTemplateId[] = [
  "classic",
  "modern",
  "elegant",
];

export function getSelectedDocumentTemplate(): DocumentTemplateId {
  if (typeof window === "undefined") {
    return DEFAULT_DOCUMENT_TEMPLATE;
  }

  try {
    const storedTemplate = localStorage.getItem(
      DOCUMENT_TEMPLATE_STORAGE_KEY
    );

    if (
      storedTemplate &&
      validTemplateIds.includes(storedTemplate as DocumentTemplateId)
    ) {
      return storedTemplate as DocumentTemplateId;
    }

    return DEFAULT_DOCUMENT_TEMPLATE;
  } catch {
    return DEFAULT_DOCUMENT_TEMPLATE;
  }
}

export function saveSelectedDocumentTemplate(
  templateId: DocumentTemplateId
): void {
  if (typeof window === "undefined") return;

  if (!validTemplateIds.includes(templateId)) return;

  localStorage.setItem(
    DOCUMENT_TEMPLATE_STORAGE_KEY,
    templateId
  );

  window.dispatchEvent(
    new Event(DOCUMENT_TEMPLATE_UPDATED_EVENT)
  );
}

export function clearSelectedDocumentTemplate(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(DOCUMENT_TEMPLATE_STORAGE_KEY);

  window.dispatchEvent(
    new Event(DOCUMENT_TEMPLATE_UPDATED_EVENT)
  );
}
