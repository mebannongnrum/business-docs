
export type BusinessPresetId =
  | "general"
  | "retail"
  | "construction"
  | "it-services"
  | "vehicle-services";

export type BusinessPresetField = {
  id: string;
  label: string;
};

export type BusinessPreset = {
  id: BusinessPresetId;
  name: string;
  description: string;
  documentFields: BusinessPresetField[];
  itemColumns: BusinessPresetField[];
};
