"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { NextResponse } from "next/server";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      console.log("Error: " + NextResponse.json(res));
      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] px-4">
        <Card className="w-full max-w-md text-center border-t-4 border-t-green-500 shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="text-green-600 w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
            <CardDescription className="text-slate-500 pt-2">
              We&apos;ve sent a password reset link to <br />
              <span className="font-semibold text-slate-900">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">
              Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => setSubmitted(false)}>
              Try another email
            </Button>
            <Link href="/login" className="text-sm text-blue-600 hover:underline flex items-center gap-2 mt-4">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-100">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
          <CardDescription className="text-center">
            No worries, we&apos;ll send you reset instructions.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
            <Link 
              href="/login" 
              className="text-sm text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}