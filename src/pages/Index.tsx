import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Briefcase,
  Building2,
  ArrowRight,
  UserPlus,
  ClipboardCheck,
  Send,
  FileText,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import JobCard from "@/components/jobs/JobCard";
import Seo, { getSiteUrl } from "@/components/seo/Seo";
import FaqList from "@/components/seo/FaqList";
import type { Job } from "@/lib/mockData";
import { listRecentApprovedJobs } from "@/lib/candidateDashboard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { HOME_FAQS, LOCATIONS, STATIC_ROUTES, faqSchema, webPageSchema } from "@/lib/seoConfig";

const formatCount = (value: number) => value.toLocaleString("en-IN");

const homeMeta = STATIC_ROUTES[0];

const candidateSteps = [
  {
    icon: UserPlus,
    title: "Register",
    text: "Create your candidate account and complete your profile, education, experience and resume.",
  },
  {
    icon: Search,
    title: "Browse approved jobs",
    text: "Search openings by keyword, city, experience and category. Only admin-approved jobs are listed.",
  },
  {
    icon: Send,
    title: "Apply from your dashboard",
    text: "Complete payment verification, then apply and track every application in one place.",
  },
];

const employerSteps = [
  {
    icon: FileText,
    title: "Post a job",
    text: "Share your opening with us. No account is required to submit a listing.",
  },
  {
    icon: ClipboardCheck,
    title: "We review it",
    text: "Our admin team reviews each submission before anything goes live.",
  },
  {
    icon: Globe2,
    title: "Reach candidates",
    text: "Once approved, your job appears on the Browse Jobs page for registered candidates.",
  },
];

const homeFaqs = HOME_FAQS;

const Index = () => {
  const navigate = useNavigate();
  const [approvedJobs, setApprovedJobs] = useState<Job[]>([]);
  const [approvedJobsCount, setApprovedJobsCount] = useState(0);
  const [stats, setStats] = useState([
    { label: "Active Jobs", value: "0", icon: Briefcase },
    { label: "Companies", value: "0", icon: Building2 },
  ]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const [recentJobs, { count: candidateCount }, { count: approvedJobsTotal }, { data: companyRows }] = await Promise.all([
          listRecentApprovedJobs(4),
          supabase.from("candidate_profiles").select("user_id", { count: "exact", head: true }),
          supabase.from("job_posts").select("id", { count: "exact", head: true }).eq("status", "approved"),
          supabase.from("job_posts").select("company_name").eq("status", "approved"),
        ]);

        setApprovedJobs(recentJobs);
        setApprovedJobsCount(approvedJobsTotal || 0);
        const uniqueCompanies = new Set((companyRows || []).map((row) => row.company_name).filter(Boolean));

        setStats([
          { label: "Active Jobs", value: formatCount(approvedJobsTotal || 0), icon: Briefcase },
          { label: "Companies", value: formatCount(uniqueCompanies.size), icon: Building2 },
        ]);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load homepage data");
      } finally {
        setIsLoadingJobs(false);
      }
    };

    loadHomepageData();
  }, []);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const term = searchTerm.trim();
    navigate(term ? `/jobs?keyword=${encodeURIComponent(term)}` : "/jobs");
  };

  const siteUrl = getSiteUrl();

  return (
    <Layout>
      <Seo
        title={homeMeta.title}
        description={homeMeta.description}
        jsonLd={[
          webPageSchema(siteUrl, {
            path: "/",
            name: homeMeta.title,
            description: homeMeta.description,
            speakable: [".answer-lead", "#home-faq"],
          }),
          faqSchema(homeFaqs),
        ]}
      />

      {/* Hero */}
      <section className="hero-ink border-b border-white/10">
        <div className="container grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-7 lg:col-span-7"
          >
            <span className="block h-0.5 w-10 bg-gold" aria-hidden="true" />
            <h1 className="text-4xl leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
              Job placement from Bhuj, with jobs across India and worldwide
            </h1>

            <p className="answer-lead max-w-xl text-base text-white/80 sm:text-lg">
              Hare Krishna Job Placement connects job seekers and employers. Candidates in Bhuj, Gandhidham, Mundra,
              Kandla or any other city can apply, and every listing is reviewed before it goes live.
            </p>

            <form
              onSubmit={handleSearch}
              role="search"
              className="flex max-w-xl items-center gap-2 rounded-md bg-white p-1.5 shadow-premium focus-within:ring-2 focus-within:ring-[hsl(var(--gold))]"
            >
              <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                name="keyword"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search jobs, e.g. Accountant"
                aria-label="Search jobs by keyword"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button type="submit" className="btn-gold !h-11 shrink-0 !px-5 !text-sm">
                Browse jobs
              </button>
            </form>

            <p className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <Link to="/register" className="font-semibold text-gold underline-offset-4 hover:underline">
                Create a candidate profile
              </Link>
              <Link to="/post-job" className="font-semibold text-white underline-offset-4 hover:underline">
                Post a job
              </Link>
            </p>
          </motion.div>

          {/* Company fact sheet with live figures */}
          <aside aria-label="Hare Krishna Job Placement at a glance" className="glass-dark lg:col-span-5">
            <div className="flex items-center gap-4 border-b border-white/15 p-6">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-white p-1.5">
                <img
                  src="/logo.webp"
                  width={500}
                  height={500}
                  alt="Hare Krishna Job Placement logo"
                  className="h-full w-full object-contain"
                />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-medium">Hare Krishna Job Placement</p>
                <p className="mt-0.5 text-sm text-white/70">Ravalvadi, Bhuj, Gujarat</p>
              </div>
            </div>
            <dl className="divide-y divide-white/10 px-6 text-sm">
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-white/70">Approved jobs live</dt>
                <dd className="font-semibold tabular-nums">{stats[0].value}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-white/70">Hiring companies</dt>
                <dd className="font-semibold tabular-nums">{stats[1].value}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-white/70">Listing review</dt>
                <dd className="font-semibold">Most within 24 hours</dd>
              </div>
            </dl>
            {approvedJobs[0] && (
              <Link
                to={`/jobs/${approvedJobs[0].id}`}
                className="flex items-center justify-between gap-4 border-t border-white/15 px-6 py-4 transition-colors hover:bg-white/5"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-gold">Latest opening</span>
                  <span className="mt-0.5 block truncate text-sm font-semibold">{approvedJobs[0].position}</span>
                  <span className="block truncate text-xs text-white/70">{approvedJobs[0].location}</span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-white/70" aria-hidden="true" />
              </Link>
            )}
          </aside>
        </div>

        {/* Locations served */}
        <div className="border-t border-white/10">
          <div className="container flex flex-wrap items-center gap-x-6 gap-y-2 py-4 text-sm text-white/65">
            <span className="font-semibold text-white/90">Serving</span>
            {LOCATIONS.map((a) => (
              <span key={a.name}>{a.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust band */}
      <section className="border-b border-border bg-card" aria-label="Why employers and candidates use us">
        <div className="container grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { icon: ShieldCheck, title: "Every listing is reviewed", text: "Our admin team approves each job before it goes live." },
            { icon: FileText, title: "Post without an account", text: "Employers submit a listing with no sign-up needed." },
            { icon: Globe2, title: "Open to every city", text: "Jobs from across India and worldwide; candidates anywhere can apply." },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 px-0 py-6 sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container py-16 sm:py-24" aria-labelledby="how-it-works">
        <div className="mb-10 max-w-2xl">
          <span className="section-rule" aria-hidden="true" />
          <h2 id="how-it-works" className="section-title">
            A clear path for candidates and employers
          </h2>
          <p className="section-lead">Simple steps, reviewed by our team, so every connection is a meaningful one.</p>
        </div>
        <div className="grid overflow-hidden rounded-lg border border-border bg-card shadow-card lg:grid-cols-2">
          {[
            { heading: "For candidates", steps: candidateSteps },
            { heading: "For employers", steps: employerSteps },
          ].map((group, groupIndex) => (
            <div
              key={group.heading}
              className={`p-6 sm:p-8 ${groupIndex === 0 ? "border-b border-border lg:border-b-0 lg:border-r" : ""}`}
            >
              <h3 className="font-display text-2xl font-medium text-foreground">{group.heading}</h3>
              <ol className="mt-6 space-y-6">
                {group.steps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-primary">
                      <step.icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        <span className="mr-2 text-primary tabular-nums">{index + 1}.</span>
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section className="border-y border-border bg-surface" aria-labelledby="recent-openings">
        <div className="container py-16 sm:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="section-rule" aria-hidden="true" />
              <h2 id="recent-openings" className="section-title">
                Recent openings
              </h2>
              <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
                Live approved jobs: {isLoadingJobs ? "..." : approvedJobsCount}
              </p>
            </div>
            <Link to="/jobs" className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              View all jobs <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-4">
            {isLoadingJobs ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-[120px] rounded-lg" />)
            ) : approvedJobs.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                No approved jobs available right now. Jobs appear here after admin approval.
              </div>
            ) : (
              approvedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={() => navigate("/login")}
                  onSave={() => toast.info("Please login to save jobs")}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-16 sm:py-24" aria-labelledby="home-faq">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="section-rule" aria-hidden="true" />
            <h2 id="home-faq" className="section-title">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Cannot find your answer?{" "}
              <Link to="/contact" className="font-semibold text-primary underline-offset-4 hover:underline">
                Contact our team
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <FaqList faqs={homeFaqs} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="hero-ink">
        <div className="container grid gap-10 py-16 sm:py-20 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-medium sm:text-4xl">Looking for a job?</h2>
            <p className="mb-7 mt-3 max-w-md text-white/75">
              Register as a candidate and start applying to positions that match your skills.
            </p>
            <Link to="/register" className="btn-gold">Register now</Link>
          </div>
          <div className="md:border-l md:border-white/15 md:pl-10">
            <h2 className="font-display text-3xl font-medium sm:text-4xl">Hiring for your organization?</h2>
            <p className="mb-7 mt-3 max-w-md text-white/75">
              Post a job listing with no account needed. Our admin team reviews and publishes it.
            </p>
            <Link to="/post-job" className="chip-area h-12 px-6 text-base">Post a job</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
