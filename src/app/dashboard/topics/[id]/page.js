"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, GitBranch, GitMerge, Layout, ShieldCheck, Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ViewTopicPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [topic, setTopic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/topics/${id}`).then(res => res.json()).then(data => {
      setTopic(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  const isSubjectInactive = topic.subject?.status === "INACTIVE";
const isParentInactive = topic.parent?.status === "INACTIVE";
const isSystemDisabled = isSubjectInactive || isParentInactive;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
        <Button onClick={() => router.push(`/dashboard/topics/${id}/edit`)}><Edit className="mr-2 h-4 w-4" /> Edit Topic</Button>
      </div>

{isSystemDisabled && (
  <div className="flex items-start gap-3 p-4 border rounded-2xl bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400">
    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />

    <p className="text-xs font-bold uppercase tracking-tight leading-relaxed">
      System Override: This topic is inactive because the{" "}
      <span className="inline-flex items-center gap-1">
        {isSubjectInactive ? "Subject" : "Parent Topic"}

        <Link
          href={
            isSubjectInactive
              ? `/dashboard/subjects/${topic.subject._id}`
              : `/dashboard/topics/${topic.parent._id}`
          }
          className="inline-flex items-center gap-1 underline decoration-2 underline-offset-4 hover:text-primary transition-colors"
        >
          {isSubjectInactive
            ? topic.subject.subjectName
            : topic.parent.topicName}
          <ExternalLink className="h-4 w-4" />
        </Link>
      </span>{" "}
      is currently set to <span className="font-extrabold">INACTIVE</span>.
    </p>
  </div>
)}


      <Card className="border-border bg-card shadow-2xl rounded-[32px] overflow-hidden">
        <CardContent className="p-12">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 border border-primary/20">
              {topic.parent ? <GitMerge className="h-8 w-8" /> : <GitBranch className="h-8 w-8" />}
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic text-foreground">{topic.topicName}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><Layout className="h-3 w-3" /> Subject</p>
              <p className="font-bold text-lg">{topic.subject?.subjectName}</p>
            </div>
            <div className="p-6 rounded-2xl bg-muted/50 border border-border space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2"><GitMerge className="h-3 w-3" /> Structure</p>
              <p className="font-bold text-lg">{topic.parent ? "Nested Sub-Topic" : "Primary Topic"}</p>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex items-center justify-between">
            <div className="flex flex-col items-end gap-1">
                <Badge className={isSystemDisabled ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}>
                    {isSystemDisabled ? "SYSTEM INACTIVE" : topic.status}
                </Badge>
                <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest">
                    Self Status: {topic.status}
                </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary/60" /><span className="text-[10px] font-bold uppercase tracking-tighter">Verified Node</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}