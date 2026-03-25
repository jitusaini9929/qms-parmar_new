"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileJson,
  FileText,
  Settings,
  CheckCircle2,
  Languages,
  Eye,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LANGUAGE_OPTIONS } from "@/enums/language";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export default function ExportCollectionPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [exportConfig, setExportConfig] = useState({
    fileFormat: "json",
    contentMode: "full",
    selectedLanguages: ["en"], // Array for multi-language support
  });

  useEffect(() => {
    fetch(`/api/collections/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCollection(data);
        setLoading(false);
      });
  }, [params.id]);

  const toggleLanguage = (langCode) => {
    setExportConfig((prev) => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(langCode)
        ? prev.selectedLanguages.filter((l) => l !== langCode)
        : [...prev.selectedLanguages, langCode],
    }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/collections/${params.id}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportConfig),
      });

      if (!res.ok) throw new Error("Export failed");
      toast.success("Export generated successfully!");
      // This part is crucial for PDF downloads
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${collection.slug || "test"}.${exportConfig.fileFormat}`;
      document.body.appendChild(a); // Append to body to make it work in Firefox
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.warning("Error generating export: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        Loading Collection Data...
      </div>
    );

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/collections/${params.id}`}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Export Collection
          </h1>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/5">
            {collection.questions?.length} Questions
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {collection.category}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" /> Language Selection
              </CardTitle>
              <CardDescription>
                Select all languages you want to include in this export.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      exportConfig.selectedLanguages.includes(lang.code)
                        ? "bg-primary/5 border-primary ring-1 ring-primary"
                        : "bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-5 w-5 rounded border flex items-center justify-center ${
                          exportConfig.selectedLanguages.includes(lang.code)
                            ? "bg-primary border-primary"
                            : "bg-muted"
                        }`}
                      >
                        {exportConfig.selectedLanguages.includes(lang.code) && (
                          <CheckCircle2 className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{lang.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {lang.code.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Detail
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                defaultValue={exportConfig.contentMode}
                onValueChange={(val) =>
                  setExportConfig({ ...exportConfig, contentMode: val })
                }
                className="space-y-3"
              >
                <div className="flex items-start space-x-3 border p-4 rounded-xl cursor-pointer">
                  <RadioGroupItem
                    value="minimal"
                    id="minimal"
                    className="mt-1"
                  />
                  <div className="grid gap-1.5 leading-none cursor-pointer">
                    <Label htmlFor="minimal" className="font-bold">
                      Minimal (Question + Options)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Standard format for student test papers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 border p-4 rounded-xl cursor-pointer">
                  <RadioGroupItem value="full" id="full" className="mt-1" />
                  <div className="grid gap-1.5 leading-none cursor-pointer">
                    <Label htmlFor="full" className="font-bold">
                      Complete Pack (Full Details)
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Includes solutions, descriptions, tags, and difficulty
                      levels.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right: Format & Action */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-md space-y-6">
            <CardHeader className="border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" /> Export Settings
              </CardTitle>
              <CardDescription>
                Select the file format to export.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground">
                  File Format
                </Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant={
                      exportConfig.fileFormat === "json" ? "default" : "outline"
                    }
                    className="justify-start gap-3"
                    onClick={() =>
                      setExportConfig({ ...exportConfig, fileFormat: "json" })
                    }
                  >
                    <FileJson className="h-4 w-4" /> JSON Object
                  </Button>
                  <Button
                    variant={
                      exportConfig.fileFormat === "pdf" ? "default" : "outline"
                    }
                    className="justify-start gap-3"
                    onClick={() =>
                      setExportConfig({ ...exportConfig, fileFormat: "pdf" })
                    }
                  >
                    <FileText className="h-4 w-4" /> PDF Document
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Languages:</span>
                  <span className="font-bold">
                    {exportConfig.selectedLanguages.length}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-bold uppercase">
                    {exportConfig.fileFormat}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 bg-muted/10">
              <Button
                className="w-full gap-2 h-12 text-md"
                disabled={exporting}
                onClick={handleExport}
              >
                {exporting ? (
                  <>
                    <Spinner className="h-5 w-5" />
                    Generating Export
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    Generate Export
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
