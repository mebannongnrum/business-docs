
import type { BusinessProfile } from "@/features/business-profile/types/business-profile.types";
import type { DocumentTemplateId } from "@/features/document-templates/types/document-template.types";
import type { DocumentType } from "@/features/documents/types/document.types";
import type { BusinessPresetId } from "@/features/business-presets/types/business-preset.types";

export type DocumentCounters = Record<DocumentType, number>;

export type BusinessDocsBackup = {
  app: "business-docs";
  version: 1;
  exportedAt: string;
  data: {
    businessProfile: BusinessProfile;
    documentTemplate: DocumentTemplateId;
    documentCounters: DocumentCounters;
    businessPreset?: BusinessPresetId;
  };
};
