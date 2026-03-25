"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  ArrowLeft,
  Mail,
  Shield,
  Calendar,
  Activity,
  User as UserIcon,
  Edit,
} from "lucide-react";

export default function ViewUserPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10">User not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
        </div>
        <Button onClick={() => router.push(`/dashboard/users/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit User Profile
        </Button>
      </div>

      {/* Profile Info Card */}
      <Card className="">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            {user._id}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Shield className="mr-2 h-4 w-4" /> Role
            </div>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="mr-2 h-4 w-4" /> Status
            </div>
            <Badge
              variant={user.status === "APPROVED" ? "success" : "secondary"}
              className={
                user.status === "BANNED" ? "bg-red-500/10 text-red-500" : ""
              }
            >
              {user.status}
            </Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" /> Joined On
            </div>
            <span className="text-sm font-medium">
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Internal User ID
            </p>
            <p className="text-sm font-mono break-all">{user._id}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <p className="text-xs text-muted-foreground">Email Verified</p>
              <p className="text-sm font-bold">Yes</p>
            </div>
            <div className="p-3 border rounded-md">
              <p className="text-xs text-muted-foreground">Login Type</p>
              <p className="text-sm font-bold">Credentials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
