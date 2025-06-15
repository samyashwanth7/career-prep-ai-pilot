
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Demo from "./pages/Demo";
import Jobs from "./pages/Jobs";
import Interview from "./pages/Interview";
import Analytics from "./pages/Analytics";
import CareerRoadmap from "./pages/CareerRoadmap";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import CompanyPractice from "./pages/CompanyPractice";
import BulkApplications from "./pages/BulkApplications";
import NotFound from "./pages/NotFound";
import Layout from "@/components/layout/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Index />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* Pages after login use the professional Layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/demo"
            element={
              <Layout>
                <Demo />
              </Layout>
            }
          />
          <Route
            path="/jobs"
            element={
              <Layout>
                <Jobs />
              </Layout>
            }
          />
          <Route
            path="/interview"
            element={
              <Layout>
                <Interview />
              </Layout>
            }
          />
          <Route
            path="/analytics"
            element={
              <Layout>
                <Analytics />
              </Layout>
            }
          />
          <Route
            path="/career-roadmap"
            element={
              <Layout>
                <CareerRoadmap />
              </Layout>
            }
          />
          <Route
            path="/resume-analyzer"
            element={
              <Layout>
                <ResumeAnalyzer />
              </Layout>
            }
          />
          <Route
            path="/company-practice"
            element={
              <Layout>
                <CompanyPractice />
              </Layout>
            }
          />
          <Route
            path="/bulk-applications"
            element={
              <Layout>
                <BulkApplications />
              </Layout>
            }
          />
          {/* ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
