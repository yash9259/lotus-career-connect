import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockCandidate, type ExperienceEntry } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2, Building2 } from "lucide-react";

const DashboardExperience = () => {
  const [entries, setEntries] = useState<ExperienceEntry[]>(mockCandidate.experiences);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: "", designation: "", from: "", to: "", description: "" });

  const addEntry = () => {
    if (!form.company || !form.designation) {
      toast.error("Please fill required fields");
      return;
    }
    setEntries((prev) => [...prev, { id: `x${Date.now()}`, ...form }]);
    setForm({ company: "", designation: "", from: "", to: "", description: "" });
    setShowForm(false);
    toast.success("Experience added");
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Entry removed");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Work Experience</h1>
          <p className="text-sm text-muted-foreground">Manage your professional history</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl shadow-card p-6 mb-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Add Experience</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Company *</Label>
              <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Designation *</Label>
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">From</Label>
              <Input type="month" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="mt-1.5 h-11" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">To</Label>
              <Input type="month" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="mt-1.5 h-11" placeholder="Present" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5" rows={3} />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={addEntry}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground text-sm">No experience entries yet.</p>
        ) : entries.map((entry) => (
          <div key={entry.id} className="bg-card rounded-xl shadow-card p-5 flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent shrink-0">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{entry.designation}</h3>
              <p className="text-xs text-muted-foreground">{entry.company}</p>
              <p className="text-xs text-muted-foreground mt-1">{entry.from} — {entry.to}</p>
              {entry.description && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{entry.description}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} className="text-muted-foreground hover:text-destructive shrink-0">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardExperience;
