"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileJson,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Download,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import mammoth from "mammoth";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";

export default function ImportQuestionsPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // Hierarchy States
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [topics, setTopics] = useState([]);
  const [languagesInFile, setLanguagesInFile] = useState([]);
  const [config, setConfig] = useState({
    exam: "",
    shift: "",
    subject: "",
    topic: "",
    createCollection: false,
    collectionTitle: "",
  });

  useEffect(() => {
    fetch("/api/exams")
      .then((res) => res.json())
      .then((data) => setExams(data.exams || []));
    fetch("/api/subjects")
      .then((res) => res.json())
      .then((data) => setSubjects(data.subjects || []));
  }, []);

  const handleHierarchyChange = async (name, value) => {
    setConfig((prev) => ({ ...prev, [name]: value }));
    if (name === "exam") {
      const res = await fetch(`/api/shifts?examId=${value}`);
      const data = await res.json();
      setShifts(data.shifts || []);
    }
    if (name === "subject") {
      const res = await fetch(`/api/topics?subjectId=${value}`);
      const data = await res.json();
      setTopics(data.topics || []);
    }
  };

  // --- FILE PARSERS ---
  const processWordFile = async (arrayBuffer) => {
    const result = await mammoth.convertToHtml({ arrayBuffer });
    const parser = new DOMParser();
    const doc = parser.parseFromString(result.value, "text/html");
    const tables = doc.querySelectorAll("table");

    const questions = Array.from(tables).map((table) => {
      const data = {};
      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => {
        const key = row.cells[0]?.innerText?.toLowerCase().trim();
        const value = row.cells[1]?.innerText?.trim();
        if (key && value) data[key] = value;
      });
      return formatRawToModel(data);
    });
    setParsedData(questions);
  };

  const formatRawToModel = (raw) => {
    // Basic logic to map table keys to our LanguageContentSchema
    // Supports 'text', 'option1', 'option2', 'correct'
    return {
      content: {
        en: {
          text: raw.text || raw.question,
          passage: raw.passage || "",
          solution: raw.solution || "",
          options: [
            { text: raw.option1, correctOption: raw.correct === "1" },
            { text: raw.option2, correctOption: raw.correct === "2" },
            { text: raw.option3, correctOption: raw.correct === "3" },
            { text: raw.option4, correctOption: raw.correct === "4" },
          ],
        },
      },
    };
  };

  // ... inside your handleFileChange ...
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (selectedFile.name.endsWith(".json")) {
          const data = JSON.parse(event.target.result);

          // Detect languages in JSON to show in summary
          const detectedLangs = new Set();
          data.forEach((q) => {
            if (q.content)
              Object.keys(q.content).forEach((l) => detectedLangs.add(l));
          });

          setParsedData(data);
          setLanguagesInFile(Array.from(detectedLangs) || []);
        } else {
          await processWordFile(event.target.result);
        }
      } catch (err) {
        alert("Error parsing file: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedFile.name.endsWith(".json")) reader.readAsText(selectedFile);
    else reader.readAsArrayBuffer(selectedFile);
  };

  const handleImport = async () => {
    setImporting(true);
    try {
      const payload = {
        questions: parsedData,
        hierarchy: {
          exam: config.exam,
          shift: config.shift,
          subject: config.subject,
          topic: config.topic,
        },
        collection: config.createCollection
          ? { title: config.collectionTitle }
          : null,
      };

      const res = await fetch("/api/questions/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) router.push("/dashboard/questions");
      toast.success("Questions imported successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="w-full mx-auto space-y-6 pb-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/questions">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold">Import Questions</h1>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="gap-2 text-primary justify-start sm:justify-center"
            onClick={() => window.open("/questions/demo-import.docx")}
          >
            <FileText className="h-4 w-4" />
            <span className="sm:inline">Demo Word File</span>
          </Button>

          <Button
            variant="ghost"
            className="gap-2 text-primary justify-start sm:justify-center"
            onClick={() => window.open("/questions/demo-import.json")}
          >
            <FileJson className="h-4 w-4" />
            <span className="sm:inline">Demo JSON File</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* File Upload Area */}
          <Card className="border-dashed border-2">
            <CardContent className="pt-10 pb-10 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  JSON or DOCX (Tables)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                id="fileInput"
                onChange={handleFileChange}
                accept=".json,.docx"
              />
              <Button
                onClick={() => document.getElementById("fileInput").click()}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Select File"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Summary Section */}
          {parsedData.length > 0 && (
            <Card className="bg-muted/30 border-dashed border-border transition-colors duration-300">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Ready to Import
                  </h3>
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {file?.name}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {/* Count Metric */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Total Questions
                    </p>
                    <p className="text-3xl font-extrabold text-foreground tabular-nums">
                      {parsedData.length}
                    </p>
                  </div>

                  {/* Language Metric */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Languages Found
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {languagesInFile.length > 0 ? (
                        languagesInFile.map((l) => (
                          <Badge
                            key={l}
                            variant="outline"
                            className="uppercase bg-background/50 border-primary/20 text-primary font-bold px-2 py-0"
                          >
                            {l}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-destructive">
                          None detected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Metric */}
                  <div className="hidden sm:block space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      Status
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-medium text-foreground">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning if no languages are found */}
                {languagesInFile.length === 0 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs italic">
                    <AlertCircle className="h-3 w-3" />
                    No valid language content map found. Please check your JSON
                    format.
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: Global Defaults */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Default Hierarchy for Questions
              </h3>

              {/* Exam Select */}
              <div className="space-y-1.5">
                <Label>Exam<span className="text-xs text-gray-500">(Required for Auto Shift Create)</span></Label>
                <Select
                  value={config.exam}
                  onValueChange={(val) => handleHierarchyChange("exam", val)}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Exam</SelectItem>
                    {exams.map((ex) => (
                      <SelectItem key={ex._id} value={ex._id}>
                        {ex.examName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Shift Select */}
              <div className="space-y-1.5">
                <Label>Shift</Label>
                <Select
                  value={config.shift}
                  onValueChange={(val) => handleHierarchyChange("shift", val)}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Shift</SelectItem>
                    {shifts.map((sh) => (
                      <SelectItem key={sh._id} value={sh._id}>
                        {sh.shiftName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject Select */}
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select
                  value={config.subject}
                  onValueChange={(val) => handleHierarchyChange("subject", val)}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Subject</SelectItem>
                    {subjects.map((s) => (
                      <SelectItem key={s._id} value={s._id}>
                        {s.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Topic Select */}
              <div className="space-y-1.5">
                <Label>Topic</Label>
                <Select
                  value={config.topic}
                  onValueChange={(val) => handleHierarchyChange("topic", val)}
                >
                  <SelectTrigger className="w-full bg-background border-input">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Topic</SelectItem>
                    {topics.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        {t.topicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="coll"
                    checked={config.createCollection}
                    onCheckedChange={(val) =>
                      setConfig({ ...config, createCollection: val })
                    }
                  />
                  <Label
                    htmlFor="coll"
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Create Collection from Import
                  </Label>
                </div>
                {config.createCollection && (
                  <Input
                    placeholder="Collection Name"
                    value={config.collectionTitle}
                    onChange={(e) =>
                      setConfig({ ...config, collectionTitle: e.target.value })
                    }
                  />
                )}
              </div>

              <Button
                className="w-full mt-4 h-12"
                variant="default"
                disabled={parsedData.length === 0 || importing}
                onClick={handleImport}
              >
                {importing ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Confirm Import
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* End of Sidebar */}
      </div>
    </div>
  );
}
