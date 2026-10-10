import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHeader from "@/components/layout/PageHeader";
import Seo from "@/components/seo/Seo";
import { JOBS_FAQS, STATIC_ROUTES, breadcrumbSchema, faqSchema, itemListSchema, webPageSchema } from "@/lib/seoConfig";
import FaqList from "@/components/seo/FaqList";
import { getSiteUrl } from "@/components/seo/Seo";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import type { Job } from "@/lib/mockData";
import { listApprovedJobs } from "@/lib/candidateDashboard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { checkCandidatePaymentVerified } from "@/lib/candidateDashboard";

const ITEMS_PER_PAGE = 5;
const jobsMeta = STATIC_ROUTES.find((route) => route.path === "/jobs")!;
const crumbs = [{ label: "Home", to: "/" }, { label: "Browse Jobs" }];

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(() => searchParams.get("keyword") ?? "");
  const [city, setCity] = useState("All Cities");
  const [experience, setExperience] = useState("Any Experience");
  const [category, setCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setKeyword(searchParams.get("keyword") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const nextJobs = await listApprovedJobs({ keyword, city, experience, category });
        setJobs(nextJobs);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    loadJobs();
  }, [keyword, city, experience, category]);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);
  const paginated = jobs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleApply = async () => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    if (user.role !== "candidate") {
      toast.error("Only candidates can apply for jobs.");
      return;
    }

    const hasPaid = await checkCandidatePaymentVerified(user.id);
    if (!hasPaid) {
      toast.error("Please complete payment to apply for jobs.");
      navigate("/dashboard/payment");
      return;
    }

    navigate("/dashboard/jobs");
  };

  return (
    <Layout>
      <Seo
        title={jobsMeta.title}
        description={jobsMeta.description}
        jsonLd={[
          breadcrumbSchema(getSiteUrl(), crumbs),
          webPageSchema(getSiteUrl(), {
            path: "/jobs",
            type: "CollectionPage",
            name: jobsMeta.title,
            description: jobsMeta.description,
            speakable: ["#jobs-intro"],
          }),
          faqSchema(JOBS_FAQS),
          ...(paginated.length ? [itemListSchema(getSiteUrl(), paginated)] : []),
        ]}
      />
      <PageHeader
        title="Browse Jobs"
        crumbs={crumbs}
        description={
          <>
            <span aria-live="polite" className="block font-semibold text-white">
              {isLoading ? "Loading open positions..." : `${jobs.length} open positions`}
            </span>
            <span id="jobs-intro" className="mt-2 block">
              Every job here is reviewed by our team before it is published. Search by keyword, city, experience or
              category, then apply from your candidate dashboard.
            </span>
          </>
        }
      />
      <div className="container grid gap-6 py-8 sm:py-12 lg:grid-cols-12 lg:items-start">
        <aside className="lg:col-span-3">
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
        </aside>

        <div className="lg:col-span-9">
        <div className="space-y-4">
          {isLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-[130px] rounded-lg" />)
          ) : paginated.length === 0 ? (
            <div className="space-y-2 rounded-lg border border-dashed border-border bg-card py-16 text-center text-muted-foreground">
              <p>No jobs found matching your criteria.</p>
              <p className="text-xs">Only admin-approved jobs are visible on this page.</p>
            </div>
          ) : (
            paginated.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
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
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Previous page</span>
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
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        )}
        </div>
      </div>

      <section className="container pb-16 sm:pb-24" aria-labelledby="jobs-faq">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="section-rule" aria-hidden="true" />
            <h2 id="jobs-faq" className="section-title">Applying for jobs</h2>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={JOBS_FAQS} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Jobs;
