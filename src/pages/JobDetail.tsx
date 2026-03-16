import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { mockJobs } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Briefcase, Users, GraduationCap } from "lucide-react";
import { toast } from "sonner";

const JobDetail = () => {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === id && j.status === "approved");

  if (!job) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-xl font-semibold text-foreground mb-2">Job not found</h1>
          <Link to="/jobs" className="text-primary hover:underline text-sm">
            Back to jobs
          </Link>
        </div>
      </Layout>
    );
  }

  const details = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Experience", value: job.experience },
    { icon: Clock, label: "Job Type", value: job.jobTime },
    { icon: Users, label: "Vacancy", value: `${job.vacancy} position(s)` },
    { icon: GraduationCap, label: "Qualification", value: job.qualification },
  ];

  return (
    <Layout>
      <div className="container py-8 sm:py-12 max-w-3xl">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </Link>

        <div className="bg-card rounded-xl shadow-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{job.position}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {job.gender !== "Any" ? `${job.gender} candidates preferred` : "Open to all genders"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary tabular-nums">{job.salaryRange}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {details.map((d) => (
              <div key={d.label} className="flex items-start gap-2.5">
                <d.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-sm font-medium text-foreground">{d.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-3">Responsibilities</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {job.responsibilities}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex gap-3">
            <Button onClick={() => toast.info("Please login to apply")}>
              Apply Now
            </Button>
            <Button variant="outline" onClick={() => toast.info("Please login to save")}>
              Save Job
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
