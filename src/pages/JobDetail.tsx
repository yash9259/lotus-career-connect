import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import Seo, { getSiteUrl } from "@/components/seo/Seo";
import PageBreadcrumbs from "@/components/seo/PageBreadcrumbs";
import { SITE, absoluteUrl, breadcrumbSchema } from "@/lib/seoConfig";
import type { Job } from "@/lib/mockData";
import { getApprovedJobById, listRecentApprovedJobs } from "@/lib/candidateDashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, MapPin, Clock, Briefcase, Users, GraduationCap,
  Calendar, Bookmark, Share2, Flag, Building2, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import JobCard from "@/components/jobs/JobCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { checkCandidatePaymentVerified } from "@/lib/candidateDashboard";

const EMPLOYMENT_TYPES: Record<string, string> = {
  "full time": "FULL_TIME",
  "full-time": "FULL_TIME",
  "part time": "PART_TIME",
  "part-time": "PART_TIME",
  contract: "CONTRACTOR",
  internship: "INTERN",
  temporary: "TEMPORARY",
};

/** Parses strings like "₹8,00,000 – ₹14,00,000" into min/max numbers; returns null when unsure. */
const parseSalaryRange = (value: string) => {
  const numbers = (value.match(/\d[\d,]*/g) || []).map((n) => Number(n.replace(/,/g, ""))).filter((n) => n > 0);
  if (numbers.length === 0 || numbers.length > 2) return null;
  const [min, max = numbers[0]] = numbers;
  return { min: Math.min(min, max), max: Math.max(min, max) };
};

const toPlainText = (value: string) => value.replace(/\s+/g, " ").trim();

const buildJobPostingSchema = (job: Job, siteUrl: string) => {
  const salary = parseSalaryRange(job.salaryRange);
  const employmentType = EMPLOYMENT_TYPES[job.jobTime.trim().toLowerCase()];
  const description = toPlainText([job.description, job.responsibilities].filter(Boolean).join(" "));
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.position,
    description,
    datePosted: job.postedAt,
    ...(employmentType ? { employmentType } : {}),
    identifier: { "@type": "PropertyValue", name: "Hare Krishna Job Placement", value: job.id },
    // The employer's name is not shown on the public page, so the listing agency is declared instead.
    hiringOrganization: {
      "@type": "Organization",
      name: SITE.name,
      sameAs: siteUrl,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" },
    },
    ...(job.industry ? { industry: job.industry } : {}),
    ...(job.qualification ? { educationRequirements: job.qualification } : {}),
    ...(job.skills?.length ? { skills: job.skills.join(", ") } : {}),
    ...(salary
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: "INR",
            value: { "@type": "QuantitativeValue", minValue: salary.min, maxValue: salary.max, unitText: "YEAR" },
          },
        }
      : {}),
    ...(job.vacancy > 0 ? { totalJobOpenings: job.vacancy } : {}),
    url: absoluteUrl(siteUrl, `/jobs/${job.id}`),
  };
};

const JobDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [allApprovedJobs, setAllApprovedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) {
        setJob(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const [jobData, jobs] = await Promise.all([
          getApprovedJobById(id),
          listRecentApprovedJobs(8),
        ]);
        setJob(jobData);
        setAllApprovedJobs(jobs);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load job");
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [id]);

  const similarJobs = useMemo(
    () => allApprovedJobs.filter((j) => j.id !== id).slice(0, 3),
    [allApprovedJobs, id],
  );

  if (isLoading) {
    return (
      <Layout>
        <Seo title="Loading job" noindex />
        <div className="container py-8 sm:py-10 space-y-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-[300px] rounded-xl" />
          <Skeleton className="h-[240px] rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!job) {
    return (
      <Layout>
        <Seo title="Job not found" description="This job is no longer available." noindex />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Job not found</h1>
          <p className="mb-4 text-sm text-muted-foreground">This job may have been filled or removed.</p>
          <Link to="/jobs" className="text-primary hover:underline text-sm font-medium">Back to jobs</Link>
        </div>
      </Layout>
    );
  }

  const postedDays = Math.floor(
    (Date.now() - new Date(job.postedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const infoItems = [
    { icon: MapPin, label: "Location", value: job.location },
    { icon: Briefcase, label: "Experience", value: job.experience },
    { icon: Clock, label: "Job Type", value: job.jobTime },
    { icon: Users, label: "Openings", value: `${job.vacancy}` },
    { icon: GraduationCap, label: "Qualification", value: job.qualification },
    { icon: Calendar, label: "Posted", value: `${postedDays} day${postedDays !== 1 ? "s" : ""} ago` },
  ];

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

  const siteUrl = getSiteUrl();
  const crumbs = [
    { label: "Home", to: "/" },
    { label: "Browse Jobs", to: "/jobs" },
    { label: job.position },
  ];
  const seoDescription = toPlainText(
    `${job.position} in ${job.location} (${job.jobTime}, ${job.experience}). ${job.description}`,
  ).slice(0, 158);

  return (
    <Layout>
      <Seo
        title={`${job.position} in ${job.location}`}
        description={seoDescription}
        type="article"
        jsonLd={[buildJobPostingSchema(job, siteUrl), breadcrumbSchema(siteUrl, crumbs)]}
      />
      <div className="bg-surface border-b border-border">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4">
          <PageBreadcrumbs items={crumbs} />
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to jobs
          </Link>
        </div>
      </div>

      <div className="container py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-premium"
            >
              {/* Top accent bar */}
              <div className="hairline-brand !h-1.5 !opacity-100" aria-hidden="true" />
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Company avatar */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-surface border border-border shrink-0">
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                      {job.position}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {job.location} · {job.jobTime} · {job.industry}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="text-lg font-bold text-primary tabular-nums">
                        {job.salaryRange}
                      </span>
                      <span className="text-xs text-muted-foreground">/year</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-border">
                  <Button
                    size="lg"
                    onClick={handleApply}
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => toast.info("Please login to save")}
                    className="gap-2"
                  >
                    <Bookmark className="h-4 w-4" /> Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied!");
                    }}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Job details */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl shadow-card p-6 sm:p-8 space-y-8"
            >
              {/* Description */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  About the Role
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Responsibilities
                </h2>
                <ul className="space-y-2">
                  {(() => {
                    const items = job.responsibilities.includes("\n")
                      ? job.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean).map((r) => r.replace(/^[-\*\s•]+/, "").trim())
                      : job.responsibilities.split(". ").map((r) => r.trim()).filter(Boolean).map((r) => r.endsWith(".") ? r : r + ".");
                    return items.map((r, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="whitespace-pre-line">{r}</span>
                      </li>
                    ));
                  })()}
                </ul>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="font-normal"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              {job.benefits.length > 0 && (
                <div>
                  <h2 className="text-base font-semibold text-foreground mb-3">
                    Benefits & Perks
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((b) => (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1.5 text-sm text-accent-foreground bg-accent px-3 py-1.5 rounded-md"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-base font-semibold text-foreground mb-4">
                  Similar Positions
                </h2>
                <div className="space-y-3">
                  {similarJobs.map((j) => (
                    <JobCard
                      key={j.id}
                      job={j}
                      onApply={handleApply}
                      onSave={() => toast.info("Please login to save")}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job overview card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl shadow-card p-6 sticky top-20"
            >
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Job Overview
              </h3>
              <div className="space-y-4">
                {infoItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface shrink-0">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Gender Preference</p>
                <p className="text-sm font-medium text-foreground">
                  {job.gender !== "Any" ? `${job.gender} preferred` : "Open to all"}
                </p>
              </div>

              <div className="mt-5 pt-5 border-t border-border">
                <p className="text-xs text-muted-foreground mb-1">Industry</p>
                <Badge variant="outline">{job.industry}</Badge>
              </div>

              <Button
                className="w-full mt-6"
                onClick={handleApply}
              >
                Apply Now
              </Button>

              <button
                onClick={() => toast.info("Report submitted")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mt-4 mx-auto transition-colors"
              >
                <Flag className="h-3 w-3" /> Report this job
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetail;
