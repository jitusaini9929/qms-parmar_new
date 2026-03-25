import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  BookOpen,
  Users,
  Target,
  Zap,
  Shield,
  Database,
  BarChart3,
  ArrowRight,
  Sparkles,
  Globe,
  Layers
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Multi-layered security with role-based access control (RBAC) and secure JWT session management.",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    icon: Users,
    title: "Unified User Roles",
    description: "Dedicated portals for SuperAdmins, Admins, and Students with granular permission levels.",
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    icon: Database,
    title: "Dynamic Question Bank",
    description: "Manage thousands of MCQ questions with real-time updates and categorization.",
    color: "text-green-500",
    bg: "bg-green-50"
  },
  {
    icon: Target,
    title: "Exam Intelligence",
    description: "Target specific difficulty levels and subjects to create balanced assessments.",
    color: "text-red-500",
    bg: "bg-red-50"
  },
  {
    icon: Globe,
    title: "Scalable Infrastructure",
    description: "Built on Next.js 15 and MongoDB for high-concurrency performance during exams.",
    color: "text-cyan-500",
    bg: "bg-cyan-50"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Visual insights into user progress, question success rates, and system logs.",
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50 dark:bg-slate-900">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-6 text-center">
          <Badge
            variant="outline"
            className="mb-6 py-1 px-4 border-primary/20 bg-primary/5 text-primary animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" />
            QMS v1.0 is now live
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            Manage Questions <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Without the Chaos.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one Question Management System for modern institutions.
            Secure, scalable, and built with Next.js & MongoDB.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="rounded-full px-8 h-14 text-lg shadow-xl shadow-blue-500/20"
              asChild
            >
              <Link href="/register">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="rounded-full px-8 h-14 text-lg"
              asChild
            >
              <Link href="/login">Sign In to Portal</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* --- STATS OVERLAY --- */}
      <div className="container mx-auto px-6 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl">
          {[
            { val: "10K+", lab: "MCQs Managed" },
            { val: "99.9%", lab: "Server Uptime" },
            { val: "500+", lab: "Institutions" },
            { val: "24/7", lab: "Support" },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center border-r last:border-0 border-slate-100 dark:border-slate-800"
            >
              <div className="text-3xl font-bold">{s.val}</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">
                {s.lab}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- FEATURES SECTION --- */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Comprehensive tools designed for scale and security.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((f, i) => (
              <Card
                key={i}
                className="border-none shadow-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group cursor-default"
              >
                <CardHeader>
                  <div
                    className={`w-14 h-14 rounded-2xl ${f.bg} dark:bg-opacity-20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                  >
                    <f.icon className={`w-7 h-7 ${f.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">
                    {f.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- BENTO / INTEGRATION SECTION --- */}
      <section className="py-24 bg-slate-900 dark:bg-black text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Built for Modern <br /> Exam Workflows
              </h2>
              <div className="space-y-6">
                {[
                  {
                    t: "Role-Based Logic",
                    d: "Automatic redirection for SuperAdmins, Admins, and Users.",
                  },
                  {
                    t: "API-First Architecture",
                    d: "Easily integrate with existing learning management systems.",
                  },
                  {
                    t: "Real-time Monitoring",
                    d: "Supervisors can track exam activity as it happens.",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-blue-500/20 p-1 rounded">
                      <CheckCircle2 className="text-blue-400 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.t}</h4>
                      <p className="text-slate-400 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-slate-800 dark:bg-slate-900 rounded-2xl p-8 border border-slate-700 dark:border-slate-800">
                <div className="flex gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-slate-700 rounded animate-pulse"></div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="h-20 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                      <Layers className="text-slate-500" />
                    </div>
                    <div className="h-20 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                      <Zap className="text-blue-500" />
                    </div>
                    <div className="h-20 bg-slate-700/50 rounded-xl border border-slate-600 flex items-center justify-center">
                      <Users className="text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">
            Ready to start?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Join institutional leaders in educational management.
          </p>
          <Button size="lg" className="rounded-full h-16 px-12 text-xl" asChild>
            <Link href="/login">Launch Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
