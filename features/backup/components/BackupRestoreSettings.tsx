
"use client";

import { useRef, useState } from "react";
import {
  Download,
  Upload,
  ShieldCheck,
  LoaderCircle,
  DatabaseBackup,
} from "lucide-react";

import {
  downloadBackup,
  restoreBackup,
} from "../services/backup.service";

export default function BackupRestoreSettings() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  function handleDownload() {
    try {
      downloadBackup();
      setMessage("Your backup has been downloaded successfully.");
      setMessageType("success");
    } catch {
      setMessage("Could not create the backup. Please try again.");
      setMessageType("error");
    }
  }

  async function handleRestore(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setMessage("");
    setMessageType("");

    const confirmed = window.confirm(
      "Restoring this backup will replace your current business profile, document template and numbering counters. Do you want to continue?"
    );

    if (!confirmed) {
      event.target.value = "";
      return;
    }

    try {
      setIsRestoring(true);

      await restoreBackup(file);

      setMessage(
        "Backup restored successfully. Your workspace settings have been updated."
      );
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not restore the backup."
      );
      setMessageType("error");
    } finally {
      setIsRestoring(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">
          Backup & Restore
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep a copy of your business settings and restore them
          whenever needed.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <DatabaseBackup className="size-5" />
          </div>

          <div>
            <h3 className="font-semibold">
              Workspace backup
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Export your workspace settings into a JSON file.
              Keep this file somewhere safe so you can restore
              your settings if you change devices or reinstall
              the application.
            </p>
          </div>
        </div>

        <div className="my-5 rounded-lg bg-muted/50 p-4">
          <p className="mb-3 text-sm font-medium">
            Included in your backup
          </p>

          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Business profile and logo
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Selected document template
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Invoice, quotation, estimate and receipt numbering
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            <Download className="size-4" />
            Download backup
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isRestoring}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRestoring ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <Upload className="size-4" />
            )}
            {isRestoring ? "Restoring..." : "Restore backup"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleRestore}
          />
        </div>

        {message && (
          <div
            role="status"
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
