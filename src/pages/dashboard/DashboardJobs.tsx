import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { mockJobs } from "@/lib/mockData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const DashboardJobs = () => {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("All Cities");
  const [experience, setExperience] = useState("Any Experience");
  const [category, setCategory] = useState("All Categories");
  const [page, setPage] = useState(1);

  const approvedJobs = mockJobs.filter((j) => j.status === "approved");

  const filtered = approvedJobs.filter((job) => {
    if (keyword && !job.position.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (city !== "All Cities" && job.location !== city) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-foreground mb-1">Browse Jobs</h1>
      <p className="text-sm text-muted-foreground mb-5">{filtered.length} open positions</p>

      <JobFilters
        keyword={keyword} city={city} experience={experience} category={category}
        onKeywordChange={(v) => { setKeyword(v); setPage(1); }}
        onCityChange={(v) => { setCity(v); setPage(1); }}
        onExperienceChange={setExperience}
        onCategoryChange={setCategory}
      />

      <div className="mt-5 space-y-3">
        {paginated.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No jobs found.</p>
        ) : paginated.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={() => toast.success("Application submitted!")}
            onSave={() => toast.success("Job saved!")}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground tabular-nums">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardJobs;
