import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const PostJob = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: "", position: "", vacancy: "", gender: "",
    experience: "", qualification: "", salaryMin: "", salaryMax: "",
    jobTime: "", location: "", interviewName: "", interviewContact: "",
    companyEmail: "", responsibilities: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.position || !form.location || !form.companyName || !form.companyEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Job submitted for review!");
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container py-16 sm:py-24 max-w-md text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl shadow-card p-10"
          >
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2">
              Submission Received
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Your job listing has been submitted for admin review. Once approved, it will appear on the portal.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Post Another Job
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-10 sm:py-16 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Post a Job
        </h1>
        <p className="text-muted-foreground mb-8">
          No account required. Submit your job listing and our team will review it.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="bg-card rounded-xl shadow-card p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Company Name * <span className="text-xs text-muted-foreground">(Admin only)</span></Label>
                <Input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} className="mt-1.5 h-11" />
              </div>
              <div>
                <Label>Position *</Label>
                <Input value={form.position} onChange={(e) => update("position", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. Full Stack Developer" />
              </div>
              <div>
                <Label>Total Vacancy</Label>
                <Input type="number" value={form.vacancy} onChange={(e) => update("vacancy", e.target.value)} className="mt-1.5 h-11" min="1" />
              </div>
              <div>
                <Label>Gender Requirement</Label>
                <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Work Experience</Label>
                <Input value={form.experience} onChange={(e) => update("experience", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. 2-4 years" />
              </div>
              <div>
                <Label>Qualification</Label>
                <Input value={form.qualification} onChange={(e) => update("qualification", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. B.Tech" />
              </div>
              <div>
                <Label>Salary Range (Min)</Label>
                <Input value={form.salaryMin} onChange={(e) => update("salaryMin", e.target.value)} className="mt-1.5 h-11" placeholder="₹" />
              </div>
              <div>
                <Label>Salary Range (Max)</Label>
                <Input value={form.salaryMax} onChange={(e) => update("salaryMax", e.target.value)} className="mt-1.5 h-11" placeholder="₹" />
              </div>
              <div>
                <Label>Job Time</Label>
                <Select value={form.jobTime} onValueChange={(v) => update("jobTime", v)}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Time">Full Time</SelectItem>
                    <SelectItem value="Part Time">Part Time</SelectItem>
                    <SelectItem value="Shift Based">Shift Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Job Location (City) *</Label>
                <Input value={form.location} onChange={(e) => update("location", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <Label>Interview Contact Name <span className="text-xs text-muted-foreground">(Admin only)</span></Label>
                <Input value={form.interviewName} onChange={(e) => update("interviewName", e.target.value)} className="mt-1.5 h-11" />
              </div>
              <div>
                <Label>Interview Contact Number <span className="text-xs text-muted-foreground">(Admin only)</span></Label>
                <Input value={form.interviewContact} onChange={(e) => update("interviewContact", e.target.value)} className="mt-1.5 h-11" />
              </div>
              <div className="sm:col-span-2">
                <Label>Company Email * <span className="text-xs text-muted-foreground">(Admin only)</span></Label>
                <Input type="email" value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} className="mt-1.5 h-11" />
              </div>
            </div>
            <div>
              <Label>Job Responsibilities</Label>
              <Textarea value={form.responsibilities} onChange={(e) => update("responsibilities", e.target.value)} className="mt-1.5" rows={4} placeholder="Describe the role and responsibilities..." />
            </div>
            <div className="flex justify-end pt-3">
              <Button type="submit">Submit for Review</Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PostJob;
