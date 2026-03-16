import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  LayoutDashboard, Briefcase, FileText, User, GraduationCap,
  Building2, FileUp, Users, CreditCard,
} from "lucide-react";

const sidebarLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/jobs", label: "Browse Jobs", icon: Briefcase },
  { to: "/dashboard/applications", label: "My Applications", icon: FileText },
  { to: "/dashboard/profile", label: "Personal Details", icon: User },
  { to: "/dashboard/education", label: "Education", icon: GraduationCap },
  { to: "/dashboard/experience", label: "Experience", icon: Building2 },
  { to: "/dashboard/resume", label: "Resume Manager", icon: FileUp },
  { to: "/dashboard/references", label: "References", icon: Users },
  { to: "/dashboard/payment", label: "Premium", icon: CreditCard },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        {/* Sidebar - desktop */}
        <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                AS
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">Arjun Sharma</p>
                <p className="text-xs text-muted-foreground truncate">Software Developer</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border flex justify-around py-2 px-1">
          {sidebarLinks.slice(0, 5).map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-md text-xs transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="truncate max-w-[60px]">{link.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
