import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { AIAssistant } from "../chat/ai-assistant";

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={style}>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar />
        
        <div className="flex flex-col flex-1 w-full overflow-hidden">
          <header className="h-16 flex items-center justify-between px-6 bg-background border-b z-10 sticky top-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-primary transition-colors" />
              <h1 className="font-display font-semibold text-lg text-foreground hidden sm:block">
                مرحباً بك، {user.name}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                {user.role === 'admin' ? 'مدير نظام' : user.role === 'principal' ? 'قائد مدرسة' : 'معلم'}
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Show AI Assistant only for teachers */}
      {user.role === 'teacher' && <AIAssistant />}
    </SidebarProvider>
  );
}
