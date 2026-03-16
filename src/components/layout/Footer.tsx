import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-surface">
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold text-foreground">HK Job Placement</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Find your path. Serve with purpose. Connecting devotees with meaningful career opportunities.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">For Candidates</h4>
          <ul className="space-y-2">
            <li><Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Jobs</Link></li>
            <li><Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Register</Link></li>
            <li><Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">For Employers</h4>
          <ul className="space-y-2">
            <li><Link to="/post-job" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Post a Job</Link></li>
          </ul>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Hare Krishna Job Placement. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
