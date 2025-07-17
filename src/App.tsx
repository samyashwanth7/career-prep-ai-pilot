
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import MyProgress from "./pages/MyProgress";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Jobs from "./pages/Jobs";
import Interview from "./pages/Interview";
import Analytics from "./pages/Analytics";
import CareerRoadmap from "./pages/CareerRoadmap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CompanyPractice from "./pages/CompanyPractice";
import BulkApplications from "./pages/BulkApplications";
import CVBuilder from "./pages/CVBuilder";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route path="/my-progress" element={<ProtectedRoute><MyProgress /></ProtectedRoute>} />
            
            {/* Protected pages */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/demo"
              element={
                <ProtectedRoute>
                  <Layout><Demo /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cv-builder"
              element={
                <ProtectedRoute>
                  <Layout><CVBuilder /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Layout><Jobs /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Layout><Interview /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <Layout><Analytics /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/career-roadmap"
              element={
                <ProtectedRoute>
                  <Layout><CareerRoadmap /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/resume-analyzer"
              element={
                <ProtectedRoute>
                  <Layout><ResumeAnalyzer /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-practice"
              element={
                <ProtectedRoute>
                  <Layout><CompanyPractice /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bulk-applications"
              element={
                <ProtectedRoute>
                  <Layout><BulkApplications /></Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
