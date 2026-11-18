
import {
  defaultBusinessProfile,
} from "../schemas/business-profile.schema";

import type { BusinessProfile } from "../types/business-profile.types";

export const BUSINESS_PROFILE_STORAGE_KEY =
  "business-docs:business-profile";

export const BUSINESS_PROFILE_UPDATED_EVENT =
  "business-profile-updated";

export function getBusinessProfile(): BusinessProfile {
  if (typeof window === "undefined") {
    return { ...defaultBusinessProfile };
  }

  try {
    const storedProfile = localStorage.getItem(
      BUSINESS_PROFILE_STORAGE_KEY
    );

    if (!storedProfile) {
      return { ...defaultBusinessProfile };
    }

    return {
      ...defaultBusinessProfile,
      ...JSON.parse(storedProfile),
    };
  } catch {
    return { ...defaultBusinessProfile };
  }
}

export function saveBusinessProfile(
  profile: BusinessProfile
): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    BUSINESS_PROFILE_STORAGE_KEY,
    JSON.stringify(profile)
  );

  window.dispatchEvent(
    new Event(BUSINESS_PROFILE_UPDATED_EVENT)
  );
}

export function clearBusinessProfile(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(BUSINESS_PROFILE_STORAGE_KEY);

  window.dispatchEvent(
    new Event(BUSINESS_PROFILE_UPDATED_EVENT)
  );
}
