import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import VirtualPhotoshoot from "./pages/studio/VirtualPhotoshoot";
import VirtualModels from "./pages/studio/VirtualModels";
import UGCStyle from "./pages/studio/UGCStyle";
import TemplateBase from "./pages/templates/TemplateBase";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/virtual-photoshoot" element={<VirtualPhotoshoot />} />
          <Route path="/dashboard/virtual-models" element={<VirtualModels />} />
          <Route path="/dashboard/ugc-style" element={<UGCStyle />} />
          <Route path="/template/:templateId" element={<TemplateBase />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
