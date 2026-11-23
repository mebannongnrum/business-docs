
import type { Metadata } from "next";

import BackupRestoreSettings from "@/features/backup/components/BackupRestoreSettings";

export const metadata: Metadata = {
  title: "Settings | Business Docs",
  description: "Manage your document workspace settings.",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <BackupRestoreSettings />
    </div>
  );
}
