"use client";
import React, { useState, useEffect, use } from "react";
import { ArrowLeft, Plus, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CollectionSummaryPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/collections/${params.id}`)
      .then(res => res.json())
      .then(setData);
  }, [params.id]);

  if (!data) return <div className="p-10 text-center">Loading...</div>;
  console.log("API DATA =>", data);

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/collections"><Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-2xl font-bold">{data.title}</h1>
        </div>
        <Link href={`/dashboard/collections/${params.id}/addQuestions`}>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add/Manage Questions</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-muted/30 p-6 rounded-xl border h-fit space-y-4">
          <h3 className="font-bold border-b pb-2">Stats</h3>
          <div className="flex justify-between text-sm"><span>Total Marks:</span><b>{data.settings?.totalMarks}</b></div>
          <div className="flex justify-between text-sm"><span>Duration:</span><b>{data.settings?.totalDuration} min</b></div>
          <Link href={`/dashboard/collections/${params.id}/edit`} className="block pt-4">
            <Button variant="outline" className="w-full">Edit Settings</Button>
          </Link>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-widest">Question List</h2>
          <div className="border rounded-xl divide-y bg-card">
            {data.questions?.map((q, idx) => (
              <div key={q._id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground font-mono text-xs">{idx + 1}.</span>
                  <div>
                    <p className="text-sm font-medium line-clamp-1">{q.content?.en?.text || q.content?.hi?.text}</p>
                    <p className="text-[10px] text-primary uppercase font-bold">{q.code}</p>
                  </div>
                </div>
                <Link href={`/dashboard/questions/${q._id}/view`}>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            ))}
          </div>
        </div>
        

      </div>
    </div>
  );
}