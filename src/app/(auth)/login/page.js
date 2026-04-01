"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "motion/react";
import {
  LogIn,
  Mail,
  Lock,
  ShieldBan,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/auth/Input";
import { AuthCard, AuthHeader } from "@/components/auth/AuthCard";

/* ─── Google Fonts loader (add to your _document or layout if not present) ───
   DM Serif Display + DM Sans
   <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
*/

const styles = `
  :root {
    --navy:   #0b0f1e;
    --navy-2: #111628;
    --navy-3: #1a2038;
    --indigo: #5c6ef8;
    --indigo-light: #818cf8;
    --indigo-glow: rgba(92,110,248,0.18);
    --teal:   #2dd4bf;
    --white:  #f0f4ff;
    --muted:  rgba(240,244,255,0.5);
    --glass:  rgba(255,255,255,0.04);
    --glass-border: rgba(255,255,255,0.09);
    --error:  #f87171;
    --error-bg: rgba(248,113,113,0.10);
    --amber:  #fbbf24;
    --amber-bg: rgba(251,191,36,0.10);
    --green:  #34d399;
    --green-bg: rgba(52,211,153,0.10);
    --radius: 18px;
  }

  .qms-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: var(--navy);
    color: var(--white);
    overflow: hidden;
  }

  /* ── Left panel ── */
  .qms-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .qms-card-wrap {
    width: 100%;
    max-width: 420px;
  }

  /* ── Glass card ── */
  .qms-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 2.5rem 2.25rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px var(--glass-border), 0 32px 64px rgba(0,0,0,0.45);
    position: relative;
    overflow: hidden;
  }

  .qms-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(92,110,248,0.12), transparent);
    pointer-events: none;
  }

  /* ── Logo area ── */
  .qms-logo-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 2rem;
  }

  .qms-logo-dot {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--indigo), var(--teal));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qms-logo-text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: var(--white);
  }

  /* ── Heading ── */
  .qms-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 400;
    line-height: 1.15;
    color: var(--white);
    margin: 0 0 0.4rem;
  }

  .qms-heading em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .qms-sub {
    font-size: 0.875rem;
    color: var(--muted);
    margin: 0 0 2rem;
    font-weight: 300;
  }

  /* ── Alert banners ── */
  .qms-alert {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    margin-bottom: 1.25rem;
    font-size: 0.84rem;
    line-height: 1.4;
  }

  .qms-alert-icon { flex-shrink: 0; margin-top: 1px; width: 16px; height: 16px; }

  .qms-alert.error   { background: var(--error-bg);  border: 1px solid rgba(248,113,113,0.22); color: var(--error); }
  .qms-alert.amber   { background: var(--amber-bg);  border: 1px solid rgba(251,191,36,0.22);  color: var(--amber); }
  .qms-alert.success { background: var(--green-bg);  border: 1px solid rgba(52,211,153,0.22);  color: var(--green); }

  .qms-alert strong { display: block; font-weight: 600; margin-bottom: 2px; }
  .qms-alert span   { opacity: 0.8; }

  /* ── Form ── */
  .qms-form { display: flex; flex-direction: column; gap: 1.15rem; }

  .qms-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .qms-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .qms-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(240,244,255,0.75);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .qms-forgot {
    font-size: 0.78rem;
    color: var(--indigo-light);
    text-decoration: none;
    transition: color 0.2s;
  }
  .qms-forgot:hover { color: var(--white); }

  .qms-input-wrap {
    position: relative;
  }

  .qms-input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    width: 15px;
    height: 15px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .qms-input-wrap:focus-within .qms-input-icon {
    color: var(--indigo-light);
  }

  /* override the Input component's base styles via wrapper class */
  .qms-input-wrap input,
  .qms-input-wrap .qms-native-input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid var(--glass-border) !important;
    border-radius: 12px !important;
    padding: 0.75rem 1rem 0.75rem 2.75rem !important;
    color: var(--white) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.9rem !important;
    outline: none !important;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
  }

  .qms-input-wrap input::placeholder,
  .qms-input-wrap .qms-native-input::placeholder {
    color: rgba(240,244,255,0.3) !important;
  }

  .qms-input-wrap input:focus,
  .qms-input-wrap .qms-native-input:focus {
    border-color: var(--indigo) !important;
    background: rgba(92,110,248,0.07) !important;
    box-shadow: 0 0 0 3px rgba(92,110,248,0.15) !important;
  }

  /* ── Submit button ── */
  .qms-btn {
    margin-top: 0.5rem;
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 13px;
    background: linear-gradient(115deg, var(--indigo) 0%, #7c6ef8 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 2px 10px rgba(92,100,200,0.35);
  }

  .qms-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .qms-btn:hover:not(:disabled)::before { opacity: 1; }
  .qms-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 4px rgba(92,110,248,0.1); }
  .qms-btn:active:not(:disabled) { transform: translateY(0); }
  .qms-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .qms-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: qms-spin 0.7s linear infinite;
  }
  @keyframes qms-spin { to { transform: rotate(360deg); } }

  /* ── Footer ── */
  .qms-footer {
    margin-top: 1.75rem;
    text-align: center;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .qms-footer a {
    color: var(--indigo-light);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color 0.2s;
  }
  .qms-footer a:hover { color: var(--white); }

  .qms-tos {
    margin-top: 1.25rem;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(240,244,255,0.3);
  }
  .qms-tos a {
    color: rgba(240,244,255,0.45);
    text-decoration: underline;
    transition: color 0.2s;
  }
  .qms-tos a:hover { color: var(--white); }

  /* ── Divider ── */
  .qms-divider {
    height: 1px;
    background: var(--glass-border);
    margin: 1.5rem 0;
  }

  /* ── Right panel ── */
  .qms-right {
    display: none;
    flex: 1.1;
    position: relative;
    background: var(--navy-2);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .qms-right { display: flex; align-items: center; justify-content: center; }
  }

  /* Animated mesh background */
  .qms-mesh {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .qms-mesh-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }

  .qms-mesh-circle.c1 {
    width: 520px; height: 520px;
    background: var(--indigo);
    top: -120px; right: -100px;
    animation: qms-float 9s ease-in-out infinite;
  }
  .qms-mesh-circle.c2 {
    width: 380px; height: 380px;
    background: var(--teal);
    bottom: -80px; left: -60px;
    animation: qms-float 12s ease-in-out infinite reverse;
  }
  .qms-mesh-circle.c3 {
    width: 250px; height: 250px;
    background: #a855f7;
    top: 40%; left: 30%;
    animation: qms-float 7s ease-in-out infinite 2s;
  }

  @keyframes qms-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(12px, -18px) scale(1.04); }
    66%       { transform: translate(-8px, 12px) scale(0.97); }
  }

  /* Grid lines overlay */
  .qms-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Floating stat cards */
  .qms-stat-cards {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .qms-stat {
    position: absolute;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 0.875rem 1.125rem;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: qms-bob linear infinite;
  }

  .qms-stat.s1 { top: 18%; left: 8%;  animation-duration: 6s;  animation-delay: 0s; }
  .qms-stat.s2 { top: 68%; right: 10%; animation-duration: 8s;  animation-delay: 1.5s; }
  .qms-stat.s3 { bottom: 18%; left: 15%; animation-duration: 7s; animation-delay: 3s; }

  @keyframes qms-bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  .qms-stat-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
  }

  .qms-stat-icon.blue { background: rgba(92,110,248,0.2); }
  .qms-stat-icon.teal { background: rgba(45,212,191,0.2); }
  .qms-stat-icon.purple { background: rgba(168,85,247,0.2); }

  .qms-stat-val {
    font-size: 1rem;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
  }
  .qms-stat-lbl {
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 2px;
  }

  /* Hero copy */
  .qms-hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    max-width: 420px;
  }

  .qms-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(92,110,248,0.15);
    border: 1px solid rgba(92,110,248,0.3);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--indigo-light);
    margin-bottom: 1.5rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .qms-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.75rem;
    line-height: 1.1;
    color: var(--white);
    margin: 0 0 1rem;
  }

  .qms-hero-title em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .qms-hero-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .qms-card { padding: 1.75rem 1.25rem; }
    .qms-heading { font-size: 1.6rem; }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } else if (res?.error === "CredentialsSignin") {
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    } else {
      setError(res?.error || "An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <div className="qms-root">
        {/* ── Left: Form Panel ── */}
        <div className="qms-left">
          <div className="mt-24 qms-card-wrap">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="qms-card"
            >
              {/* Logo */}
              <div className="qms-logo-row">
                <div className="qms-logo-dot">
                  <Sparkles size={15} color="#fff" />
                </div>
                <span className="qms-logo-text">QMS Platform</span>
              </div>

              {/* Heading */}
              <h1 className="qms-heading">
                Welcome <em>back</em>
              </h1>
              <p className="qms-sub">Sign in to access your dashboard</p>

              {/* ── Alerts ── */}
              {systemError === "banned" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="qms-alert error"
                >
                  <ShieldBan className="qms-alert-icon" />
                  <div>
                    <strong>Account Suspended</strong>
                    <span>Your access has been revoked. Contact support.</span>
                  </div>
                </motion.div>
              )}

              {systemError === "pending" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="qms-alert amber"
                >
                  <Clock className="qms-alert-icon" />
                  <div>
                    <strong>Approval Required</strong>
                    <span>Your account is under review. We&apos;ll email you once activated.</span>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="qms-alert error"
                >
                  <AlertCircle className="qms-alert-icon" />
                  <span>{error}</span>
                </motion.div>
              )}

              {systemMessage === "reset_success" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="qms-alert success"
                >
                  <CheckCircle2 className="qms-alert-icon" />
                  <span>Password updated! Sign in with your new password.</span>
                </motion.div>
              )}

              {/* ── Form ── */}
              <form onSubmit={handleSubmit} className="qms-form">
                {/* Email */}
                <div className="qms-field">
                  <label className="qms-label" htmlFor="email">Email</label>
                  <div className="qms-input-wrap">
                    <Mail className="qms-input-icon" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="qms-field">
                  <div className="qms-label-row">
                    <label className="qms-label" htmlFor="password">Password</label>
                    <Link href="/forgot-password" className="qms-forgot">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="qms-input-wrap">
                    <Lock className="qms-input-icon" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-11"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" className="qms-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="qms-spinner" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="qms-divider" />
              <div className="qms-footer">
                Don&apos;t have an account?{" "}
                <Link href="/register">
                  Create one <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>

            {/* ToS */}
            <p className="qms-tos">
              By signing in you agree to our{" "}
              <Link href="#">Terms</Link> &amp; <Link href="#">Privacy Policy</Link>
            </p>
          </div>
        </div>

        {/* ── Right: Visual Panel ── */}
        <div className="qms-right">
          {/* Mesh blobs */}
          <div className="qms-mesh">
            <div className="qms-mesh-circle c1" />
            <div className="qms-mesh-circle c2" />
            <div className="qms-mesh-circle c3" />
          </div>

          {/* Grid */}
          <div className="qms-grid" />

          {/* Floating stat cards */}
          <div className="qms-stat-cards">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="qms-stat s1"
            >
              <div className="qms-stat-icon blue">📋</div>
              <div>
                <div className="qms-stat-val">12,480</div>
                <div className="qms-stat-lbl">Questions managed</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="qms-stat s2"
            >
              <div className="qms-stat-icon teal">⚡</div>
              <div>
                <div className="qms-stat-val">99.9%</div>
                <div className="qms-stat-lbl">Uptime SLA</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="qms-stat s3"
            >
              <div className="qms-stat-icon purple">🏛️</div>
              <div>
                <div className="qms-stat-val">340+</div>
                <div className="qms-stat-lbl">Institutions</div>
              </div>
            </motion.div>
          </div>

          {/* Hero copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="qms-hero"
          >
            <div className="qms-badge">
              <Sparkles size={11} /> QMS Platform
            </div>
            <h2 className="qms-hero-title">
              Questions managed.<br /><em>Chaos</em> eliminated.
            </h2>
            <p className="qms-hero-desc">
              The all-in-one Question Management System built for modern
              institutions — secure, scalable, and engineered for performance.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}