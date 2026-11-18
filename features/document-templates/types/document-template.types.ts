
export type DocumentTemplateId =
  | "classic"
  | "modern"
  | "elegant";

export type DocumentTemplateStyle =
  | "classic"
  | "modern"
  | "elegant";

export type DocumentTemplate = {
  id: DocumentTemplateId;
  name: string;
  description: string;
  style: DocumentTemplateStyle;
  accentColor: string;
  accentForeground: string;
};
