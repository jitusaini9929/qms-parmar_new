"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function EditExamPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    examName: "",
    examYear: "",
    duration: "",
    totalMarks: "",
    status: ""
  });

  useEffect(() => {
    fetch(`/api/exams/${id}`).then(res => res.json()).then(data => {
      setFormData(data);
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/exams/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      toast.success("Exam Updated.")
      router.push(`/dashboard/exams/${id}`);
    }
    setSaving(false);
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="w-full py-12 px-6">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/exams")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-black tracking-tight uppercase italic">Modify Exam</h1>
      </div>

      <div className="rounded border p-4">
        <form onSubmit={handleUpdate} className="space-y-8">
          <div className="space-y-2">
            <Label className="font-black uppercase">Exam Name</Label>
            <Input value={formData.examName} onChange={(e) => setFormData({...formData, examName: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="font-black uppercase">Session Year</Label>
              <Input type="number" value={formData.examYear} onChange={(e) => setFormData({...formData, examYear: e.target.value})}  />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Visibility Status</Label>
              <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val})}>
                <SelectTrigger className="rounded">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                  <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Duration (Min)</Label>
              <Input type="number" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}/>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Total Marks</Label>
              <Input type="number" value={formData.totalMarks} onChange={(e) => setFormData({...formData, totalMarks: e.target.value})}/>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Save Exam</>}
          </Button>
        </form>
      </div>
    </div>
  );
}