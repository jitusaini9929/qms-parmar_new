"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Plus, Layout } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [boards, setBoards] = useState([]);
  
  // State matched exactly to your Exam Model
  const [form, setForm] = useState({
    examName: "",
    examYear: new Date().getFullYear(),
    examSlug: "",
    duration: 60,
    totalMarks: 100,
    board: "", // Reference to Board ID
    status: "DRAFT",
  });

  useEffect(() => {
    // Fetch Boards (Organizers) instead of Organisations
    fetch("/api/boards")
      .then(res => res.json())
      .then(data => setBoards(data.boards || []));
  }, []);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    setForm({ ...form, examName: name, examSlug: slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      router.push(`/dashboard/exams/${data._id}`);
    } else {
      alert("Failed to create exam. Ensure slug is unique.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Registry
      </Button>

      <Card className="border-white/10 shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-1 bg-primary/50 w-full" />
        <CardHeader>
          <CardTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" /> Initialize Exam
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Board Selection */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Organizing Board</Label>
              <Select onValueChange={(val) => setForm({ ...form, board: val })} required>
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                  <SelectValue placeholder="Select Board (SSC, IBPS, RSSB...)" />
                </SelectTrigger>
                <SelectContent>
                  {boards.map((b) => (
                    <SelectItem key={b._id} value={b._id}>{b.boardShortName} - {b.boardName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Exam Name */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Exam Name</Label>
                <Input 
                  value={form.examName} 
                  onChange={handleNameChange} 
                  placeholder="Combined Graduate Level"
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                  required 
                />
              </div>
              {/* Year */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Year</Label>
                <Input 
                  type="number" 
                  value={form.examYear} 
                  onChange={(e) => setForm({ ...form, examYear: parseInt(e.target.value) })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                  required 
                />
              </div>
            </div>

            {/* Registry Slug */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Registry Slug</Label>
              <div className="p-3 rounded-xl bg-primary/5 border border-dashed border-primary/20 font-mono text-[11px] text-primary/80">
                /exams/{form.examSlug || "..."}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Duration */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Duration (Minutes)</Label>
                <Input 
                  type="number" 
                  value={form.duration} 
                  onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                  required 
                />
              </div>
              {/* Total Marks */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total Marks</Label>
                <Input 
                  type="number" 
                  value={form.totalMarks} 
                  onChange={(e) => setForm({ ...form, totalMarks: parseInt(e.target.value) })}
                  className="h-12 bg-white/5 border-white/10 rounded-xl"
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em] bg-white text-black hover:bg-primary hover:text-white transition-all shadow-xl" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-4 w-4" /> Create Exam</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}