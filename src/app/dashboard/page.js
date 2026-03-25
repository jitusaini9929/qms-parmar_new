"use client";

import React, { useState, useEffect } from "react";
import { 
  Database, Layers, GraduationCap, BookOpen, 
  Plus, ArrowUpRight, CheckCircle, Clock, BarChart3, Building
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalCollections: 0,
    totalExams: 0,
    totalSubjects: 0,
    recentQuestions: [],
    recentCollections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch aggregated dashboard data
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-muted-foreground text-lg animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (stats?.role === "REVIEWER") {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reviewer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here is a summary of your assigned responsibilities.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
            <Link href="/dashboard/review">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Boards</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalBoards || 0}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 text-blue-500`}>
                  <Building className="h-6 w-6" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
            <Link href="/dashboard/review">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Exams</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalExams || 0}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 text-purple-500`}>
                  <GraduationCap className="h-6 w-6" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    );
  }
  if (stats?.role === "CONTENT_WRITER") {
    return (
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Writer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here is a summary of your assigned responsibilities.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
            <Link href="/dashboard/writer">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Boards</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalBoards || 0}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 text-blue-500`}>
                  <Building className="h-6 w-6" />
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
            <Link href="/dashboard/writer">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Assigned Exams</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.totalExams || 0}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 text-purple-500`}>
                  <GraduationCap className="h-6 w-6" />
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: "Questions", value: stats.totalQuestions, icon: Database, color: "text-blue-500", link: "/dashboard/questions" },
    { title: "Collections", value: stats.totalCollections, icon: Layers, color: "text-emerald-500", link: "/dashboard/collections" },
    { title: "Exams", value: stats.totalExams, icon: GraduationCap, color: "text-purple-500", link: "/dashboard/exams" },
    { title: "Subjects", value: stats.totalSubjects, icon: BookOpen, color: "text-orange-500", link: "/dashboard/subjects" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here is what&apos;s happening in your question bank.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/questions/import">
            <Button variant="outline" className="gap-2"><Plus className="h-4 w-4" /> Import Question</Button>
          </Link>
          <Link href="/dashboard/questions/create">
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Question</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer border-border/60">
            <Link href={stat.link}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{loading ? "..." : stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-muted/50 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Collections (Mock Tests) */}
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Collections</CardTitle>
              <CardDescription>Latest mock tests and practice sets created.</CardDescription>
            </div>
            <Link href="/dashboard/collections">
              <Button variant="ghost" size="sm" className="text-primary">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentCollections.map((col) => (
                <div key={col._id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/10 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{col.title}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{col.category} • {col.questions?.length || 0} Questions</p>
                    </div>
                  </div>
                  <Link href={`/dashboard/collections/${col._id}`}>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Question Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Questions</CardTitle>
            <CardDescription>Recently added to the bank.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {stats.recentQuestions.map((q) => (
                <div key={q._id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-mono font-bold text-primary">{q.code}</p>
                    <p className="text-sm line-clamp-2 leading-snug">
                      {q.content?.en?.text || q.content?.hi?.text}
                    </p>
                    <div className="flex gap-2 pt-1">
                       <Badge variant="secondary" className="text-[9px] uppercase">{q.difficulty || 'Medium'}</Badge>
                       <span className="text-[10px] text-muted-foreground">
                         {new Date(q.createdAt).toLocaleDateString()}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}