"use client";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Navbar } from "@/components/navbar";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/login') || 
                    pathname?.startsWith('/register') || 
                    pathname?.startsWith('/forgot-password') ||
                    pathname?.startsWith('/verify-otp') ||
                    pathname?.startsWith('/reset-password');

  if (isAuthPage) {
    return (
      <div className="min-h-screen w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main
        className={clsx(
          "container mx-auto max-w-7xl flex-grow",
          // Responsive padding and width for mobile
          "px-2 sm:px-4 md:px-6 mt-4",
          "w-full",
        )}
      >
        {children}
      </main>
    </div>
  );
}
