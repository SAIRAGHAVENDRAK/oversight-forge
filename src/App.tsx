import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CIODashboard from "./pages/CIODashboard";
import RCODashboard from "./pages/RCODashboard";
import ITSODashboard from "./pages/ITSODashboard";
import ApplicationAuditHistory from "./pages/ApplicationAuditHistory";
import Audits from "./pages/Audits";
import Findings from "./pages/Findings";
import FindingDetail from "./pages/FindingDetail";
import Analytics from "./pages/Analytics";
import Ownership from "./pages/Ownership";
import Settings from "./pages/Settings";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import { useUserRole } from "./hooks/useUserRole";

const queryClient = new QueryClient();

function DashboardRouter() {
  const { role } = useUserRole();
  
  if (role === "cio") return <CIODashboard />;
  if (role === "rco") return <RCODashboard />;
  if (role === "itso") return <ITSODashboard />;
  return <Dashboard />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/cio-dashboard" element={<CIODashboard />} />
            <Route path="/rco-dashboard" element={<RCODashboard />} />
            <Route path="/itso-dashboard" element={<ITSODashboard />} />
            <Route path="/itso-dashboard/app/:appName" element={<ApplicationAuditHistory />} />
            <Route path="/audits" element={<Audits />} />
            <Route path="/findings" element={<Findings />} />
            <Route path="/findings/:id" element={<FindingDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/ownership" element={<Ownership />} />
            <Route path="/tasks" element={<Placeholder />} />
            <Route path="/alerts" element={<Placeholder />} />
            <Route path="/reports" element={<Placeholder />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
