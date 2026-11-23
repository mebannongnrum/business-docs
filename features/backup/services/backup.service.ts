
import {
  BUSINESS_PROFILE_STORAGE_KEY,
  BUSINESS_PROFILE_UPDATED_EVENT,
} from "@/features/business-profile/services/business-profile.service";

import {
  defaultBusinessProfile,
} from "@/features/business-profile/schemas/business-profile.schema";

import {
  DOCUMENT_TEMPLATE_STORAGE_KEY,
  DOCUMENT_TEMPLATE_UPDATED_EVENT,
} from "@/features/document-templates/services/document-template.service";

import {
  DOCUMENT_COUNTERS_STORAGE_KEY,
  getDocumentCounters,
} from "@/features/documents/services/document-number.service";

import {
  BUSINESS_PRESET_STORAGE_KEY,
  getBusinessPresetId,
} from "@/features/business-presets/services/business-preset.service";

import type {
  BusinessPresetId,
} from "@/features/business-presets/types/business-preset.types";

import type {
  BusinessDocsBackup,
  DocumentCounters,
} from "../types/backup.types";

const BACKUP_VERSION = 1;
const MAX_BACKUP_SIZE = 10 * 1024 * 1024;

const validTemplateIds = [
  "classic",
  "modern",
  "elegant",
] as const;

const validBusinessPresetIds: BusinessPresetId[] = [
  "general",
  "retail",
  "construction",
  "it-services",
  "vehicle-services",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function validateProfile(value: unknown): boolean {
  if (!isRecord(value)) return false;

  return Object.keys(defaultBusinessProfile).every((key) => {
    const field = value[key];

    if (typeof field !== "string") return false;

    return field.length <= (key === "logo" ? 8_000_000 : 10_000);
  });
}

function validateCounters(
  value: unknown
): value is DocumentCounters {
  if (!isRecord(value)) return false;

  const types = [
    "invoice",
    "quotation",
    "estimate",
    "receipt",
  ];

  return types.every((type) => {
    const counter = value[type];

    return (
      typeof counter === "number" &&
      Number.isSafeInteger(counter) &&
      counter >= 1
    );
  });
}

function validateBackup(
  value: unknown
): value is BusinessDocsBackup {
  if (!isRecord(value) || !isRecord(value.data)) {
    return false;
  }

  const businessPreset = value.data.businessPreset;

  const validBusinessPreset =
    businessPreset === undefined ||
    (
      typeof businessPreset === "string" &&
      validBusinessPresetIds.includes(
        businessPreset as BusinessPresetId
      )
    );

  return (
    value.app === "business-docs" &&
    value.version === BACKUP_VERSION &&
    typeof value.exportedAt === "string" &&
    !Number.isNaN(Date.parse(value.exportedAt)) &&
    validateProfile(value.data.businessProfile) &&
    typeof value.data.documentTemplate === "string" &&
    validTemplateIds.includes(
      value.data.documentTemplate as typeof validTemplateIds[number]
    ) &&
    validateCounters(value.data.documentCounters) &&
    validBusinessPreset
  );
}

export function downloadBackup(): void {
  if (typeof window === "undefined") return;

  const backup: BusinessDocsBackup = {
    app: "business-docs",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      businessProfile: JSON.parse(
        localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY) ??
          JSON.stringify(defaultBusinessProfile)
      ),
      documentTemplate:
        (localStorage.getItem(DOCUMENT_TEMPLATE_STORAGE_KEY) as
          BusinessDocsBackup["data"]["documentTemplate"]) ??
        "classic",
      documentCounters: getDocumentCounters(),
      businessPreset: getBusinessPresetId(),
    },
  };

  const blob = new Blob(
    [JSON.stringify(backup, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const link = window.document.createElement("a");

  link.href = url;
  link.download = `business-docs-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  window.document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

export async function restoreBackup(file: File): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("Backup restoration is only available in the browser.");
  }

  if (file.size > MAX_BACKUP_SIZE) {
    throw new Error("Backup file is too large. Maximum size is 10 MB.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }

  if (!validateBackup(parsed)) {
    throw new Error(
      "Invalid backup file. Please select a valid Business Docs backup."
    );
  }

  const {
    businessProfile,
    documentTemplate,
    documentCounters,
    businessPreset,
  } = parsed.data;

  const storageKeys = [
    BUSINESS_PROFILE_STORAGE_KEY,
    DOCUMENT_TEMPLATE_STORAGE_KEY,
    DOCUMENT_COUNTERS_STORAGE_KEY,
    BUSINESS_PRESET_STORAGE_KEY,
  ];

  const previousValues = storageKeys.map((key) =>
    localStorage.getItem(key)
  );

  try {
    localStorage.setItem(
      BUSINESS_PROFILE_STORAGE_KEY,
      JSON.stringify(businessProfile)
    );

    localStorage.setItem(
      DOCUMENT_TEMPLATE_STORAGE_KEY,
      documentTemplate
    );

    localStorage.setItem(
      DOCUMENT_COUNTERS_STORAGE_KEY,
      JSON.stringify(documentCounters)
    );

    // Older backups without an industry preset default to General Business.
    localStorage.setItem(
      BUSINESS_PRESET_STORAGE_KEY,
      businessPreset ?? "general"
    );
  } catch {
    storageKeys.forEach((key, index) => {
      const previousValue = previousValues[index];

      if (previousValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, previousValue);
      }
    });

    throw new Error(
      "Could not restore the backup. Your previous settings have been preserved."
    );
  }

  window.dispatchEvent(
    new Event(BUSINESS_PROFILE_UPDATED_EVENT)
  );

  window.dispatchEvent(
    new Event(DOCUMENT_TEMPLATE_UPDATED_EVENT)
  );

  window.dispatchEvent(
    new Event("storage")
  );
}
