"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Import,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ExamQuestionsPage({ params }) {
  const { id: examId } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShift, setSelectedShift] = useState("");

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1,
  });

  // Fetch exam details and shifts
  useEffect(() => {
    Promise.all([
      fetch(`/api/exams/${examId}`).then((r) => r.json()),
      fetch(`/api/shifts?examId=${examId}`).then((r) => r.json()),
    ]).then(([examData, shiftsData]) => {
      setExam(examData);
      setShifts(shiftsData.shifts || []);
    });
  }, [examId]);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        examId,
        shiftId: selectedShift,
        page: pagination.page,
        limit: pagination.limit,
      });
      const res = await fetch(`/api/questions?${params}`);
      const data = await res.json();
      setQuestions(data.questions || []);
      if (data.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch questions", error);
    } finally {
      setLoading(false);
    }
  }, [search, examId, selectedShift, pagination.page, pagination.limit]);

  useEffect(() => {
    const delay = setTimeout(() => fetchQuestions(), 400);
    return () => clearTimeout(delay);
  }, [fetchQuestions]);

  const handleDelete = async (qId) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const res = await fetch(`/api/questions/${qId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Question deleted");
        fetchQuestions();
      } else {
        toast.error("Failed to delete question");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").trim();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/exams")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {exam ? exam.examName : "Loading..."}
            </h1>
            <p className="text-muted-foreground text-sm">
              {exam
                ? `${exam.board?.boardShortName || ""} • ${exam.examYear} — ${pagination.total} questions`
                : "Loading exam details..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/questions/import`}>
            <Button className="gap-2" variant="outline">
              <Import className="h-4 w-4" /> Import
            </Button>
          </Link>
          <Link
            href={`/dashboard/questions/create?examId=${examId}${selectedShift ? `&shiftId=${selectedShift}` : ""}`}
          >
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Add Question
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by question code or text..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />
        </div>

        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={selectedShift}
          onChange={(e) => {
            setSelectedShift(e.target.value);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          <option value="">All Shifts</option>
          {shifts.map((sh) => (
            <option key={sh._id} value={sh._id}>
              {sh.shiftLabel}
            </option>
          ))}
        </select>
      </div>

      {/* Questions Table */}
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="p-4 w-[80px]">Code</th>
                <th className="p-4">Question</th>
                <th className="p-4">Shift</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Languages</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary/50" />
                  </td>
                </tr>
              ) : questions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-12 text-center text-muted-foreground"
                  >
                    No questions found for this exam.
                  </td>
                </tr>
              ) : (
                questions.map((q) => (
                  <tr
                    key={q._id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-mono text-[10px] text-primary font-bold uppercase">
                        {q.code}
                      </span>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="line-clamp-2 text-sm">
                        {stripHtml(q.content?.en?.text || q.content?.hi?.text)}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-[10px]">
                        {q.shift?.shiftLabel || "—"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-[10px]">
                        {q.subject?.subjectName || "—"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {q.availableLanguages?.map((l) => (
                        <Badge
                          key={l}
                          variant="secondary"
                          className="mr-1 uppercase text-[9px]"
                        >
                          {l}
                        </Badge>
                      ))}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          q.isActive
                            ? "bg-emerald-500/10 text-emerald-600 shadow-none"
                            : "bg-rose-500/10 text-rose-600 shadow-none"
                        }
                      >
                        {q.isActive ? "Active" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link href={`/dashboard/questions/${q._id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-600"
                          onClick={() => handleDelete(q._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 bg-muted/20 border-t">
          <div className="text-xs text-muted-foreground">
            Page <strong>{pagination.page}</strong> of{" "}
            <strong>{pagination.pages}</strong> •{" "}
            <strong>{pagination.total}</strong> total
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={pagination.page <= 1 || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={
                      pagination.page === pageNum ? "default" : "outline"
                    }
                    size="sm"
                    className="h-8 w-8 text-xs"
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, page: pageNum }))
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={pagination.page >= pagination.pages || loading}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
