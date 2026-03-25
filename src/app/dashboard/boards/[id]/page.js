"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Building2, Calendar, ShieldCheck, 
  Edit, Globe, FileText, Loader2, User as UserIcon 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ViewBoardPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await fetch(`/api/boards/${id}`);
        const data = await res.json();
        setBoard(data);
      } catch (err) {
        console.error("Failed to fetch board details");
      } finally {
        setLoading(false);
      }
    };
    fetchBoard();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
      </div>
    );
  }

  if (!board) return <div className="text-center py-10">Board not found.</div>;

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{board.boardShortName ?? "Board "} Details</h1>
            <p className="text-sm text-muted-foreground font-medium">Overview of the exam organizing body.</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/dashboard/boards/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Board
        </Button>
      </div>

        {/* --- MAIN INFO --- */}
        <Card className="md:col-span-2 border bg-card/50 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center gap-5 pb-2">
             <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <Building2 className="h-8 w-8" />
             </div>
             <div>
                <CardTitle className="text-2xl font-black tracking-tight">{board.boardName}</CardTitle>
                <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  ID: {board._id ?? board.boardSlug}
                </Badge>
             </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <FileText className="h-3 w-3" /> Description
              </h4>
              <p className="text-sm leading-relaxed text-foreground/80">
                {board.description || "No description provided for this board."}
              </p>
            </div>
            
            <Separator className="opacity-50" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Current Status</p>
                  <Badge className={board.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-600'}>
                    {board.status}
                  </Badge>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Visibility</p>
                  <div className="flex items-center gap-1.5 text-sm font-semibold">
                    <Globe className="h-3.5 w-3.5 text-blue-500" /> Publicly Accessible
                  </div>
               </div>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Creation Date</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <Calendar className="h-4 w-4 text-muted-foreground" /> {new Date(board.createdAt).toLocaleDateString()}
                    </div>
                </div>
                
                <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-tighter">Created By</p>
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <UserIcon className="h-4 w-4 text-muted-foreground" /> {board.createdBy?.name || "System Admin"}
                    </div>
                </div>                
            </div>
          </CardContent>
        </Card>
    </div>
  );
}