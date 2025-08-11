
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/common/AppLogo";
import { ROUTES } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LucideIcon } from "lucide-react";
import { LayoutDashboard, BookOpen, ListChecks, Bot, LogOut, UserCircle2, LifeBuoy, ShieldCheck, BriefcaseMedical } from "lucide-react";
import { supabase } from "@/config/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

const mainNavItems: NavItem[] = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.JOURNAL, label: "Daily Journal", icon: BookOpen },
  { href: ROUTES.TRACKER, label: "Lifestyle Tracker", icon: ListChecks },
  { href: ROUTES.PHQ9, label: "PHQ-9 Chatbot", icon: Bot },
];

const resourcesNavItems: NavItem[] = [
  { href: ROUTES.RESOURCES_WELLBEING_GUIDE, label: "Wellbeing Guide", icon: ShieldCheck }, 
  { href: ROUTES.RESOURCES_MENTAL_HEALTH_SUPPORT, label: "Mental Health Support", icon: LifeBuoy },
  { href: ROUTES.RESOURCES_CONNECT_PROFESSIONALS, label: "Connect with Doctors", icon: BriefcaseMedical },
];

const navSections: NavSection[] = [
  { items: mainNavItems },
  { title: "Mental Health Resources", items: resourcesNavItems },
];

interface SidebarNavProps {
  isSheetContext?: boolean;
  closeSheet?: () => void;
}

export function SidebarNav({ isSheetContext = false, closeSheet }: SidebarNavProps) {
  const pathname = usePathname();
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      closeSheet?.();
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch (error: any) {
      console.error("Logout error", error);
      toast({ variant: "destructive", title: "Logout Failed", description: error.message || "Could not log you out. Please try again." });
    }
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "No email";

  return (
    <aside
      className={cn(
        "bg-card text-card-foreground flex flex-col",
        isSheetContext
          ? "h-full w-full"
          : "fixed left-0 top-0 z-40 h-screen w-64 border-r border-border transition-transform md:translate-x-0 -translate-x-full"
      )}
    >
      <div className="p-4 border-b border-border">
        <Link href={ROUTES.DASHBOARD} onClick={() => closeSheet?.()}>
          <AppLogo />
        </Link>
      </div>

      <ScrollArea className="flex-1">
        <nav className="p-4 pt-2 space-y-1">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={section.title ? "mt-4 pt-4 border-t border-border/60 first:mt-0 first:pt-0 first:border-t-0" : ""}>
              {section.title && (
                <h2 className="px-2 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </h2>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-base h-10 sm:h-11", 
                      pathname === item.href ? "font-semibold" : "font-normal"
                    )}
                    asChild
                  >
                    <Link href={item.href} onClick={() => closeSheet?.()}>
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {user && (
            <Link href={ROUTES.PROFILE} onClick={() => closeSheet?.()} className="block rounded-md hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <div className="flex items-center gap-3 p-2 rounded-md border border-input bg-background/50 transition-colors hover:border-primary">
                <UserCircle2 className="h-10 w-10 text-muted-foreground flex-shrink-0" />
                <div className="flex flex-col overflow-hidden min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate" title={userName}>{userName}</span>
                  <span className="text-xs text-muted-foreground truncate" title={userEmail}>{userEmail}</span>
                </div>
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-base text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-10 sm:h-11"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
