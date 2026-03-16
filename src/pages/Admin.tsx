import { useState } from "react";
import Layout from "@/components/layout/Layout";
import StatCard from "@/components/ui/StatCard";
import { mockJobs, mockCandidates, mockApplications } from "@/lib/mockData";
import { Briefcase, Users, Clock, FileCheck, Check, X, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import type { Job } from "@/lib/mockData";

const Admin = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const approvedJobs = jobs.filter((j) => j.status === "approved");

  const updateJobStatus = (id: string, status: Job["status"]) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    toast.success(`Job ${status}`);
  };

  const stats = [
    { label: "Total Candidates", value: mockCandidates.length, icon: Users },
    { label: "Total Jobs", value: jobs.length, icon: Briefcase },
    { label: "Pending Approval", value: pendingJobs.length, icon: Clock },
    { label: "Applications", value: mockApplications.length, icon: FileCheck },
  ];

  return (
    <Layout>
      <div className="container py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-foreground mb-1">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mb-6">Manage jobs and candidates</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">
              Pending Jobs ({pendingJobs.length})
            </TabsTrigger>
            <TabsTrigger value="approved">Approved Jobs</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4">
            {pendingJobs.length === 0 ? (
              <p className="text-muted-foreground text-sm py-8 text-center">
                No pending jobs to review.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-card rounded-xl shadow-card p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-foreground">
                          {job.position}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.location} · {job.experience} · {job.jobTime}
                        </p>
                        <p className="text-sm text-primary font-semibold tabular-nums">
                          {job.salaryRange}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground space-y-0.5">
                          <p><span className="font-medium text-foreground">Company:</span> {job.companyName}</p>
                          <p><span className="font-medium text-foreground">Contact:</span> {job.interviewContact}</p>
                          <p><span className="font-medium text-foreground">Email:</span> {job.companyEmail}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => updateJobStatus(job.id, "approved")}
                          className="gap-1"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateJobStatus(job.id, "rejected")}
                          className="gap-1"
                        >
                          <X className="h-3.5 w-3.5" /> Reject
                        </Button>
                      </div>
                    </div>
                    {job.responsibilities && (
                      <p className="mt-3 text-xs text-muted-foreground border-t border-border pt-3">
                        {job.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="approved" className="mt-4 space-y-3">
            {approvedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-card rounded-xl shadow-card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{job.position}</h3>
                  <p className="text-xs text-muted-foreground">{job.location} · {job.salaryRange}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-accent text-accent-foreground border border-primary/20 w-fit">
                  Approved
                </span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="candidates" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2 hidden sm:table-cell">Email</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2 hidden md:table-cell">Education</th>
                    <th className="text-left text-xs font-medium text-muted-foreground py-3 px-2 hidden md:table-cell">Experience</th>
                    <th className="text-right text-xs font-medium text-muted-foreground py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockCandidates.map((c) => (
                    <tr key={c.id} className="border-b border-border hover:bg-surface transition-colors">
                      <td className="py-3 px-2 text-sm font-medium text-foreground">{c.fullName}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden sm:table-cell">{c.email}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">{c.education}</td>
                      <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">{c.experience}</td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => toast.info("Profile view coming soon")}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toast.info("Download coming soon")}>
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
