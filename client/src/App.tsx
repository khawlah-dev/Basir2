import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";

// Pages
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { DashboardHome } from "./pages/dashboard/index";
import { SchoolsManager } from "./pages/dashboard/schools";
import { UsersManager } from "./pages/dashboard/users";
import { EvidencesManager } from "./pages/dashboard/evidences";
import { IndicatorsManager } from "./pages/dashboard/indicators";
import { FlagsManager } from "./pages/dashboard/flags";
import { EvaluationsManager } from "./pages/dashboard/evaluations";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />

      {/* Dashboard Routes */}
      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/dashboard/schools" component={SchoolsManager} />
      <Route path="/dashboard/users" component={UsersManager} />
      <Route path="/dashboard/evidences" component={EvidencesManager} />
      <Route path="/dashboard/indicators" component={IndicatorsManager} />
      <Route path="/dashboard/flags" component={FlagsManager} />
      <Route path="/dashboard/evaluations" component={EvaluationsManager} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Ensure the document is RTL for Arabic
  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="basir-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
