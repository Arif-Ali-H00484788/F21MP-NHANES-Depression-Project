
"use client";

import { SidebarNav } from "@/components/common/SidebarNav";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppLogo } from "@/components/common/AppLogo";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useRequireAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname(); // Keep pathname for other potential uses if any

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <SidebarNav />
      </div>
      
      {/* Mobile Navigation Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-3 bg-background border-b border-border h-16 shadow-sm">
        <div className="flex items-center gap-3">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarNav isSheetContext={true} closeSheet={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
          {/* Show AppLogo in header only if mobile nav is NOT open */}
          {!mobileNavOpen && <AppLogo size={28} className="[&>span]:text-xl" />}
        </div>
        {/* You can add other header elements here if needed */}
      </div>

      <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Adjust top margin for the new fixed mobile header's height */}
        <div className="mt-16 md:mt-0"> 
          {children}
        </div>
      </main>
    </div>
  );
}
