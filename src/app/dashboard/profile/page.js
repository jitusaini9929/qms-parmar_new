"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Lock, Save, Loader2, 
  Camera, ShieldCheck, ArrowLeft 
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        password: "",
      });
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Update the NextAuth session client-side
        await update({
          ...session,
          user: { ...session?.user, name: formData.name, email: formData.email }
        });
        toast.success("Profile Update Successfully.");
        router.refresh();
        
      }
    } catch (error) {
      console.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <Avatar className="h-9 w-9 border-4 border-background shadow-lg">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">
                    {formData.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
                  </AvatarFallback>
                </Avatar>
                {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-6 w-6" />
                </div> */}
              </div>
              <h3 className="mt-4 font-bold text-lg">{formData.name}</h3>
              <Badge variant="secondary" className="mt-1 uppercase text-[10px] font-bold">
                {session?.user?.role || "Member"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        <Card className="md:col-span-2 border-none shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Personal Information
            </CardTitle>
            <CardDescription>Update your public profile and contact details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Full Name</Label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-10 bg-background/50" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Email Address</Label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-10 bg-background/50" 
                      disabled
                    />
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase text-muted-foreground">Change Password</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="pl-10 bg-background/50" 
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest shadow-lg" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}