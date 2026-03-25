"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function EditUserPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState({ name: "", role: "", status: "" });

  useEffect(() => {
    fetch(`/api/users/${id}`).then(res => res.json()).then(data => setUser(data));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${id}/edit`, {
      method: "PUT",
      body: JSON.stringify(user),
    });
    toast.success("Updated Successfully.")
    if (res.ok) router.push("/dashboard/users");
  };

  return (
      <Card className="w-full">
        <CardHeader><CardTitle>Edit User</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={user.role} onValueChange={(val) => setUser({...user, role: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={user.status} onValueChange={(val) => setUser({...user, status: val})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">PENDING</SelectItem>
                  <SelectItem value="APPROVED">APPROVED</SelectItem>
                  <SelectItem value="BANNED">BANNED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
  );
}