"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, LayoutGrid, Type, Link2, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Assuming you use sonner for notifications

export default function CreateBoardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    boardName: "",
    boardShortName: "",
    boardSlug: "",
    description: "",
  });

  // Auto-generate slug from name
  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, boardName: name, boardSlug: slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Board created successfully!");
        router.push("/dashboard/boards");
      } else {
        const error = await res.json();
        toast.error(error.message || "Failed to create board");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Board</h1>
          <p className="text-sm text-muted-foreground">Define a new exam organizer entity.</p>
        </div>
      </div>

      <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Board Information
          </CardTitle>
          <CardDescription>Enter the details for the exam organizing body.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Board Name */}
              <div className="space-y-2">
                <Label htmlFor="boardName" className="flex items-center gap-2">
                  <Type className="h-3.5 w-3.5" /> Full Name
                </Label>
                <Input
                  id="boardName"
                  placeholder="e.g. Staff Selection Commission"
                  value={formData.boardName}
                  onChange={handleNameChange}
                  required
                />
              </div>

              {/* Short Name */}
              <div className="space-y-2">
                <Label htmlFor="boardShortName" className="flex items-center gap-2">
                  <span className="font-bold text-[10px]">ABC</span> Short Name
                </Label>
                <Input
                  id="boardShortName"
                  placeholder="e.g. SSC"
                  value={formData.boardShortName}
                  onChange={(e) => setFormData({ ...formData, boardShortName: e.target.value.toUpperCase() })}
                  required
                />
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="boardSlug" className="flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5" /> Board Slug
              </Label>
              <div className="relative">
                <Input
                  id="boardSlug"
                  placeholder="staff-selection-commission"
                  value={formData.boardSlug}
                  onChange={(e) => setFormData({ ...formData, boardSlug: e.target.value })}
                  className="bg-muted/30 font-mono text-sm"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                   <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-50" />
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                This will be used in the URL: /exams/{formData.boardSlug || "..."}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" /> Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the board's purpose or jurisdiction..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <Button type="submit" className="w-full shadow-lg h-11 text-sm font-bold uppercase tracking-widest" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Finalize Board Creation"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}