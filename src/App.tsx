import { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RequireAdminAuth from "@/components/auth/RequireAdminAuth";
import RequireCandidateAuth from "@/components/auth/RequireCandidateAuth";
import { AuthProvider } from "@/hooks/use-auth";
import Index from "./pages/Index";
import AdminLayout from "./components/layout/AdminLayout";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/layout/ScrollToTop";

const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PostJob = lazy(() => import("./pages/PostJob"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardJobs = lazy(() => import("./pages/dashboard/DashboardJobs"));
const DashboardApplications = lazy(() => import("./pages/dashboard/DashboardApplications"));
const DashboardSavedJobs = lazy(() => import("./pages/dashboard/DashboardSavedJobs"));
const DashboardProfile = lazy(() => import("./pages/dashboard/DashboardProfile"));
const DashboardEducation = lazy(() => import("./pages/dashboard/DashboardEducation"));
const DashboardExperience = lazy(() => import("./pages/dashboard/DashboardExperience"));
const DashboardResume = lazy(() => import("./pages/dashboard/DashboardResume"));
const DashboardReferences = lazy(() => import("./pages/dashboard/DashboardReferences"));
const DashboardPayment = lazy(() => import("./pages/dashboard/DashboardPayment"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const JobManagement = lazy(() => import("./pages/admin/JobManagement"));
const JobReview = lazy(() => import("./pages/admin/JobReview"));
const CandidateManagement = lazy(() => import("./pages/admin/CandidateManagement"));
const CandidateProfile = lazy(() => import("./pages/admin/CandidateProfile"));
const ApplicationsManagement = lazy(() => import("./pages/admin/ApplicationsManagement"));
const PaymentsManagement = lazy(() => import("./pages/admin/PaymentsManagement"));
const NotificationsSystem = lazy(() => import("./pages/admin/NotificationsSystem"));
const SystemSettings = lazy(() => import("./pages/admin/SystemSettings"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary motion-reduce:animate-none" />
    <span className="sr-only">Loading page</span>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MotionConfig reducedMotion="user">
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route element={<RequireCandidateAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/jobs" element={<DashboardJobs />} />
              <Route path="/dashboard/applications" element={<DashboardApplications />} />
              <Route path="/dashboard/saved-jobs" element={<DashboardSavedJobs />} />
              <Route path="/dashboard/profile" element={<DashboardProfile />} />
              <Route path="/dashboard/education" element={<DashboardEducation />} />
              <Route path="/dashboard/experience" element={<DashboardExperience />} />
              <Route path="/dashboard/resume" element={<DashboardResume />} />
              <Route path="/dashboard/references" element={<DashboardReferences />} />
              <Route path="/dashboard/payment" element={<DashboardPayment />} />
            </Route>

            <Route element={<RequireAdminAuth />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="jobs" element={<JobManagement />} />
                <Route path="job-review" element={<JobReview />} />
                <Route path="job-review/:jobId" element={<JobReview />} />
                <Route path="candidates" element={<CandidateManagement />} />
                <Route path="candidates/profile" element={<CandidateProfile />} />
                <Route path="candidates/profile/:candidateId" element={<CandidateProfile />} />
                <Route path="applications" element={<ApplicationsManagement />} />
                <Route path="payments" element={<PaymentsManagement />} />
                <Route path="notifications" element={<NotificationsSystem />} />
                <Route path="settings" element={<SystemSettings />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </MotionConfig>
  </QueryClientProvider>
);

export default App;
