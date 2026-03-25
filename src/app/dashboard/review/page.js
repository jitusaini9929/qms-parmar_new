"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  Languages,
  Layers,
  Send,
  Building,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { LANGUAGE_OPTIONS, LANGUAGES } from "@/enums/language";
import { toast } from "sonner";

export default function ReviewPage() {
  // Filter state
  const [permissions, setPermissions] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [availableExams, setAvailableExams] = useState([]);

  // Review state
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [permLoading, setPermLoading] = useState(true);

  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectComment, setRejectComment] = useState("");

  // Status filter
  const [statusFilter, setStatusFilter] = useState("PENDING");

  // Fetch reviewer permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      setPermLoading(true);
      try {
        const res = await fetch("/api/reviewer-permissions");
        const data = await res.json();
        setPermissions(data?.permissions || []);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      } finally {
        setPermLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  // Update available exams when board changes
  useEffect(() => {
    if (!selectedBoard) {
      setAvailableExams([]);
      setSelectedExam("");
      return;
    }
    const perm = permissions.find((p) => {
      const boardId = typeof p.board === "object" ? p.board._id : p.board;
      return boardId === selectedBoard;
    });
    setAvailableExams(perm?.exams || []);
    setSelectedExam("");
  }, [selectedBoard, permissions]);

  // Fetch reviews when exam or page or status changes
  const fetchReviews = useCallback(async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        examId: selectedExam,
        status: statusFilter,
        page: pagination.page,
        limit: 1,
      });
      const res = await fetch(`/api/question-reviews?${params}`);
      const data = await res.json();
      setReviews(data?.reviews || []);
      if (data?.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedExam, statusFilter, pagination.page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset page when exam or status changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedExam, statusFilter]);

  // Handle approve/reject
  const handleReview = async (status) => {
    const currentReview = reviews[0];
    if (!currentReview) return;

    if (status === "REJECTED" && !rejectComment.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/question-reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentReview.question._id,
          status,
          comments: status === "REJECTED" ? rejectComment : "",
        }),
      });

      if (res.ok) {
        toast.success(`Question ${status.toLowerCase()} successfully`);
        setShowRejectForm(false);
        setRejectComment("");
        // Refresh the current view
        fetchReviews();
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setActionLoading(false);
    }
  };

  const currentReview = reviews[0];
  const question = currentReview?.question;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardCheck className="h-8 w-8 text-primary" />
          Question Review
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and approve or reject questions assigned to you.
        </p>
      </div>

      {/* Filters */}
      <Card className="border bg-card/60">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Select Board */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" /> Select Board
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                disabled={permLoading}
              >
                <option value="">
                  {permLoading ? "Loading..." : "— Choose a board —"}
                </option>
                {permissions.map((perm) => {
                  const board = perm.board;
                  const boardId = typeof board === "object" ? board._id : board;
                  const boardName =
                    typeof board === "object"
                      ? `${board.boardName} (${board.boardShortName})`
                      : boardId;
                  return (
                    <option key={boardId} value={boardId}>
                      {boardName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Select Exam */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" /> Select Exam
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                disabled={!selectedBoard || availableExams.length === 0}
              >
                <option value="">
                  {!selectedBoard
                    ? "Select a board first"
                    : availableExams.length === 0
                    ? "No exams available"
                    : "— Choose an exam —"}
                </option>
                {availableExams.map((exam) => {
                  const examId = typeof exam === "object" ? exam._id : exam;
                  const examName =
                    typeof exam === "object"
                      ? `${exam.examName} (${exam.examYear})`
                      : examId;
                  return (
                    <option key={examId} value={examId}>
                      {examName}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Filter by Status
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Review Panel */}
      {!selectedExam ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Select a board and exam to start reviewing questions
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Questions will appear here one at a time for your review.
            </p>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading question...</span>
          </CardContent>
        </Card>
      ) : !question ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No questions to review
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              {statusFilter === "PENDING"
                ? "All questions have been reviewed! 🎉"
                : `No ${statusFilter.toLowerCase()} questions found.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                        {question.code || question._id?.slice(-8)}
                      </span>
                      <Badge
                        className={
                          currentReview.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-600 shadow-none"
                            : currentReview.status === "REJECTED"
                            ? "bg-rose-500/10 text-rose-600 shadow-none"
                            : "bg-amber-500/10 text-amber-600 shadow-none"
                        }
                      >
                        {currentReview.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Question {pagination.page} of {pagination.total}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue={question.availableLanguages?.[0] || LANGUAGES.ENGLISH}>
                  <TabsList className="flex w-full overflow-x-auto bg-muted/50 p-1 mb-6">
                    {LANGUAGE_OPTIONS.filter((l) =>
                      question.availableLanguages?.includes(l.code)
                    ).map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code} className="flex-1 gap-2">
                        <Languages className="h-3 w-3" /> {lang.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.keys(question.content || {}).map((langCode) => (
                    <TabsContent
                      key={langCode}
                      value={langCode}
                      className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2"
                    >
                      {/* Passage */}
                      {question.content[langCode]?.passage && (
                        <div className="bg-muted/30 border-l-4 border-primary p-6 rounded-r-lg">
                          <h4 className="text-xs font-bold uppercase text-primary mb-2">
                            Passage / Context
                          </h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {question.content[langCode].passage}
                          </p>
                        </div>
                      )}

                      {/* Question Text */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground">
                          Question
                        </h4>
                        <p className="text-xl font-medium leading-snug">
                          {question.content[langCode]?.text}
                        </p>
                      </div>

                      {/* Options */}
                      <div className="grid gap-3">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground mb-1">
                          Options
                        </h4>
                        {question.content[langCode]?.options?.map((opt, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                              opt.correctOption
                                ? "bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500"
                                : "bg-background border-border"
                            }`}
                          >
                            <div
                              className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0 mt-0.5 ${
                                opt.correctOption
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <p className="text-sm font-medium">{opt.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Solution */}
                      {(question.content[langCode]?.solution ||
                        question.content[langCode]?.description) && (
                        <div className="pt-6 border-t space-y-4">
                          {question.content[langCode]?.solution && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase text-emerald-600">
                                Step-by-step Solution
                              </h4>
                              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg text-sm border border-emerald-100 dark:border-emerald-900/30 whitespace-pre-wrap">
                                {question.content[langCode].solution}
                              </div>
                            </div>
                          )}
                          {question.content[langCode]?.description && (
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold uppercase text-blue-600">
                                Additional Information
                              </h4>
                              <p className="text-sm text-muted-foreground italic">
                                {question.content[langCode].description}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Actions & Metadata */}
          <div className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase text-primary/70 tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Question Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Exam
                  </span>
                  <span className="text-sm font-medium">
                    {question.exam?.examName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Subject
                  </span>
                  <span className="text-sm font-medium">
                    {question.subject?.subjectName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Topic
                  </span>
                  <span className="text-sm font-medium">
                    {question.topic?.topicName || "N/A"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    Languages
                  </span>
                  <div className="flex gap-1 mt-1">
                    {question.availableLanguages?.map((l) => (
                      <Badge
                        key={l}
                        variant="secondary"
                        className="text-[9px] uppercase"
                      >
                        {l}
                      </Badge>
                    ))}
                  </div>
                </div>
                {currentReview.reviewedBy && (
                  <div className="flex flex-col border-t pt-3">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Reviewed By
                    </span>
                    <span className="text-sm font-medium">
                      {currentReview.reviewedBy?.name || "—"}
                    </span>
                  </div>
                )}
                {currentReview.comments && (
                  <div className="flex flex-col border-t pt-3">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      Comments
                    </span>
                    <p className="text-sm text-muted-foreground italic mt-1">
                      {currentReview.comments}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Review Actions */}
            {currentReview.status === "PENDING" && (
              <Card className="border-primary/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm uppercase text-primary/70 tracking-wider flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" /> Review Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleReview("APPROVED")}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Approve Question
                  </Button>

                  {!showRejectForm ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2 border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      onClick={() => setShowRejectForm(true)}
                      disabled={actionLoading}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Question
                    </Button>
                  ) : (
                    <div className="space-y-3 p-4 rounded-lg border border-rose-200 bg-rose-50/50 dark:bg-rose-950/10">
                      <label className="text-xs font-bold uppercase text-rose-600 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" /> Reason for
                        Rejection
                      </label>
                      <Textarea
                        placeholder="Please explain why this question is being rejected..."
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        className="min-h-[100px] border-rose-200 focus-visible:ring-rose-300"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectComment("");
                          }}
                          disabled={actionLoading}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="gap-2 bg-rose-600 hover:bg-rose-700 text-white"
                          onClick={() => handleReview("REJECTED")}
                          disabled={actionLoading || !rejectComment.trim()}
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                          Submit Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1 || loading}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <span className="text-xs text-muted-foreground font-medium">
                {pagination.page} / {pagination.pages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page >= pagination.pages || loading}
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
