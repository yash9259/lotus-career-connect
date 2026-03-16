import { useState } from "react";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { mockJobs } from "@/lib/mockData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 5;

const Jobs = () => {
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
    <Layout>
      <div className="container py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Browse Jobs
        </h1>
        <p className="text-muted-foreground mb-6">
          {filtered.length} open positions
        </p>

        <JobFilters
          keyword={keyword}
          city={city}
          experience={experience}
          category={category}
          onKeywordChange={(v) => { setKeyword(v); setPage(1); }}
          onCityChange={(v) => { setCity(v); setPage(1); }}
          onExperienceChange={setExperience}
          onCategoryChange={setCategory}
        />

        <div className="mt-6 space-y-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No jobs found matching your criteria.
            </div>
          ) : (
            paginated.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={() => toast.info("Please login to apply")}
                onSave={() => toast.info("Please login to save jobs")}
              />
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Jobs;
