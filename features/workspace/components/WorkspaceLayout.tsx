
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "./Sidebar";
import Header from "./Header";

const pageDetails = [
  {
    href: "/",
    title: "Dashboard",
    subtitle: "An overview of your document workspace",
  },
  {
    href: "/documents/new",
    title: "Create document",
    subtitle: "Prepare a new business document",
  },
  {
    href: "/documents",
    title: "Documents",
    subtitle: "Create and manage your business documents",
  },
  {
    href: "/templates",
    title: "Templates",
    subtitle: "Choose a design for your documents",
  },
  {
    href: "/business-profile",
    title: "Business Profile",
    subtitle: "Manage your business information and branding",
  },
  {
    href: "/settings",
    title: "Settings",
    subtitle: "Configure your workspace",
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const currentPage =
    pageDetails.find((page) => page.href === pathname) ??
    pageDetails.find(
      (page) =>
        page.href !== "/" && pathname.startsWith(`${page.href}/`)
    ) ??
    pageDetails[0];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onNavigate={() => setIsMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          title={currentPage.title}
          subtitle={currentPage.subtitle}
          onMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
