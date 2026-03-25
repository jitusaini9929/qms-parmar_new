"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  AlertCircle,
  ShieldBan,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get system-level errors from URL (set by Middleware)
  const systemError = searchParams.get("error");
  const systemMessage = searchParams.get("message");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Logged in successfully!");
      router.push("/dashboard");
      router.refresh();
    } else if (res?.error === "CredentialsSignin") {
      setError("Invalid email or password.");
      setIsLoading(false);
    } else {
      setError(res?.error || "An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
  
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your portal
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            {/* --- SYSTEM LEVEL ERRORS (e.g. Banned or Pending) --- */}
            {systemError === "banned" && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <ShieldBan className="h-4 w-4" />
                <AlertTitle>Account Suspended</AlertTitle>
                <AlertDescription>
                  Your access has been revoked by an administrator. Please
                  contact support.
                </AlertDescription>
              </Alert>
            )}

            {systemError === "pending" && (
              <Alert className="bg-amber-50 border-amber-200 text-amber-800">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertTitle>Approval Required</AlertTitle>
                <AlertDescription>
                  Your account is currently under review. We&apos;ll email you
                  once it&apos;s active.
                </AlertDescription>
              </Alert>
            )}

            {/* --- FORM SUBMISSION ERRORS (e.g. Wrong Password) --- */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* --- SUCCESS MESSAGES (e.g. Password Reset Successful) --- */}
            {systemMessage === "reset_success" && (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Password updated! You can now log in.
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    size="sm"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-sm text-center w-full text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
                Register here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>

  );
}
