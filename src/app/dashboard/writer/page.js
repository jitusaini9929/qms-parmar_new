"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PenLine,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Languages,
  Layers,
  Save,
  Building,
  GraduationCap,
  MessageSquareWarning,
  Plus,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LANGUAGE_OPTIONS, LANGUAGES } from "@/enums/language";
import { toast } from "sonner";

export default function WriterPage() {
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

  // Edit state
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch writer permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      setPermLoading(true);
      try {
        const res = await fetch("/api/writer-permissions");
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

  // Fetch rejected reviews
  const fetchReviews = useCallback(async () => {
    if (!selectedExam) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        examId: selectedExam,
        status: "REJECTED",
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
  }, [selectedExam, pagination.page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Reset page when exam changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedExam]);

  // Initialize edit data when a new question loads
  useEffect(() => {
    const currentReview = reviews[0];
    if (!currentReview?.question) {
      setEditData(null);
      return;
    }
    const q = currentReview.question;
    // Deep-clone question content for editing
    const contentClone = {};
    if (q.content) {
      const contentObj = q.content instanceof Map ? Object.fromEntries(q.content) : q.content;
      Object.keys(contentObj).forEach((lang) => {
        const langData = contentObj[lang];
        contentClone[lang] = {
          passage: langData.passage || "",
          text: langData.text || "",
          solution: langData.solution || "",
          description: langData.description || "",
          options: (langData.options || []).map((opt) => ({
            text: opt.text || "",
            correctOption: opt.correctOption || false,
          })),
        };
      });
    }
    setEditData({
      _id: q._id,
      content: contentClone,
    });
  }, [reviews]);

  // Edit handlers
  const updateField = (lang, field, value) => {
    setEditData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        [lang]: {
          ...prev.content[lang],
          [field]: value,
        },
      },
    }));
  };

  const updateOption = (lang, optIdx, field, value) => {
    setEditData((prev) => {
      const newContent = { ...prev.content };
      const langContent = { ...newContent[lang] };
      const options = [...langContent.options];
      options[optIdx] = { ...options[optIdx], [field]: value };

      // If setting correctOption to true, clear others
      if (field === "correctOption" && value === true) {
        options.forEach((opt, i) => {
          if (i !== optIdx) opt.correctOption = false;
        });
      }

      langContent.options = options;
      newContent[lang] = langContent;
      return { ...prev, content: newContent };
    });
  };

  const addOption = (lang) => {
    setEditData((prev) => {
      const newContent = { ...prev.content };
      const langContent = { ...newContent[lang] };
      langContent.options = [...langContent.options, { text: "", correctOption: false }];
      newContent[lang] = langContent;
      return { ...prev, content: newContent };
    });
  };

  const removeOption = (lang, optIdx) => {
    setEditData((prev) => {
      const newContent = { ...prev.content };
      const langContent = { ...newContent[lang] };
      langContent.options = langContent.options.filter((_, i) => i !== optIdx);
      newContent[lang] = langContent;
      return { ...prev, content: newContent };
    });
  };

  // Save handler
  const handleSave = async () => {
    if (!editData?._id) return;
    setSaving(true);
    try {
      // 1. Update the question
      const questionRes = await fetch(`/api/questions/${editData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editData.content }),
      });

      if (!questionRes.ok) {
        const data = await questionRes.json();
        toast.error(data.message || "Failed to update question");
        return;
      }

      // 2. Reset the review back to PENDING (removes from rejected queue)
      await fetch("/api/question-reviews", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: editData._id,
          status: "PENDING",
          comments: "",
        }),
      });

      toast.success("Question updated and sent back for review!");
      fetchReviews();
    } catch (error) {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const currentReview = reviews[0];
  const question = currentReview?.question;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <PenLine className="h-8 w-8 text-primary" />
          Rejected Questions
        </h1>
        <p className="text-muted-foreground mt-1">
          Edit rejected questions and send them back for review.
        </p>
      </div>

      {/* Filters */}
      <Card className="border bg-card/60">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {permissions
                  .filter((perm) => {
                    const board = perm.board;
                    return typeof board === "object" ? board.status === "ACTIVE" : true;
                  })
                  .map((perm) => {
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
          </div>
        </CardContent>
      </Card>

      {/* Content Panel */}
      {!selectedExam ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <PenLine className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Select a board and exam to view rejected questions
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Only questions rejected by reviewers will appear here.
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
            <PenLine className="h-12 w-12 text-emerald-500/30 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              No rejected questions
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              All questions in this exam have passed review or are pending! 🎉
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Rejection Comment */}
          {currentReview.comments && (
            <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MessageSquareWarning className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-rose-600 uppercase tracking-wide mb-1">
                      Rejection Reason
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-300 whitespace-pre-wrap">
                      {currentReview.comments}
                    </p>
                    {currentReview.reviewedBy && (
                      <p className="text-xs text-rose-400 mt-2">
                        — Reviewed by {currentReview.reviewedBy?.name || "Unknown"}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Question Info Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                {question.code || question._id?.slice(-8)}
              </span>
              <Badge className="bg-rose-500/10 text-rose-600 shadow-none">
                REJECTED
              </Badge>
              <span className="text-xs text-muted-foreground">
                Question {pagination.page} of {pagination.total}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {question.subject?.subjectName && (
                <Badge variant="secondary">{question.subject.subjectName}</Badge>
              )}
              {question.topic?.topicName && (
                <Badge variant="secondary">{question.topic.topicName}</Badge>
              )}
            </div>
          </div>

          {/* Editable Question Content */}
          {editData && (
            <Card>
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

                  {Object.keys(editData.content || {}).map((langCode) => (
                    <TabsContent
                      key={langCode}
                      value={langCode}
                      className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-2"
                    >
                      {/* Passage */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Passage / Context (Optional)
                        </Label>
                        <Textarea
                          placeholder="Enter passage or context text..."
                          value={editData.content[langCode]?.passage || ""}
                          onChange={(e) => updateField(langCode, "passage", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Question Text */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Question Text *
                        </Label>
                        <Textarea
                          placeholder="Enter question text..."
                          value={editData.content[langCode]?.text || ""}
                          onChange={(e) => updateField(langCode, "text", e.target.value)}
                          className="min-h-[100px] font-medium"
                        />
                      </div>

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase text-muted-foreground">
                            Options
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 text-xs"
                            onClick={() => addOption(langCode)}
                          >
                            <Plus className="h-3 w-3" /> Add Option
                          </Button>
                        </div>
                        {editData.content[langCode]?.options?.map((opt, idx) => (
                          <div
                            key={idx}
                            className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                              opt.correctOption
                                ? "bg-emerald-500/5 border-emerald-300 dark:border-emerald-800"
                                : "bg-background"
                            }`}
                          >
                            <div className="flex flex-col items-center gap-2 pt-2">
                              <span className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold ${
                                opt.correctOption
                                  ? "bg-emerald-500 text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <Checkbox
                                checked={opt.correctOption}
                                onCheckedChange={(checked) =>
                                  updateOption(langCode, idx, "correctOption", checked)
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <Input
                                placeholder={`Option ${String.fromCharCode(65 + idx)} text...`}
                                value={opt.text}
                                onChange={(e) =>
                                  updateOption(langCode, idx, "text", e.target.value)
                                }
                              />
                              <p className="text-[10px] text-muted-foreground mt-1">
                                {opt.correctOption ? "✓ Correct Answer" : "Check box to mark as correct"}
                              </p>
                            </div>
                            {editData.content[langCode].options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                                onClick={() => removeOption(langCode, idx)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Solution */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Solution (Optional)
                        </Label>
                        <Textarea
                          placeholder="Enter step-by-step solution..."
                          value={editData.content[langCode]?.solution || ""}
                          onChange={(e) => updateField(langCode, "solution", e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                          Additional Info (Optional)
                        </Label>
                        <Textarea
                          placeholder="Any additional information..."
                          value={editData.content[langCode]?.description || ""}
                          onChange={(e) => updateField(langCode, "description", e.target.value)}
                          className="min-h-[60px]"
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
              <span className="text-xs text-muted-foreground font-medium px-2">
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

            <Button
              className="gap-2 px-8"
              onClick={handleSave}
              disabled={saving || !editData}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save & Send for Review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
