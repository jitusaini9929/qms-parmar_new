"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, ArrowLeft, Save, Filter, 
  CheckCircle2, Plus, X, Loader2, ChevronRight,
  ChevronLeft, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function AddQuestionsPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  
  // State for the Question Bank (Search Results)
  const [bank, setBank] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 50 });

  // State for the Collection (Selected Items)
  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  // Filter States
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    subject: "",
    topic: "",
    tags: "",
  });

  // 1. Initial Load: Fetch Collection & Base Lists
  useEffect(() => {
    const init = async () => {
      const [colRes, subRes] = await Promise.all([
        fetch(`/api/collections/${params.id}`),
        fetch("/api/subjects?activeOnly=true")
      ]);
      const colData = await colRes.json();
      const subData = await subRes.json();
      
      setSelectedIds(colData.questions?.map(q => q._id) || []);
      setSubjects(subData.subjects || []);
    };
    init();
  }, [params.id]);

  // 2. Fetch Topics when Subject changes
  const handleSubjectChange = async (val) => {
    setFilters({ ...filters, subject: val, topic: "" });
    if (val) {
      const res = await fetch(`/api/topics?subjectId=${val}&activeOnly=true`);
      const data = await res.json();
      setTopics(data.topics || []);
    } else {
      setTopics([]);
    }
  };

  // 3. Search Handler — builds proper API params
  const getQuestions = async (page = 1) => {
    setSearching(true);
    setHasSearched(true);
    try {
      // Build query params with correct API parameter names
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.set("search", filters.search);
      if (filters.subject) queryParams.set("subjectId", filters.subject);
      if (filters.topic) queryParams.set("topicId", filters.topic);
      if (filters.tags) queryParams.set("tags", filters.tags);
      
      queryParams.set("page", page.toString());
      queryParams.set("limit", "50");

      const res = await fetch(`/api/questions?${queryParams.toString()}`);
      const data = await res.json();
      setBank(data.questions || []);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  // Page change handler
  const goToPage = (page) => {
    if (page < 1 || page > pagination.pages) return;
    getQuestions(page);
  };

  // 4. Selection Logic
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Select/Deselect all visible results
  const toggleSelectAll = () => {
    const allVisibleIds = bank.map(q => q._id);
    const allSelected = allVisibleIds.every(id => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(prev => prev.filter(id => !allVisibleIds.includes(id)));
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...allVisibleIds])]);
    }
  };

  const handleSaveCollection = async () => {
    setSaving(true);
    try {
      await fetch(`/api/collections/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: selectedIds }),
      });
      router.push(`/dashboard/collections/${params.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/collections/${params.id}`}>
            <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Collection Questions</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {selectedIds.length} Selected
          </Badge>
          <Button onClick={handleSaveCollection} disabled={saving} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Collection
          </Button>
        </div>
      </div>

      {/* SEARCH FORM SECTION */}
      
      <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest">
          <Filter className="h-4 w-4" /> Filter Bank
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Keyword</label>
            <Input 
              placeholder="Search text..." 
              value={filters.search} 
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Subject</label>
            <select 
              className="w-full h-10 px-3 border rounded-md text-sm bg-background"
              value={filters.subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.subjectName}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Topic</label>
            <select 
              className="w-full h-10 px-3 border rounded-md text-sm bg-background"
              value={filters.topic}
              onChange={(e) => setFilters({...filters, topic: e.target.value})}
              disabled={!filters.subject}
            >
              <option value="">All Topics</option>
              {topics.map(t => <option key={t._id} value={t._id}>{t.topicName}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-muted-foreground">Tags</label>
            <Input 
              placeholder="PYQ, 2026..." 
              value={filters.tags} 
              onChange={(e) => setFilters({...filters, tags: e.target.value})}
            />
          </div>
        </div>
        <Button onClick={() => getQuestions(1)} className="w-full gap-2" variant="secondary" disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Get Questions
        </Button>
      </div>

      {/* SEARCH RESULTS LIST */}
      
      {hasSearched && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase text-muted-foreground tracking-tighter">
              Search Results ({pagination.total} total{pagination.pages > 1 ? `, page ${pagination.page} of ${pagination.pages}` : ""})
            </h2>
            {bank.length > 0 && (
              <Button variant="outline" size="sm" className="text-xs gap-1" onClick={toggleSelectAll}>
                <CheckCircle2 className="h-3 w-3" />
                {bank.every(q => selectedIds.includes(q._id)) ? "Deselect Page" : "Select Page"}
              </Button>
            )}
          </div>
          
          {bank.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-xl text-muted-foreground">
              No questions found matching your criteria.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3">
                {bank.map((q) => (
                  <div 
                    key={q._id}
                    onClick={() => toggleSelect(q._id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedIds.includes(q._id) 
                      ? "bg-primary/5 border-primary ring-1 ring-primary" 
                      : "bg-card hover:border-primary/50"
                    }`}
                  >
                    <div className="flex gap-4 items-center overflow-hidden">
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedIds.includes(q._id) ? "bg-primary border-primary" : "bg-background"
                      }`}>
                        {selectedIds.includes(q._id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                      </div>
                      <div>
                        <div className="flex gap-2 items-center mb-1">
                          <Badge variant="outline" className="text-[9px] h-4 uppercase font-bold">{q.code}</Badge>
                          <span className="text-[10px] text-muted-foreground uppercase">{q.difficulty}</span>
                          {q.tags?.length > 0 && (
                            <div className="flex gap-1">
                              {q.tags.slice(0, 3).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-[8px] h-3.5 px-1">{tag}</Badge>
                              ))}
                              {q.tags.length > 3 && (
                                <span className="text-[8px] text-muted-foreground">+{q.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-medium line-clamp-1">{q.content?.en?.text || q.content?.hi?.text}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t">
                  <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={pagination.page <= 1 || searching}
                    onClick={() => goToPage(1)}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={pagination.page <= 1 || searching}
                    onClick={() => goToPage(pagination.page - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium px-3">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={pagination.page >= pagination.pages || searching}
                    onClick={() => goToPage(pagination.page + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" size="icon" className="h-8 w-8"
                    disabled={pagination.page >= pagination.pages || searching}
                    onClick={() => goToPage(pagination.pages)}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}