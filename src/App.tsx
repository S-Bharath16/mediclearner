
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DiabetesPrediction from "./pages/DiabetesPrediction";
import HeartDiseasePrediction from "./pages/HeartDiseasePrediction";
import LungCancerPrediction from "./pages/LungCancerPrediction";
import StrokeRiskPrediction from "./pages/StrokeRiskPrediction";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diabetes" element={<DiabetesPrediction />} />
          <Route path="/heart" element={<HeartDiseasePrediction />} />
          <Route path="/lung" element={<LungCancerPrediction />} />
          <Route path="/stroke" element={<StrokeRiskPrediction />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
