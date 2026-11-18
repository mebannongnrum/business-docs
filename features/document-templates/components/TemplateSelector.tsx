
"use client";

import { useSyncExternalStore } from "react";
import { Check, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { documentTemplates } from "../config/document-templates";
import {
  DOCUMENT_TEMPLATE_STORAGE_KEY,
  DOCUMENT_TEMPLATE_UPDATED_EVENT,
  getSelectedDocumentTemplate,
  saveSelectedDocumentTemplate,
} from "../services/document-template.service";

import type {
  DocumentTemplate,
  DocumentTemplateId,
} from "../types/document-template.types";

function subscribeToTemplateChanges(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(DOCUMENT_TEMPLATE_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(DOCUMENT_TEMPLATE_UPDATED_EVENT, callback);
  };
}

function getTemplateSnapshot() {
  return localStorage.getItem(DOCUMENT_TEMPLATE_STORAGE_KEY);
}

function getServerTemplateSnapshot() {
  return null;
}

function TemplatePreview({
  template,
}: {
  template: DocumentTemplate;
}) {
  const isModern = template.style === "modern";
  const isElegant = template.style === "elegant";

  return (
    <div className="overflow-hidden rounded-lg border bg-white p-3 shadow-sm">
      <div className="mx-auto min-h-[220] max-w-[260] bg-white p-3 text-slate-800">
        <div
          className={`flex items-start justify-between ${
            isModern ? "border-b-4 pb-3" : "border-b pb-3"
          }`}
          style={{
            borderColor: template.accentColor,
          }}
        >
          <div>
            <div
              className={`text-[10px] font-bold tracking-wide ${
                isElegant ? "font-serif tracking-widest" : ""
              }`}
            >
              YOUR BUSINESS
            </div>
            <div className="mt-1 text-[6px] text-slate-400">
              Business address and contact details
            </div>
          </div>

          <div
            className="text-right text-[13px] font-bold"
            style={{ color: template.accentColor }}
          >
            INVOICE
            <div className="mt-1 text-[6px] font-normal text-slate-400">
              INV-0001
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          <div>
            <div className="text-[6px] font-semibold text-slate-400">
              BILL TO
            </div>
            <div className="mt-1 text-[8px] font-semibold">
              Customer Name
            </div>
            <div className="mt-1 text-[6px] text-slate-400">
              Customer address
            </div>
          </div>

          <div className="text-right">
            <div className="text-[6px] text-slate-400">DATE</div>
            <div className="mt-1 text-[7px] font-medium">18 Nov 2026</div>
          </div>
        </div>

        <div className="mt-5">
          <div
            className="grid grid-cols-4 gap-1 px-2 py-2 text-[6px] font-semibold text-white"
            style={{ backgroundColor: template.accentColor }}
          >
            <span className="col-span-2">DESCRIPTION</span>
            <span className="text-right">QTY</span>
            <span className="text-right">AMOUNT</span>
          </div>

          {["Product or service", "Product or service", "Product or service"].map(
            (item, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-1 border-b border-slate-100 px-2 py-2 text-[6px]"
              >
                <span className="col-span-2">{item}</span>
                <span className="text-right">1</span>
                <span className="text-right">₹1,000</span>
              </div>
            )
          )}
        </div>

        <div className="mt-3 ml-auto w-1/2 space-y-1">
          <div className="flex justify-between text-[6px] text-slate-400">
            <span>Subtotal</span>
            <span>₹3,000</span>
          </div>
          <div className="flex justify-between text-[6px] text-slate-400">
            <span>Tax</span>
            <span>₹540</span>
          </div>
          <div
            className="flex justify-between border-t pt-2 text-[8px] font-bold"
            style={{ borderColor: template.accentColor }}
          >
            <span>Total</span>
            <span>₹3,540</span>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-2">
          <div className="text-[6px] font-semibold">Thank you for your business!</div>
          <div className="mt-1 text-[5px] text-slate-400">
            Payment terms and additional notes
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateSelector() {
  const storedTemplate = useSyncExternalStore(
    subscribeToTemplateChanges,
    getTemplateSnapshot,
    getServerTemplateSnapshot
  );

  const selectedTemplate: DocumentTemplateId =
    storedTemplate === "modern" || storedTemplate === "elegant"
      ? storedTemplate
      : "classic";

  function handleSelect(templateId: DocumentTemplateId) {
    saveSelectedDocumentTemplate(templateId);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {documentTemplates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`overflow-hidden rounded-xl border bg-card transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary/15"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <div className="p-3">
                <TemplatePreview template={template} />
              </div>

              <div className="space-y-3 border-t p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>

                  {isSelected && (
                    <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  )}
                </div>

                <Button
                  type="button"
                  variant={isSelected ? "secondary" : "outline"}
                  className="w-full"
                  disabled={isSelected}
                  onClick={() => handleSelect(template.id)}
                >
                  {isSelected ? (
                    <>
                      <Check className="size-4" />
                      Selected
                    </>
                  ) : (
                    "Use this template"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground">
        Your selection will be used as the default design for new documents.
        You can change it anytime.
      </p>
    </div>
  );
}
