
// "use client";

// import { useState } from "react";
// import { usePathname } from "next/navigation";

// import Sidebar from "./Sidebar";
// import Header from "./Header";

// const pageDetails = [
//   {
//     href: "/",
//     title: "Dashboard",
//     subtitle: "Your business document workspace",
//   },
//   {
//     href: "/documents/new",
//     title: "Create document",
//     subtitle: "Prepare a new business document",
//   },
//   {
//     href: "/documents",
//     title: "Documents",
//     subtitle: "Create and manage your documents",
//   },
//   {
//     href: "/templates",
//     title: "Templates",
//     subtitle: "Choose how your documents look",
//   },
//   {
//     href: "/business-profile",
//     title: "Business Profile",
//     subtitle: "Manage your business information",
//   },
//   {
//     href: "/settings",
//     title: "Settings",
//     subtitle: "Manage your workspace preferences",
//   },
// ];

// export default function WorkspaceLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [isMobileOpen, setIsMobileOpen] = useState(false);
//   const pathname = usePathname();

//   const currentPage =
//     pageDetails.find((page) => page.href === pathname) ??
//     pageDetails.find(
//       (page) =>
//         page.href !== "/" && pathname.startsWith(`${page.href}/`)
//     ) ??
//     pageDetails[0];

//   const closeMobileSidebar = () => setIsMobileOpen(false);

//   return (
//     <div className="min-h-screen bg-background">
//       <Sidebar
//         isMobileOpen={isMobileOpen}
//         onNavigate={closeMobileSidebar}
//       />

//       <div className="min-h-screen lg:pl-64">
//         <Header
//           title={currentPage.title}
//           subtitle={currentPage.subtitle}
//           onMenuClick={() => setIsMobileOpen(true)}
//         />

//         <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useSyncExternalStore } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

import {
  BUSINESS_PROFILE_STORAGE_KEY,
  BUSINESS_PROFILE_UPDATED_EVENT,
} from "@/features/business-profile/services/business-profile.service";

import { defaultBusinessProfile } from "@/features/business-profile/schemas/business-profile.schema";

import type { BusinessProfile } from "@/features/business-profile/types/business-profile.types";

function subscribeToBusinessProfile(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(BUSINESS_PROFILE_UPDATED_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(BUSINESS_PROFILE_UPDATED_EVENT, callback);
  };
}

function getBusinessProfileSnapshot() {
  return localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const storedProfile = useSyncExternalStore(
    subscribeToBusinessProfile,
    getBusinessProfileSnapshot,
    getServerSnapshot
  );

  let businessProfile: BusinessProfile = {
    ...defaultBusinessProfile,
  };

  if (storedProfile) {
    try {
      businessProfile = {
        ...defaultBusinessProfile,
        ...JSON.parse(storedProfile),
      };
    } catch {
      // Fall back to the default business profile.
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onNavigate={() => setIsMobileOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Header
          businessName={businessProfile.businessName}
          logo={businessProfile.logo}
          onMenuClick={() => setIsMobileOpen(true)}
        />

        <main className="mx-auto w-full max-w-screen-2xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
