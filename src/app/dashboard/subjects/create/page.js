"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ subjectName: "", subjectSlug: "", description: "" });

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm({ ...form, subjectName: name, subjectSlug: slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard/subjects");
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-6">
      <Card className="border-border bg-card shadow-2xl rounded-[32px] overflow-hidden">
        <CardHeader className="text-center pt-10">
          <BookOpen className="mx-auto h-10 w-10 text-primary mb-2" />
          <CardTitle className="text-2xl font-black uppercase italic">New Subject</CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Subject Name</Label>
              <Input 
                placeholder="e.g. Quantitative Aptitude" 
                value={form.subjectName} 
                onChange={handleNameChange} 
                className="h-12 bg-muted/50" 
                required 
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Registry Slug</Label>
              <div className="p-3 rounded-xl bg-muted font-mono text-xs opacity-70">
                {form.subjectSlug || "auto-generated-slug"}
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Create Subject</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}