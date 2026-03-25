"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Clock, Calendar, Edit, 
  ShieldCheck, Loader2, Bookmark, Info 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ViewShiftPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [shift, setShift] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/shifts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setShift(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  if (!shift) return <div className="text-center py-20">Shift data not found.</div>;

  return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between px-2">
          <Button variant="ghost" onClick={() => router.back()} className="text-muted-foreground hover: gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Schedule
          </Button>
          <Button onClick={() => router.push(`/dashboard/shifts/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Shift
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border p-10 ">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <Badge variant="outline" className="border-primary/50 text-primary uppercase tracking-[0.2em] font-mono text-[10px] px-4 py-1">
              Terminal Log: {shift.shiftName}
            </Badge>
            <h1 className="text-4xl font-black tracking-tighter  uppercase italic">
              {shift.exam?.examName || "Independent Session"}
            </h1>
            <div className="flex items-center gap-2">
               <Badge className={shift.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/20 text-rose-400 border-rose-500/20'}>
                {shift.status}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
               <Calendar className="h-5 w-5 text-primary" />
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Scheduled Date</p>
               <p className="text-lg font-bold ">{new Date(shift.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-2">
               <Clock className="h-5 w-5 text-primary" />
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Start Time</p>
               <p className="text-lg font-bold ">{shift.startTime}</p>
            </div>
          </div>

          {shift.endTime && (
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center gap-3">
              <Info className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Session concludes at <span className=" font-bold">{shift.endTime}</span></p>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-center gap-4 text-muted-foreground">
             <ShieldCheck className="h-4 w-4 text-primary/50" />
             <p className="text-[10px] uppercase font-bold tracking-[0.2em]">Deployment Verified: ID-{shift._id.slice(-6)}</p>
          </div>
        </div>
      </div>
  );
}