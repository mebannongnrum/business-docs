
"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { ImagePlus, Save, Trash2 } from "lucide-react";

import {
  defaultBusinessProfile,
} from "../schemas/business-profile.schema";

import {
  BUSINESS_PROFILE_STORAGE_KEY,
  BUSINESS_PROFILE_UPDATED_EVENT,
  saveBusinessProfile,
} from "../services/business-profile.service";

import type {
  BusinessProfile,
} from "../types/business-profile.types";

import { businessPresets } from "@/features/business-presets/configs/business-presets";

import {
  getBusinessPresetId,
  saveBusinessPresetId,
} from "@/features/business-presets/services/business-preset.service";

import type {
  BusinessPresetId,
} from "@/features/business-presets/types/business-preset.types";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FieldConfig = {
  name: keyof BusinessProfile;
  label: string;
  placeholder?: string;
  type?: string;
};

const businessFields: FieldConfig[] = [
  {
    name: "businessName",
    label: "Business name",
    placeholder: "Your business name",
  },
  {
    name: "ownerName",
    label: "Owner name",
    placeholder: "Full name",
  },
  {
    name: "email",
    label: "Email address",
    placeholder: "business@example.com",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "+91 XXXXX XXXXX",
  },
  {
    name: "alternatePhone",
    label: "Alternate phone",
    placeholder: "Optional",
  },
  {
    name: "website",
    label: "Website",
    placeholder: "https://example.com",
  },
];

const addressFields: FieldConfig[] = [
  {
    name: "address",
    label: "Street address",
    placeholder: "Building, street, area",
  },
  {
    name: "city",
    label: "City",
    placeholder: "City",
  },
  {
    name: "state",
    label: "State",
    placeholder: "State",
  },
  {
    name: "pincode",
    label: "PIN code",
    placeholder: "PIN code",
  },
  {
    name: "country",
    label: "Country",
    placeholder: "India",
  },
];

const taxFields: FieldConfig[] = [
  {
    name: "gstin",
    label: "GSTIN",
    placeholder: "Enter GSTIN",
  },
  {
    name: "pan",
    label: "PAN",
    placeholder: "Enter PAN",
  },
];

const bankFields: FieldConfig[] = [
  {
    name: "bankName",
    label: "Bank name",
    placeholder: "Bank name",
  },
  {
    name: "accountName",
    label: "Account holder name",
    placeholder: "Account holder name",
  },
  {
    name: "accountNumber",
    label: "Account number",
    placeholder: "Account number",
  },
  {
    name: "ifscCode",
    label: "IFSC code",
    placeholder: "IFSC code",
  },
  {
    name: "branch",
    label: "Branch",
    placeholder: "Branch name",
  },
  {
    name: "upiId",
    label: "UPI ID",
    placeholder: "name@bank",
  },
];

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);

  window.addEventListener(
    BUSINESS_PROFILE_UPDATED_EVENT,
    callback
  );

  return () => {
    window.removeEventListener("storage", callback);

    window.removeEventListener(
      BUSINESS_PROFILE_UPDATED_EVENT,
      callback
    );
  };
}

function getSnapshot() {
  return localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function FormField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  onChange: (name: keyof BusinessProfile, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>
        {field.label}
      </Label>

      <Input
        id={field.name}
        type={field.type ?? "text"}
        value={value}
        placeholder={field.placeholder}
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      />
    </div>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-semibold text-foreground">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

export default function BusinessProfileForm() {
  const storedSnapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  let initialProfile: BusinessProfile = {
    ...defaultBusinessProfile,
  };

  if (storedSnapshot) {
    try {
      initialProfile = {
        ...defaultBusinessProfile,
        ...JSON.parse(storedSnapshot),
      };
    } catch {
      initialProfile = {
        ...defaultBusinessProfile,
      };
    }
  }

  return (
    <BusinessProfileEditor
      key={storedSnapshot ?? "new-profile"}
      initialProfile={initialProfile}
    />
  );
}

function BusinessProfileEditor({
  initialProfile,
}: {
  initialProfile: BusinessProfile;
}) {
  const [profile, setProfile] = useState<BusinessProfile>(
    initialProfile
  );

  const [presetId, setPresetId] = useState<BusinessPresetId>(
    () => getBusinessPresetId()
  );

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    name: keyof BusinessProfile,
    value: string
  ) {
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));

    setIsSaved(false);
    setError("");
  }

  function handleLogoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("Please select an image smaller than 1 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("logo", reader.result);
      }
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  }

  function handlePresetChange(value: string) {
    setPresetId(value as BusinessPresetId);
    setIsSaved(false);
    setError("");
  }

  function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      saveBusinessProfile(profile);
      saveBusinessPresetId(presetId);

      setIsSaved(true);
      setError("");
    } catch {
      setIsSaved(false);

      setError(
        "Unable to save your settings. Your browser storage may be full."
      );
    }
  }

  const selectedPreset = businessPresets[presetId];

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Industry preset */}
      <FormSection
        title="Business type"
        description="Choose your industry to get relevant document fields and item columns."
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-preset">
              Industry
            </Label>

            <Select
              value={presetId}
              onValueChange={(value) => {
                if (value) {
                  handlePresetChange(value);
                }
              }}
            >
              <SelectTrigger
                id="business-preset"
                className="h-10 w-full"
              >
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>

              <SelectContent>
                {Object.values(businessPresets).map((preset) => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-muted-foreground">
            {selectedPreset.description}
          </p>

          <div className="grid gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Document fields
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPreset.documentFields.map((field) => (
                  <span
                    key={field.id}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs"
                  >
                    {field.label}
                  </span>
                ))}

                {selectedPreset.documentFields.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No default fields
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Item columns
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPreset.itemColumns.map((column) => (
                  <span
                    key={column.id}
                    className="rounded-md border border-border bg-background px-2.5 py-1 text-xs"
                  >
                    {column.label}
                  </span>
                ))}

                {selectedPreset.itemColumns.length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No default columns
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Changing your industry selection will not delete your
            existing business information or custom document data.
          </p>
        </div>
      </FormSection>

      <FormSection
        title="Business information"
        description="Basic information that identifies your business on documents."
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-muted">
              {profile.logo ? (
                <Image
                  src={profile.logo}
                  alt="Business logo"
                  width={80}
                  height={80}
                  unoptimized
                  className="size-full object-contain"
                />
              ) : (
                <ImagePlus className="size-7 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Business logo
              </p>

              <p className="text-xs text-muted-foreground">
                PNG, JPG or WEBP. Maximum file size: 1 MB.
              </p>

              <div className="flex flex-wrap gap-2">
                <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted">
                  <ImagePlus className="mr-2 size-4" />
                  Upload logo

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>

                {profile.logo && (
                  <button
                    type="button"
                    onClick={() => updateField("logo", "")}
                    className="inline-flex h-9 items-center rounded-lg px-3 text-sm text-destructive transition hover:bg-destructive/10"
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {businessFields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={profile[field.name]}
                onChange={updateField}
              />
            ))}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Business address"
        description="Your registered or primary business address."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {addressFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profile[field.name]}
              onChange={updateField}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Tax information"
        description="Tax identification details displayed on applicable documents."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {taxFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profile[field.name]}
              onChange={updateField}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Payment information"
        description="Bank and UPI details customers can use to make payments."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {bankFields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={profile[field.name]}
              onChange={updateField}
            />
          ))}
        </div>
      </FormSection>

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {isSaved
            ? "Your business profile and industry settings have been saved."
            : "Remember to save your changes."}
        </p>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
        >
          <Save className="mr-2 size-4" />
          Save profile
        </button>
      </div>
    </form>
  );
}
