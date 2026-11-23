
// import { Menu } from "lucide-react";

// type HeaderProps = {
//   title: string;
//   subtitle: string;
//   onMenuClick: () => void;
// };

// export default function Header({
//   title,
//   subtitle,
//   onMenuClick,
// }: HeaderProps) {
//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center bg-background/95 px-4 backdrop-blur sm:px-6 py-4 lg:px-8">
//       <div className="flex min-w-0 items-center gap-3">
//         <button
//           type="button"
//           onClick={onMenuClick}
//           aria-label="Open navigation"
//           className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
//         >
//           <Menu size={20} />
//         </button>

//         <div className="min-w-0">
//           <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
//             {title}
//           </h1>

//           <p className="hidden truncate text-xs text-muted-foreground sm:block">
//             {subtitle}
//           </p>
//         </div>
//       </div>
//     </header>
//   );
// }


import Image from "next/image";
import { Building2, Menu } from "lucide-react";

type HeaderProps = {
  businessName: string;
  logo: string;
  onMenuClick: () => void;
};

export default function Header({
  businessName,
  logo,
  onMenuClick,
}: HeaderProps) {
  return (
   <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Business identity */}
      <div className="ml-auto flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white">
          {logo ? (
            <Image
              src={logo}
              alt={`${businessName || "Business"} logo`}
              width={36}
              height={36}
              unoptimized
              className="size-full object-contain"
            />
          ) : (
            <Building2
              size={19}
              className="text-muted-foreground"
              strokeWidth={1.8}
            />
          )}
        </div>

        <span className="max-w-[180] truncate text-sm font-semibold text-foreground sm:max-w-[260]">
          {businessName || "Your Business"}
        </span>
      </div>
    </header>
  );
}
