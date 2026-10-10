import { MapPin, Clock, Briefcase, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Job } from "@/lib/mockData";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
  applicationStatus?: "applied" | "shortlisted" | "interview" | "rejected" | "hired" | "withdrawn";
  isApplyPending?: boolean;
  isSavePending?: boolean;
}

const postedLabel = (value?: string) => {
  if (!value) return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) return null;
  const days = Math.floor((Date.now() - time) / 86_400_000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days} days ago`;
  const months = Math.floor(days / 30);
  return `Posted ${months} ${months === 1 ? "month" : "months"} ago`;
};

const getApplicationButtonLabel = (status?: JobCardProps["applicationStatus"]) => {
  switch (status) {
    case "shortlisted":
      return "Shortlisted";
    case "interview":
      return "Interview";
    case "rejected":
      return "Rejected";
    case "hired":
      return "Hired";
    case "withdrawn":
      return "Withdrawn";
    case "applied":
      return "Applied";
    default:
      return "Apply";
  }
};

const JobCard = ({
  job,
  showActions = true,
  onApply,
  onSave,
  isSaved = false,
  applicationStatus,
  isApplyPending = false,
  isSavePending = false,
}: JobCardProps) => (
  <article className="card-premium group flex flex-col gap-4 p-5 hover:border-primary/40 sm:flex-row sm:items-start sm:justify-between sm:p-6">
    <div className="flex min-w-0 flex-1 items-start gap-4">
      <span
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-accent font-display text-xl font-medium text-primary"
        aria-hidden="true"
      >
        {(job.companyName || job.position).trim().charAt(0).toUpperCase()}
      </span>
      <div className="min-w-0 space-y-1">
        <h3 className="text-base font-semibold sm:text-lg">
          <Link to={`/jobs/${job.id}`} className="rounded-sm text-primary hover:underline">
            {job.position}
          </Link>
        </h3>
        {job.companyName && <p className="text-sm text-foreground">{job.companyName}</p>}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Location: </span>
            {job.location}
          </li>
          <li className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Experience: </span>
            {job.experience}
          </li>
          <li className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Job type: </span>
            {job.jobTime}
          </li>
          {postedLabel(job.postedAt) && (
            <li className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              {postedLabel(job.postedAt)}
            </li>
          )}
        </ul>
      </div>
    </div>
    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
      <p className="whitespace-nowrap text-base font-semibold tabular-nums text-foreground">{job.salaryRange}</p>
      {showActions && (
        <div className="flex gap-2">
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="sm"
            disabled={isSavePending}
            onClick={() => onSave?.(job.id)}
          >
            {isSavePending ? "Saving..." : isSaved ? "Saved" : "Save"}
          </Button>
          <Button
            size="sm"
            variant={applicationStatus ? "secondary" : "default"}
            disabled={Boolean(applicationStatus) || isApplyPending}
            onClick={() => onApply?.(job.id)}
          >
            {isApplyPending ? "Applying..." : getApplicationButtonLabel(applicationStatus)}
          </Button>
        </div>
      )}
    </div>
  </article>
);

export default JobCard;
