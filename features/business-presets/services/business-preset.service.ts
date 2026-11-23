
import { businessPresets } from "../configs/business-presets";

import type {
  BusinessPresetId,
} from "../types/business-preset.types";

export const BUSINESS_PRESET_STORAGE_KEY =
  "business-docs:business-preset";

export const BUSINESS_PRESET_UPDATED_EVENT =
  "business-preset-updated";

export function getBusinessPresetId(): BusinessPresetId {
  if (typeof window === "undefined") {
    return "general";
  }

  try {
    const stored = localStorage.getItem(
      BUSINESS_PRESET_STORAGE_KEY
    );

    if (
      stored &&
      Object.prototype.hasOwnProperty.call(
        businessPresets,
        stored
      )
    ) {
      return stored as BusinessPresetId;
    }
  } catch {
    // Fall back to the general preset if storage is unavailable.
  }

  return "general";
}

export function saveBusinessPresetId(
  presetId: BusinessPresetId
): void {
  if (
    !Object.prototype.hasOwnProperty.call(
      businessPresets,
      presetId
    )
  ) {
    return;
  }

  localStorage.setItem(
    BUSINESS_PRESET_STORAGE_KEY,
    presetId
  );

  window.dispatchEvent(
    new Event(BUSINESS_PRESET_UPDATED_EVENT)
  );
}
