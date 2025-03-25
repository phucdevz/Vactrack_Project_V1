
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Guide from "./pages/Guide";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import Children from "./pages/Children";
import VaccinationHistory from "./pages/VaccinationHistory";
import AdminDashboard from "./pages/AdminDashboard";
import AppointmentsPage from "./pages/admin/AppointmentsPage";
import VaccinesPage from "./pages/admin/VaccinesPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import HelpPage from "./pages/admin/HelpPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/children" element={<Children />} />
            <Route path="/vaccination-history" element={<VaccinationHistory />} />
            <Route path="/admin-vactrack" element={<AdminDashboard />} />
            <Route path="/admin-vactrack/appointments" element={<AppointmentsPage />} />
            <Route path="/admin-vactrack/vaccines" element={<VaccinesPage />} />
            <Route path="/admin-vactrack/reports" element={<ReportsPage />} />
            <Route path="/admin-vactrack/settings" element={<SettingsPage />} />
            <Route path="/admin-vactrack/help" element={<HelpPage />} />
            <Route path="/forgot-password" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
