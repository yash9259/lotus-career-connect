import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { updateJobDetails, UpdateJobInput } from "@/lib/employerJobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface EditJobDialogProps {
  jobId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export const EditJobDialog = ({
  jobId,
  open,
  onOpenChange,
  onSave,
}: EditJobDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    position: "",
    vacancy: "1",
    gender: "Any",
    experience: "",
    qualification: "",
    salaryMin: "",
    salaryMax: "",
    jobTime: "",
    location: "",
    interviewName: "",
    interviewContact: "",
    companyEmail: "",
    responsibilities: "",
    status: "pending",
  });

  useEffect(() => {
    if (!open || !jobId) return;

    const fetchJobDetails = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("job_posts")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;

        if (data) {
          setForm({
            companyName: data.company_name || "",
            position: data.position || "",
            vacancy: String(data.vacancy || 1),
            gender: data.gender || "Any",
            experience: data.experience || "",
            qualification: data.qualification || "",
            salaryMin: data.salary_min !== null ? String(data.salary_min) : "",
            salaryMax: data.salary_max !== null ? String(data.salary_max) : "",
            jobTime: data.job_time || "",
            location: data.location || "",
            interviewName: data.interview_contact_name || "",
            interviewContact: data.interview_contact_number || "",
            companyEmail: data.company_email || "",
            responsibilities: data.responsibilities || data.description || "",
            status: data.status || "pending",
          });
        }
      } catch (error) {
        console.error("Error loading job details:", error);
        toast.error("Failed to load job details");
        onOpenChange(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [open, jobId, onOpenChange]);

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const sanitizeVacancy = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "";
    const parsed = Number.parseInt(digits, 10);
    return String(Math.min(Math.max(parsed, 1), 99));
  };

  const sanitizePhone = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    if (
      !form.position ||
      !form.location ||
      !form.companyName ||
      !form.companyEmail ||
      !form.responsibilities ||
      !form.gender ||
      !form.vacancy ||
      !form.jobTime ||
      !form.interviewContact
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const vacancyNumber = Number.parseInt(form.vacancy, 10);
    if (!Number.isFinite(vacancyNumber) || vacancyNumber < 1 || vacancyNumber > 99) {
      toast.error("Vacancy must be between 1 and 99");
      return;
    }

    if (form.interviewContact.length !== 10) {
      toast.error("Interview contact must be 10 digits");
      return;
    }

    setIsSaving(true);
    try {
      const parsedSalaryMin = form.salaryMin ? Number.parseFloat(form.salaryMin) : null;
      const parsedSalaryMax = form.salaryMax ? Number.parseFloat(form.salaryMax) : null;

      const finalSalaryMin = (parsedSalaryMin !== null && !Number.isNaN(parsedSalaryMin)) ? parsedSalaryMin : null;
      const finalSalaryMax = (parsedSalaryMax !== null && !Number.isNaN(parsedSalaryMax)) ? parsedSalaryMax : null;

      const input: UpdateJobInput = {
        companyName: form.companyName,
        position: form.position,
        vacancy: vacancyNumber,
        gender: form.gender,
        experience: form.experience || null,
        qualification: form.qualification || null,
        salaryMin: finalSalaryMin,
        salaryMax: finalSalaryMax,
        jobTime: form.jobTime,
        location: form.location,
        interviewName: form.interviewName || null,
        interviewContact: form.interviewContact,
        companyEmail: form.companyEmail,
        responsibilities: form.responsibilities,
        status: form.status as any,
      };

      await updateJobDetails(jobId, input);
      toast.success("Job updated successfully");
      onOpenChange(false);
      onSave();
    } catch (error) {
      console.error("Error saving job details:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update job details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Posting</DialogTitle>
          <DialogDescription>
            Modify post details or change state for this job listing.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Section 1: Company Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase tracking-wider">Company Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                    placeholder="e.g. ABC Technologies"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyEmail">Company Email *</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={form.companyEmail}
                    onChange={(e) => update("companyEmail", e.target.value)}
                    placeholder="info@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Job Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase tracking-wider">Job Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={form.position}
                    onChange={(e) => update("position", e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vacancy">Total Vacancy *</Label>
                  <Input
                    id="vacancy"
                    type="number"
                    value={form.vacancy}
                    onChange={(e) => update("vacancy", sanitizeVacancy(e.target.value))}
                    min="1"
                    max="99"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gender">Gender Preference *</Label>
                  <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="experience">Experience Required</Label>
                  <Input
                    id="experience"
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    placeholder="e.g. 1-3 years"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qualification">Qualification Required</Label>
                  <Input
                    id="qualification"
                    value={form.qualification}
                    onChange={(e) => update("qualification", e.target.value)}
                    placeholder="e.g. Graduate"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="jobTime">Job Time / Timings *</Label>
                  <Input
                    id="jobTime"
                    value={form.jobTime}
                    onChange={(e) => update("jobTime", e.target.value)}
                    placeholder="e.g. Full Time - 09:30 AM - 06:30 PM"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="salaryMin">Salary Min (₹)</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => update("salaryMin", e.target.value)}
                    placeholder="e.g. 20000"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="salaryMax">Salary Max (₹)</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => update("salaryMax", e.target.value)}
                    placeholder="e.g. 35000"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Interview Contact & Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-1 text-muted-foreground uppercase tracking-wider">Contact & Administration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="interviewName">Interviewer Name</Label>
                  <Input
                    id="interviewName"
                    value={form.interviewName}
                    onChange={(e) => update("interviewName", e.target.value)}
                    placeholder="e.g. HR Manager"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="interviewContact">Contact Number *</Label>
                  <Input
                    id="interviewContact"
                    value={form.interviewContact}
                    onChange={(e) => update("interviewContact", sanitizePhone(e.target.value))}
                    placeholder="10-digit number"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="jobStatus">Job Status</Label>
                  <Select value={form.status} onValueChange={(v) => update("status", v)}>
                    <SelectTrigger id="jobStatus">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 4: Responsibilities */}
            <div className="space-y-1.5">
              <Label htmlFor="responsibilities">Job Responsibilities / Description *</Label>
              <Textarea
                id="responsibilities"
                value={form.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
                rows={5}
                placeholder="Job Description..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
