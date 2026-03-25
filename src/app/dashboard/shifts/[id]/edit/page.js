"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditShiftPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [form, setForm] = useState({ shiftName: "", date: "", startTime: "" });

  useEffect(() => {
    fetch(`/api/shifts/${id}`).then(res => res.json()).then(data => {
      setForm({
        shiftName: data.shiftName,
        date: data.date.split('T')[0],
        startTime: data.startTime
      });
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/shifts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    if(res?.ok){
      toast.success("Shift Updated");
      router.push("/dashboard/shifts");
    }
    
  };

  return (
    <div className="w-full ">
       <h2 className="text-xl mb-4">Edit Shift</h2>
      <div className="border p-4 rounded-xl">
        <form onSubmit={handleUpdate} className="space-y-6">  
          <div className="space-y-2">
            <Label>Shift Name</Label>
            <Input value={form.shiftName} onChange={e => setForm({...form, shiftName: e.target.value})}/>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} />
            </div>
          </div>
          <Button type="submit" className="w-full ">
            Update Shift
          </Button>
        </form>
      </div>
    </div>
  );
}