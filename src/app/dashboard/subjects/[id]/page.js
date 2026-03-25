"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Book, Calendar, User, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ViewSubjectPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/subjects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubject(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() =>  router.push(`/dashboard/subjects`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Subject List
        </Button>
        <Button onClick={() => router.push(`/dashboard/subjects/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Subject
        </Button>
      </div>

      <Card className="border rounded-xl overflow-hidden">
        <CardContent className="sm:p-12">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Book className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">
              {subject.subjectName}
            </h1>
            <code className="text-[10px] bg-muted px-2 py-1 rounded font-mono text-primary">
              ID: {subject.subjectSlug}
            </code>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded bg-muted/50 border  space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Created On
              </p>
              <p className="font-bold">{new Date(subject.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="p-6 rounded bg-muted/50 border space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <User className="h-3 w-3" /> Created By
              </p>
              <p className="font-bold">{subject.createdBy?.name || "System"}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex items-center justify-between">
            <Badge variant={subject.status === "ACTIVE" ? "success" : "destructive"} className="rounded-full px-4">
              {subject.status}
            </Badge>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Verified Subject Entry</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}