import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Briefcase, Users, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import { mockJobs } from "@/lib/mockData";
import { toast } from "sonner";

const stats = [
  { label: "Active Jobs", value: "1,248", icon: Briefcase },
  { label: "Candidates", value: "3,420", icon: Users },
  { label: "Companies", value: "186", icon: Building2 },
];

const Index = () => {
  const approvedJobs = mockJobs.filter((j) => j.status === "approved").slice(0, 4);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-surface border-b border-border">
        <div className="container py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
              Find your path.{" "}
              <span className="text-primary">Serve with purpose.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
              Connecting devotees with meaningful career opportunities. Browse jobs,
              register as a candidate, or post openings for your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs..." className="pl-9 h-12" />
              </div>
              <Link to="/jobs">
                <Button size="lg" className="h-12 w-full sm:w-auto">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-card rounded-xl shadow-card p-5 text-center"
              >
                <s.icon className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground tabular-nums">
                  {s.value}
                </p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="container py-12 sm:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
            Recent Openings
          </h2>
          <Link
            to="/jobs"
            className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {approvedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onApply={() => toast.info("Please login to apply")}
              onSave={() => toast.info("Please login to save jobs")}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface border-t border-border">
        <div className="container py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl shadow-card p-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Looking for a job?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Register as a candidate and start applying to positions that match your skills.
              </p>
              <Link to="/register">
                <Button>Register Now</Button>
              </Link>
            </div>
            <div className="bg-card rounded-xl shadow-card p-8">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Hiring for your organization?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Post a job listing — no account required. Our admin team will review and publish it.
              </p>
              <Link to="/post-job">
                <Button variant="outline">Post a Job</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
