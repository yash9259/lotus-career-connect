import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Upload, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const steps = ["Personal Information", "Contact & Education", "Declaration"];

const jobInterests = [
  "Technology", "Healthcare", "Finance", "Marketing", "Sales",
  "Engineering", "Design", "Customer Service", "Human Resources", "Other",
];

const Register = () => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const currentDate = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    fullName: "", gender: "", dob: "", maritalStatus: "", languages: "",
    email: "", password: "", confirmPassword: "", mobile: "", fatherMobile: "",
    presentAddress: "", permanentAddress: "", highestEducation: "",
    lastCompany: "", currentDesignation: "", totalExperience: "",
    lastSalary: "", expectedSalary: "",
    jobInterests: [] as string[],
    resume: null as File | null,
    familyRefName: "", familyRefContact: "",
    friendRefName: "", friendRefContact: "",
    declaration: false,
    signature: null as File | null,
  });

  const update = (field: string, value: unknown) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      jobInterests: prev.jobInterests.includes(interest)
        ? prev.jobInterests.filter((i) => i !== interest)
        : [...prev.jobInterests, interest],
    }));
  };

  const next = () => {
    if (step === 0) {
      if (!formData.fullName || !formData.gender || !formData.dob) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.mobile) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 2));
  };

  const validateFinalStep = () => {
    if (!formData.declaration) {
      toast.error("Please accept the declaration");
      return false;
    }

    if (!formData.fullName || !formData.email || !formData.password || !formData.mobile) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const openTermsDialog = () => {
    if (!validateFinalStep()) {
      return;
    }

    setIsTermsOpen(true);
  };

  const handleTermsOpenChange = (open: boolean) => {
    setIsTermsOpen(open);
    if (!open) {
      setHasAcceptedTerms(false);
    }
  };

  const submit = async () => {
    if (!validateFinalStep()) {
      return;
    }

    if (!hasAcceptedTerms) {
      toast.error("Please confirm the terms and conditions to continue");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsTermsOpen(false);
      const result = await register({
        email: formData.email,
        password: formData.password,
        termsAcceptedAt: new Date().toISOString(),
        profile: {
          fullName: formData.fullName,
          gender: formData.gender,
          dob: formData.dob,
          maritalStatus: formData.maritalStatus,
          languages: formData.languages,
          mobile: formData.mobile,
          fatherMobile: formData.fatherMobile,
          presentAddress: formData.presentAddress,
          permanentAddress: formData.permanentAddress,
          highestEducation: formData.highestEducation,
          lastCompany: formData.lastCompany,
          currentDesignation: formData.currentDesignation,
          totalExperience: formData.totalExperience,
          lastSalary: formData.lastSalary,
          expectedSalary: formData.expectedSalary,
          jobInterests: formData.jobInterests,
          familyRefName: formData.familyRefName,
          familyRefContact: formData.familyRefContact,
          friendRefName: formData.friendRefName,
          friendRefContact: formData.friendRefContact,
        },
        resumeFile: formData.resume,
        signatureFile: formData.signature,
      });
      if (result.requiresEmailConfirmation) {
        if (formData.resume || formData.signature) {
          toast.success("Registration complete. Verify your email first, then upload resume and signature from your dashboard.");
        } else {
          toast.success("Registration complete. Please verify your email, then sign in.");
        }
        navigate("/login");
        return;
      }

      toast.success(`Registration complete. Welcome, ${result.user.fullName}!`);
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to complete registration";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container py-10 sm:py-16 max-w-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Candidate Registration
        </h1>
        <p className="text-muted-foreground mb-8">
          Complete all three steps to create your profile.
        </p>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shrink-0 transition-colors ${
                  i <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block truncate">
                {s}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-border" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-card rounded-xl shadow-card p-6 sm:p-8"
          >
            {step === 0 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">{steps[0]}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Registration Date</Label>
                    <Input value={currentDate} disabled className="mt-1.5 h-11 bg-muted" />
                  </div>
                  <div>
                    <Label>Full Name *</Label>
                    <Input value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} className="mt-1.5 h-11" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label>Gender *</Label>
                    <Select value={formData.gender} onValueChange={(v) => update("gender", v)}>
                      <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date of Birth *</Label>
                    <Input type="date" value={formData.dob} onChange={(e) => update("dob", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Marital Status</Label>
                    <Select value={formData.maritalStatus} onValueChange={(v) => update("maritalStatus", v)}>
                      <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Languages Known</Label>
                    <Input value={formData.languages} onChange={(e) => update("languages", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. English, Hindi" />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-semibold text-foreground">{steps[1]}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} className="mt-1.5 h-11" placeholder="your@email.com" />
                  </div>
                  <div>
                    <Label>Mobile Number *</Label>
                    <Input value={formData.mobile} onChange={(e) => update("mobile", e.target.value)} className="mt-1.5 h-11" placeholder="9876543210" />
                  </div>
                  <div>
                    <Label>Password *</Label>
                    <Input type="password" value={formData.password} onChange={(e) => update("password", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Confirm Password *</Label>
                    <Input type="password" value={formData.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Father's Mobile</Label>
                    <Input value={formData.fatherMobile} onChange={(e) => update("fatherMobile", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Highest Education</Label>
                    <Input value={formData.highestEducation} onChange={(e) => update("highestEducation", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. B.Tech" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Present Address</Label>
                    <Textarea value={formData.presentAddress} onChange={(e) => update("presentAddress", e.target.value)} className="mt-1.5" rows={2} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Permanent Address</Label>
                    <Textarea value={formData.permanentAddress} onChange={(e) => update("permanentAddress", e.target.value)} className="mt-1.5" rows={2} />
                  </div>
                  <div>
                    <Label>Last Company</Label>
                    <Input value={formData.lastCompany} onChange={(e) => update("lastCompany", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Current Designation</Label>
                    <Input value={formData.currentDesignation} onChange={(e) => update("currentDesignation", e.target.value)} className="mt-1.5 h-11" />
                  </div>
                  <div>
                    <Label>Total Experience</Label>
                    <Input value={formData.totalExperience} onChange={(e) => update("totalExperience", e.target.value)} className="mt-1.5 h-11" placeholder="e.g. 3 years" />
                  </div>
                  <div>
                    <Label>Last Salary</Label>
                    <Input value={formData.lastSalary} onChange={(e) => update("lastSalary", e.target.value)} className="mt-1.5 h-11" placeholder="₹" />
                  </div>
                  <div>
                    <Label>Expected Salary</Label>
                    <Input value={formData.expectedSalary} onChange={(e) => update("expectedSalary", e.target.value)} className="mt-1.5 h-11" placeholder="₹" />
                  </div>
                </div>

                {/* Resume Upload */}
                <div>
                  <Label>Upload Resume (PDF, DOC, DOCX — max 5MB)</Label>
                  <label className="mt-1.5 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 bg-surface cursor-pointer hover:border-primary/40 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {formData.resume ? formData.resume.name : "Click to upload resume"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && file.size > 5 * 1024 * 1024) {
                          toast.error("File must be under 5MB");
                          return;
                        }
                        update("resume", file || null);
                      }}
                    />
                  </label>
                  {formData.resume && (
                    <p className="mt-2 text-sm text-primary flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> {formData.resume.name}
                    </p>
                  )}
                </div>

                {/* Job Interests */}
                <div>
                  <Label>Job Interests</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {jobInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          formData.jobInterests.includes(interest)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-muted-foreground border-border hover:border-primary/40"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* References */}
                <div>
                  <Label className="text-base font-semibold">References</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Family Member Name</Label>
                      <Input value={formData.familyRefName} onChange={(e) => update("familyRefName", e.target.value)} className="mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Family Member Contact</Label>
                      <Input value={formData.familyRefContact} onChange={(e) => update("familyRefContact", e.target.value)} className="mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Close Friend Name</Label>
                      <Input value={formData.friendRefName} onChange={(e) => update("friendRefName", e.target.value)} className="mt-1 h-11" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Close Friend Contact</Label>
                      <Input value={formData.friendRefContact} onChange={(e) => update("friendRefContact", e.target.value)} className="mt-1 h-11" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">{steps[2]}</h2>
                <div className="bg-surface rounded-lg p-5 border border-border">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    I hereby declare that the information provided above is true and correct to the best of my knowledge and belief. I understand that any false statement may result in the rejection of my candidature.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="declaration"
                    checked={formData.declaration}
                    onCheckedChange={(c) => update("declaration", c === true)}
                  />
                  <Label htmlFor="declaration" className="text-sm leading-snug cursor-pointer">
                    I hereby declare the information provided is true and correct.
                  </Label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Date</Label>
                    <Input value={currentDate} disabled className="mt-1.5 h-11 bg-muted" />
                  </div>
                  <div>
                    <Label>Upload Signature</Label>
                    <label className="mt-1.5 flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-4 bg-surface cursor-pointer hover:border-primary/40 transition-colors">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formData.signature ? formData.signature.name : "Upload signature image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => update("signature", e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-5 border-t border-border">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < 2 ? (
                <Button onClick={next} className="gap-1">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={openTermsDialog} disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AlertDialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <AlertDialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
          <AlertDialogHeader>
            <AlertDialogTitle>Terms & Conditions</AlertDialogTitle>
            <AlertDialogDescription>
              Please read and accept the following terms and conditions to complete your registration.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="overflow-y-auto pr-1 space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-2">Hare Krishna Job Placement Terms & Conditions</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Our Membership fee is RS.200/-</li>
                <li>Membership Fee is Non Refundable.</li>
                <li>Membership Fee is valid for 1 Year Only.</li>
                <li>Membership Fee Will Be Renewable after 1 year.</li>
                <li>We can arrange the Interview for the Job but can not give guarantee for the selection.</li>
                <li>After getting the job, the candidate will have to give CTC (Cost To Company) 50% of his first fully month (30 Days included) salary.</li>
                <li>After getting the job once, the membership will be cancelled automatically.</li>
                <li>Every time new procedure will be held for every new job.</li>
                <li>In case of default in paying the agreed consulting fee to Hare Krishna Job Placement, I shall be liable to legal action and my job offer might be withdrawn.</li>
                <li>Registration will not be changed to any another person in any case.</li>
                <li>Subject to Gujarat Jurisdiction.</li>
              </ol>
            </div>

            <div className="rounded-lg border border-border bg-surface p-4 space-y-2">
              <p className="text-foreground font-medium">Date: {currentDate}</p>
              <p>By clicking "I Accept", you agree to all the terms and conditions mentioned above.</p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submit} disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "I Accept"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Register;
