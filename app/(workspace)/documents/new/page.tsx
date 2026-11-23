
import { connection } from "next/server";

import DocumentBuilder from "@/features/documents/components/DocumentBuilder";
import type { DocumentType } from "@/features/documents/types/document.types";

const validTypes: DocumentType[] = [
  "invoice",
  "quotation",
  "estimate",
  "receipt",
];

export default async function NewDocumentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await connection();

  const params = await searchParams;

  const requestedType = params.type;
  const initialType = validTypes.includes(requestedType as DocumentType)
    ? (requestedType as DocumentType)
    : "invoice";

  const initialDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <>
    <DocumentBuilder
        key={`${initialType}-${initialDate}`}
        initialType={initialType}
        initialDate={initialDate}
    />
    </>
  );
}
