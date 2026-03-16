import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockCandidate } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Pencil, Save, Users, UserCheck } from "lucide-react";

const DashboardReferences = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    familyName: mockCandidate.familyRefName,
    familyContact: mockCandidate.familyRefContact,
    friendName: mockCandidate.friendRefName,
    friendContact: mockCandidate.friendRefContact,
  });

  const handleSave = () => {
    setEditing(false);
    toast.success("References updated");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">References</h1>
          <p className="text-sm text-muted-foreground">Your reference contacts</p>
        </div>
        {editing ? (
          <Button size="sm" onClick={handleSave} className="gap-1.5">
            <Save className="h-4 w-4" /> Save
          </Button>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-1.5">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Family Member</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={form.familyName}
                onChange={(e) => setForm({ ...form, familyName: e.target.value })}
                disabled={!editing}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Contact Number</Label>
              <Input
                value={form.familyContact}
                onChange={(e) => setForm({ ...form, familyContact: e.target.value })}
                disabled={!editing}
                className="mt-1.5 h-11"
              />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <UserCheck className="h-5 w-5 text-accent-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Close Friend</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <Input
                value={form.friendName}
                onChange={(e) => setForm({ ...form, friendName: e.target.value })}
                disabled={!editing}
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Contact Number</Label>
              <Input
                value={form.friendContact}
                onChange={(e) => setForm({ ...form, friendContact: e.target.value })}
                disabled={!editing}
                className="mt-1.5 h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardReferences;
