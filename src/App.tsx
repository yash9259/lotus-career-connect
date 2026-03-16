import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PostJob from "./pages/PostJob";
import Dashboard from "./pages/Dashboard";
import DashboardJobs from "./pages/dashboard/DashboardJobs";
import DashboardApplications from "./pages/dashboard/DashboardApplications";
import DashboardProfile from "./pages/dashboard/DashboardProfile";
import DashboardEducation from "./pages/dashboard/DashboardEducation";
import DashboardExperience from "./pages/dashboard/DashboardExperience";
import DashboardResume from "./pages/dashboard/DashboardResume";
import DashboardReferences from "./pages/dashboard/DashboardReferences";
import DashboardPayment from "./pages/dashboard/DashboardPayment";
import Admin from "./pages/Admin";
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
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/jobs" element={<DashboardJobs />} />
          <Route path="/dashboard/applications" element={<DashboardApplications />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
          <Route path="/dashboard/education" element={<DashboardEducation />} />
          <Route path="/dashboard/experience" element={<DashboardExperience />} />
          <Route path="/dashboard/resume" element={<DashboardResume />} />
          <Route path="/dashboard/references" element={<DashboardReferences />} />
          <Route path="/dashboard/payment" element={<DashboardPayment />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
