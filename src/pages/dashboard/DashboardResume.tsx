import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockCandidate } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, FileText, Trash2, CheckCircle2, Download } from "lucide-react";

interface ResumeFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  isActive: boolean;
}

const DashboardResume = () => {
  const [resumes, setResumes] = useState<ResumeFile[]>([
    {
      id: "r1",
      name: mockCandidate.resumeFileName,
      size: "245 KB",
      uploadedAt: "2026-03-01",
      isActive: true,
    },
  ]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB");
      return;
    }
    const newResume: ResumeFile = {
      id: `r${Date.now()}`,
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
      uploadedAt: new Date().toISOString().split("T")[0],
      isActive: false,
    };
    setResumes((prev) => [...prev, newResume]);
    toast.success("Resume uploaded successfully");
  };

  const setActive = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => ({ ...r, isActive: r.id === id }))
    );
    toast.success("Active resume updated");
  };

  const removeResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
    toast.success("Resume removed");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Resume Manager</h1>
          <p className="text-sm text-muted-foreground">Upload and manage your resumes</p>
        </div>
      </div>

      {/* Upload area */}
      <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 bg-surface cursor-pointer hover:border-primary/40 transition-colors mb-6">
        <Upload className="h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground">Click to upload resume</p>
        <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX — max 5MB</p>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {/* Resume list */}
      <div className="space-y-3">
        {resumes.map((resume) => (
          <div
            key={resume.id}
            className={`bg-card rounded-xl shadow-card p-5 flex items-center gap-4 ${
              resume.isActive ? "ring-2 ring-primary/20" : ""
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shrink-0">
              <FileText className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-foreground truncate">{resume.name}</h3>
                {resume.isActive && (
                  <span className="flex items-center gap-1 text-xs text-primary font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{resume.size} · Uploaded {resume.uploadedAt}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              {!resume.isActive && (
                <Button variant="outline" size="sm" onClick={() => setActive(resume.id)}>
                  Set Active
                </Button>
              )}
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => removeResume(resume.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardResume;
