"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Building, GraduationCap } from "lucide-react";

export default function ManagePermissionsDialog({ open, onOpenChange, user }) {
  const [boards, setBoards] = useState([]);
  const [examsByBoard, setExamsByBoard] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch boards, exams, and existing permissions when dialog opens
  useEffect(() => {
    if (!open || !user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch boards, exams, and existing permissions in parallel
        const [boardsRes, examsRes, permsRes] = await Promise.all([
          fetch("/api/boards"),
          fetch("/api/exams"),
          fetch(`/api/reviewer-permissions?reviewerId=${user._id}`),
        ]);

        const boardsData = await boardsRes.json();
        const examsData = await examsRes.json();
        const permsData = await permsRes.json();

        const boardsList = boardsData?.boards || boardsData || [];
        setBoards(boardsList);

        // Group exams by board
        const examsList = examsData?.exams || examsData || [];
        const grouped = {};
        examsList.forEach((exam) => {
          const boardId =
            typeof exam.board === "object" ? exam.board._id : exam.board;
          if (!grouped[boardId]) grouped[boardId] = [];
          grouped[boardId].push(exam);
        });
        setExamsByBoard(grouped);

        // Build selected state from existing permissions
        const selected = {};
        (permsData?.permissions || []).forEach((perm) => {
          const boardId =
            typeof perm.board === "object" ? perm.board._id : perm.board;
          selected[boardId] = (perm.exams || []).map((e) =>
            typeof e === "object" ? e._id : e
          );
        });
        setSelectedPermissions(selected);
      } catch (error) {
        console.error("Failed to fetch permission data:", error);
        toast.error("Failed to load permission data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, user?._id]);

  const toggleBoard = (boardId) => {
    setSelectedPermissions((prev) => {
      const copy = { ...prev };
      if (copy[boardId]) {
        delete copy[boardId];
      } else {
        // Select the board with no exams initially
        copy[boardId] = [];
      }
      return copy;
    });
  };

  const toggleExam = (boardId, examId) => {
    setSelectedPermissions((prev) => {
      const copy = { ...prev };
      if (!copy[boardId]) copy[boardId] = [];

      const exams = [...copy[boardId]];
      const idx = exams.indexOf(examId);
      if (idx >= 0) {
        exams.splice(idx, 1);
      } else {
        exams.push(examId);
      }
      copy[boardId] = exams;
      return copy;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const permissions = Object.entries(selectedPermissions)
        .filter(([_, exams]) => exams.length > 0)
        .map(([board, exams]) => ({ board, exams }));

      const res = await fetch("/api/reviewer-permissions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerId: user._id,
          permissions,
        }),
      });

      if (res.ok) {
        toast.success("Permissions updated successfully");
        onOpenChange(false);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to update permissions");
      }
    } catch (error) {
      console.error("Save permissions error:", error);
      toast.error("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Manage Permissions
          </DialogTitle>
          <DialogDescription>
            Assign board and exam access for{" "}
            <span className="font-semibold text-foreground">{user?.name}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : boards.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No boards available. Create boards first.
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {boards.map((board) => {
              const boardId = board._id;
              const isSelected = boardId in selectedPermissions;
              const boardExams = examsByBoard[boardId] || [];

              return (
                <div
                  key={boardId}
                  className="rounded-xl border bg-card p-4 space-y-3"
                >
                  {/* Board checkbox */}
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`board-${boardId}`}
                      checked={isSelected}
                      onCheckedChange={() => toggleBoard(boardId)}
                    />
                    <Label
                      htmlFor={`board-${boardId}`}
                      className="flex items-center gap-2 cursor-pointer font-semibold text-sm"
                    >
                      <Building className="h-4 w-4 text-blue-500" />
                      {board.boardName}
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-bold"
                      >
                        {board.boardShortName}
                      </Badge>
                    </Label>
                  </div>

                  {/* Exams under this board (shown only when board is selected) */}
                  {isSelected && (
                    <div className="ml-8 space-y-2 border-l-2 border-primary/20 pl-4">
                      {boardExams.length === 0 ? (
                        <p className="text-xs text-muted-foreground italic">
                          No exams under this board yet.
                        </p>
                      ) : (
                        boardExams.map((exam) => {
                          const examId = exam._id;
                          const isExamSelected = (
                            selectedPermissions[boardId] || []
                          ).includes(examId);

                          return (
                            <div
                              key={examId}
                              className="flex items-center gap-3"
                            >
                              <Checkbox
                                id={`exam-${examId}`}
                                checked={isExamSelected}
                                onCheckedChange={() =>
                                  toggleExam(boardId, examId)
                                }
                              />
                              <Label
                                htmlFor={`exam-${examId}`}
                                className="flex items-center gap-2 cursor-pointer text-sm"
                              >
                                <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
                                {exam.examName}
                                <span className="text-xs text-muted-foreground">
                                  ({exam.examYear})
                                </span>
                              </Label>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Permissions"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
