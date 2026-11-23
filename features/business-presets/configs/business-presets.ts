
import type {
  BusinessPreset,
  BusinessPresetId,
} from "../types/business-preset.types";

export const businessPresets: Record<
  BusinessPresetId,
  BusinessPreset
> = {
  general: {
    id: "general",
    name: "General Business",
    description: "For everyday products and services.",
    documentFields: [
      { id: "po-number", label: "PO Number" },
      { id: "project-name", label: "Project Name" },
    ],
    itemColumns: [
      { id: "sku", label: "SKU" },
      { id: "hsn-sac", label: "HSN/SAC" },
    ],
  },

  retail: {
    id: "retail",
    name: "Retail",
    description: "For shops and product-based businesses.",
    documentFields: [
      { id: "order-number", label: "Order Number" },
    ],
    itemColumns: [
      { id: "sku", label: "SKU" },
      { id: "hsn-sac", label: "HSN/SAC" },
    ],
  },

  construction: {
    id: "construction",
    name: "Construction",
    description: "For contractors and construction businesses.",
    documentFields: [
      { id: "project-name", label: "Project Name" },
      { id: "site-address", label: "Site Address" },
    ],
    itemColumns: [
      { id: "hsn-sac", label: "HSN/SAC" },
      { id: "work-unit", label: "Work Unit" },
    ],
  },

  "it-services": {
    id: "it-services",
    name: "IT & Software Services",
    description: "For software developers and IT service providers.",
    documentFields: [
      { id: "project-name", label: "Project Name" },
      { id: "contract-id", label: "Contract ID" },
    ],
    itemColumns: [
      { id: "service-code", label: "Service Code" },
      { id: "sac", label: "SAC" },
    ],
  },

  "vehicle-services": {
    id: "vehicle-services",
    name: "Vehicle Services",
    description: "For garages, workshops and vehicle repair businesses.",
    documentFields: [
      { id: "vehicle-number", label: "Vehicle Number" },
      { id: "job-card-number", label: "Job Card Number" },
    ],
    itemColumns: [
      { id: "service-code", label: "Service Code" },
      { id: "labour-hours", label: "Labour Hours" },
    ],
  },
};
