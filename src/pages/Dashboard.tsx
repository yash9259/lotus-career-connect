import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/ui/StatCard";
import JobCard from "@/components/jobs/JobCard";
import { mockJobs, mockApplications } from "@/lib/mockData";
import { Briefcase, FileCheck, Bookmark, Phone } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [savedJobs] = useState<string[]>(["2"]);
  const approvedJobs = mockJobs.filter((j) => j.status === "approved");

  const stats = [
    { label: "Total Jobs", value: approvedJobs.length, icon: Briefcase },
    { label: "Applied Jobs", value: mockApplications.length, icon: FileCheck },
    { label: "Saved Jobs", value: savedJobs.length, icon: Bookmark },
    { label: "Interview Calls", value: 1, icon: Phone },
  ];

  return (
    <Layout>
      <div className="container py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground mb-6">Welcome back, Arjun Sharma</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <Tabs defaultValue="applications">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="applications" className="mt-4 space-y-3">
            {mockApplications.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-xl shadow-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{app.position}</h3>
                  <p className="text-xs text-muted-foreground">Applied on {app.appliedAt}</p>
                </div>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full border w-fit ${
                    app.status === "shortlisted"
                      ? "bg-accent text-accent-foreground border-primary/20"
                      : app.status === "interview"
                      ? "bg-accent text-accent-foreground border-primary/20"
                      : "bg-muted text-muted-foreground border-border"
                  }`}
                >
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="saved" className="mt-4 space-y-3">
            {approvedJobs
              .filter((j) => savedJobs.includes(j.id))
              .map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => toast.success("Applied!")}
                  onSave={() => {}}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
