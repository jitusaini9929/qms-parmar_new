"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function EditSubjectPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ subjectName: "", status: "", description: "" });

  useEffect(() => {
    fetch(`/api/subjects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          subjectName: data.subjectName,
          status: data.status,
          description: data.description || "",
        });
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/subjects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (res.ok){
      toast.success("Subject Updated.");
      router.push(`/dashboard/subjects/${id}`);
    } 
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="w-full">
      <Card className="border rounded-xl">
        <CardHeader >
          <CardTitle className="text-2xl font-black">Edit Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <Label>Subject Name</Label>
              <Input 
                value={form.subjectName} 
                onChange={(e) => setForm({ ...form, subjectName: e.target.value })} 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select value={form.status} onValueChange={(val) => setForm({ ...form, status: val })}>
                <SelectTrigger className="h-12 bg-muted/50 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin h-5 w-5" /> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}