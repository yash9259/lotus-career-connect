import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockApplications } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Calendar, Building2 } from "lucide-react";

const statusTabs = [
  { value: "all", label: "All" },
  { value: "applied", label: "Applied" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "rejected", label: "Rejected" },
];

const statusColor = (s: string) => {
  switch (s) {
    case "shortlisted": return "bg-accent text-accent-foreground border-primary/20";
    case "interview": return "bg-accent text-accent-foreground border-primary/20";
    case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

const DashboardApplications = () => {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all"
    ? mockApplications
    : mockApplications.filter((a) => a.status === tab);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-foreground mb-1">My Applications</h1>
      <p className="text-sm text-muted-foreground mb-5">
        Track the status of your job applications
      </p>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          {statusTabs.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
              {t.value !== "all" && (
                <span className="ml-1.5 text-xs tabular-nums">
                  ({mockApplications.filter((a) => t.value === "all" || a.status === t.value).length})
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground text-sm">
              No applications found.
            </p>
          ) : (
            filtered.map((app) => (
              <div
                key={app.id}
                className="bg-card rounded-xl shadow-card p-5 transition-shadow hover:shadow-card-hover"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1.5 min-w-0">
                    <h3 className="text-base font-semibold text-foreground">
                      {app.position}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        {app.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {app.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied {app.appliedAt}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-full border shrink-0 ${statusColor(app.status)}`}
                  >
                    {app.status === "interview" ? "Interview Scheduled" : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    {["applied", "shortlisted", "interview"].map((step, i) => {
                      const steps = ["applied", "shortlisted", "interview"];
                      const currentIdx = steps.indexOf(app.status);
                      const isRejected = app.status === "rejected";
                      const isActive = !isRejected && i <= currentIdx;
                      return (
                        <div key={step} className="flex items-center gap-1 flex-1">
                          <div
                            className={`h-2 flex-1 rounded-full transition-colors ${
                              isRejected
                                ? "bg-destructive/20"
                                : isActive
                                ? "bg-primary"
                                : "bg-border"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                    <span>Applied</span>
                    <span>Shortlisted</span>
                    <span>Interview</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default DashboardApplications;
