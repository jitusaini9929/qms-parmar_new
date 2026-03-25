"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2, LayoutGrid, Type, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function EditBoardPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    boardName: "",
    boardShortName: "",
    status: "",
    description: "",
  });

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`/api/boards/${id}`);
        const data = await res.json();
        setFormData({
          boardName: data.boardName,
          boardShortName: data.boardShortName,
          status: data.status,
          description: data.description || "",
        });
      } catch (err) {
        console.error("Failed to fetch board");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await fetch(`/api/boards/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard/boards");
        toast.success("Board updated successfully");
      }
    } catch (err) {
      console.error("Update failed");
      toast.error("Failed to update board");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon"  onClick={() => router.push(`/dashboard/boards`)}className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Modify Board</h1>
          <p className="text-sm text-muted-foreground font-medium">Update organization settings for {formData.boardShortName}.</p>
        </div>
      </div>

      <Card className="borderbg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Configuration
          </CardTitle>
          <CardDescription>Adjust the public details and visibility of this board.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <Type className="h-3 w-3" /> Full Name
                </Label>
                <Input
                  value={formData.boardName}
                  onChange={(e) => setFormData({ ...formData, boardName: e.target.value })}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                   Short Name
                </Label>
                <Input
                  value={formData.boardShortName}
                  onChange={(e) => setFormData({ ...formData, boardShortName: e.target.value.toUpperCase() })}
                  className="bg-background/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Availability Status
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(val) => setFormData({ ...formData, status: val })}
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE (Visible)</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE (Hidden)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3 w-3" /> Description
              </Label>
              <Textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background/50"
              />
            </div>

            <Button type="submit" className="w-full h-11 shadow-lg font-bold uppercase tracking-widest text-xs" disabled={updating}>
              {updating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save System Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}