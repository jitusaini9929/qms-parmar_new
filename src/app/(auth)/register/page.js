"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Input } from "@/components/auth/Input";
import { PasswordStrength } from "@/components/auth/PasswordStrength";

/* ─── Google Fonts: DM Serif Display + DM Sans ───
   Add to your _document or layout:
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
    --green:  #34d399;
    --green-bg: rgba(52,211,153,0.10);
    --radius: 18px;
  }

  .reg-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: var(--navy);
    color: var(--white);
    overflow: hidden;
  }

  /* ── Right panel (form) ── */
  .reg-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
    order: 2;
  }

  @media (min-width: 1024px) {
    .reg-left { order: 2; }
  }

  .reg-card-wrap {
    width: 100%;
    max-width: 440px;
  }

  /* ── Glass card ── */
  .reg-card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 2.25rem 2.25rem;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    box-shadow: 0 0 0 1px var(--glass-border), 0 32px 64px rgba(0,0,0,0.45);
    position: relative;
    overflow: hidden;
  }

  .reg-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(92,110,248,0.12), transparent);
    pointer-events: none;
  }

  /* ── Logo ── */
  .reg-logo-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 1.75rem;
  }

  .reg-logo-dot {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--indigo), var(--teal));
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .reg-logo-text {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: var(--white);
  }

  /* ── Heading ── */
  .reg-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 1.85rem;
    font-weight: 400;
    line-height: 1.15;
    color: var(--white);
    margin: 0 0 0.35rem;
  }
  .reg-heading em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .reg-sub {
    font-size: 0.875rem;
    color: var(--muted);
    margin: 0 0 1.75rem;
    font-weight: 300;
  }

  /* ── Alert ── */
  .reg-alert {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    padding: 0.825rem 1rem;
    border-radius: 12px;
    margin-bottom: 1.25rem;
    font-size: 0.84rem;
    line-height: 1.4;
  }
  .reg-alert-icon { flex-shrink: 0; width: 16px; height: 16px; }
  .reg-alert.error   { background: var(--error-bg);  border: 1px solid rgba(248,113,113,0.22); color: var(--error); }
  .reg-alert.success { background: var(--green-bg);  border: 1px solid rgba(52,211,153,0.22);  color: var(--green); }

  /* ── Form ── */
  .reg-form { display: flex; flex-direction: column; gap: 1.05rem; }

  .reg-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .reg-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: rgba(240,244,255,0.75);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .reg-input-wrap { position: relative; }

  .reg-input-icon {
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

  .reg-input-wrap:focus-within .reg-input-icon {
    color: var(--indigo-light);
  }

  .reg-input-wrap input {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255,255,255,0.05) !important;
    border: 1px solid var(--glass-border) !important;
    border-radius: 12px !important;
    padding: 0.72rem 1rem 0.72rem 2.75rem !important;
    color: var(--white) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 0.88rem !important;
    outline: none !important;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s !important;
  }

  .reg-input-wrap input::placeholder {
    color: rgba(240,244,255,0.28) !important;
  }

  .reg-input-wrap input:focus {
    border-color: var(--indigo) !important;
    background: rgba(92,110,248,0.07) !important;
    box-shadow: 0 0 0 3px rgba(92,110,248,0.15) !important;
  }

  .reg-input-wrap input.match {
    border-color: rgba(52,211,153,0.5) !important;
  }

  .reg-input-wrap input.no-match {
    border-color: rgba(248,113,113,0.5) !important;
  }

  /* Password mismatch hint */
  .reg-mismatch {
    font-size: 0.75rem;
    color: var(--error);
    margin-top: 2px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* two-col grid for name+email */
  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.9rem;
  }
  @media (max-width: 520px) {
    .reg-row { grid-template-columns: 1fr; }
  }

  /* ── Submit button ── */
  .reg-btn {
    margin-top: 0.4rem;
    width: 100%;
    height: 48px;
    border: none;
    border-radius: 13px;
    background: linear-gradient(100deg, var(--indigo) 0%, #7c6ef8 100%);
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
    box-shadow: 0 2px 6px rgba(92,110,240,0.1);
  }

  .reg-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .reg-btn:hover:not(:disabled)::before { opacity: 1; }
  .reg-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 6px rgba(92,110,248,0.1); }
  .reg-btn:active:not(:disabled) { transform: translateY(0); }
  .reg-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .reg-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: reg-spin 0.7s linear infinite;
  }
  @keyframes reg-spin { to { transform: rotate(360deg); } }

  /* ── Footer ── */
  .reg-divider {
    height: 1px;
    background: var(--glass-border);
    margin: 1.4rem 0;
  }

  .reg-footer {
    text-align: center;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .reg-footer a {
    color: var(--indigo-light);
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color 0.2s;
  }
  .reg-footer a:hover { color: var(--white); }

  .reg-tos {
    margin-top: 1.25rem;
    text-align: center;
    font-size: 0.75rem;
    color: rgba(240,244,255,0.3);
  }
  .reg-tos a {
    color: rgba(240,244,255,0.45);
    text-decoration: underline;
    transition: color 0.2s;
  }
  .reg-tos a:hover { color: var(--white); }

  /* ── Success screen ── */
  .reg-success-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: var(--navy);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .reg-success-card {
    text-align: center;
    max-width: 380px;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: var(--radius);
    padding: 3rem 2.5rem;
    backdrop-filter: blur(24px);
    box-shadow: 0 32px 64px rgba(0,0,0,0.4);
  }

  .reg-success-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: var(--green-bg);
    border: 1px solid rgba(52,211,153,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .reg-success-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem;
    margin: 0 0 0.5rem;
  }

  .reg-success-sub {
    font-size: 0.875rem;
    color: var(--muted);
    margin: 0 0 1.75rem;
    line-height: 1.6;
    font-weight: 300;
  }

  /* ── Right panel (visual) ── */
  .reg-right {
    display: none;
    flex: 1.1;
    position: relative;
    background: var(--navy-2);
    overflow: hidden;
    order: 1;
  }

  @media (min-width: 1024px) {
    .reg-right { display: flex; align-items: center; justify-content: center; order: 1; }
  }

  .reg-mesh {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .reg-mesh-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
  }

  .reg-mesh-circle.c1 {
    width: 480px; height: 480px;
    background: var(--teal);
    top: -80px; left: -80px;
    animation: reg-float 10s ease-in-out infinite;
  }
  .reg-mesh-circle.c2 {
    width: 420px; height: 420px;
    background: var(--indigo);
    bottom: -60px; right: -60px;
    animation: reg-float 8s ease-in-out infinite reverse;
  }
  .reg-mesh-circle.c3 {
    width: 260px; height: 260px;
    background: #a855f7;
    top: 45%; left: 35%;
    animation: reg-float 6s ease-in-out infinite 1.5s;
  }

  @keyframes reg-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(10px, -16px) scale(1.04); }
    66%       { transform: translate(-10px, 10px) scale(0.97); }
  }

  .reg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Feature checklist cards */
  .reg-features {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .reg-feature-card {
    position: absolute;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 0.875rem 1.125rem;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: reg-bob linear infinite;
    font-size: 0.82rem;
    color: var(--white);
    white-space: nowrap;
  }

  .reg-feature-card .ficon {
    width: 30px; height: 30px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  .reg-feature-card .ficon.blue   { background: rgba(92,110,248,0.25); }
  .reg-feature-card .ficon.teal   { background: rgba(45,212,191,0.25); }
  .reg-feature-card .ficon.purple { background: rgba(168,85,247,0.25); }

  .reg-feature-card.fc1 { top: 14%; left: 6%;  animation-duration: 7s;  animation-delay: 0s; }
  .reg-feature-card.fc2 { top: 54%; right: 6%; animation-duration: 9s;  animation-delay: 2s; }
  .reg-feature-card.fc3 { bottom: 16%; left: 10%; animation-duration: 8s; animation-delay: 4s; }

  @keyframes reg-bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  /* Stats row */
  .reg-stats {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
  }

  .reg-stat-pill {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    padding: 0.875rem 1.25rem;
    text-align: center;
    backdrop-filter: blur(12px);
    min-width: 90px;
  }

  .reg-stat-pill-val {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--white);
    line-height: 1;
  }

  .reg-stat-pill-lbl {
    font-size: 0.68rem;
    color: var(--muted);
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Hero */
  .reg-hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    max-width: 420px;
  }

  .reg-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(45,212,191,0.12);
    border: 1px solid rgba(45,212,191,0.28);
    border-radius: 999px;
    padding: 6px 14px;
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--teal);
    margin-bottom: 1.5rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .reg-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.65rem;
    line-height: 1.1;
    color: var(--white);
    margin: 0 0 1rem;
  }

  .reg-hero-title em {
    font-style: italic;
    color: var(--teal);
  }

  .reg-hero-desc {
    font-size: 0.9rem;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
  }
`;

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) { setError("Please enter your full name."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { setError("Please enter a valid email address."); return false; }
    if (formData.password.length < 8) { setError("Password must be at least 8 characters long."); return false; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess(true);
      toast.success("Account created! Redirecting to login...");
      setTimeout(() => router.push("/login?registered=true"), 2500);
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const passwordsMismatch =
    formData.confirmPassword.length > 0 &&
    formData.password !== formData.confirmPassword;

  /* ── Success screen ── */
  if (success) {
    return (
      <>
        <style>{styles}</style>
        <div className="reg-success-root">
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="reg-success-card"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="reg-success-icon"
            >
              <CheckCircle2 size={32} color="var(--green)" />
            </motion.div>
            <h2 className="reg-success-title">You&apos;re in!</h2>
            <p className="reg-success-sub">
              Your account has been created successfully.<br />
              Redirecting you to sign in…
            </p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div className="reg-spinner" />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="reg-root">
        {/* ── Left: Visual Panel ── */}
        <div className="reg-right">
          {/* Mesh blobs */}
          <div className="reg-mesh">
            <div className="reg-mesh-circle c1" />
            <div className="reg-mesh-circle c2" />
            <div className="reg-mesh-circle c3" />
          </div>

          {/* Grid */}
          <div className="reg-grid" />

     

          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="reg-hero"
          >
            <div className="reg-badge">
              <Sparkles size={11} /> Get Started Free
            </div>
            <h2 className="reg-hero-title">
              Your questions,<br /><em>organised</em>.
            </h2>
            <p className="reg-hero-desc">
              Built for teams who value efficiency and precision. Create,
              manage, and review at scale — without the chaos.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="reg-stats"
            >
              {[
                { val: "500+", lbl: "Active Users" },
                { val: "10K+", lbl: "Questions" },
                { val: "99.9%", lbl: "Uptime" },
              ].map((s) => (
                <div key={s.lbl} className="reg-stat-pill">
                  <div className="reg-stat-pill-val">{s.val}</div>
                  <div className="reg-stat-pill-lbl">{s.lbl}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right: Form Panel ── */}
        <div className="reg-left">
          <div className="mt-24 reg-card-wrap">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="reg-card"
            >
              {/* Logo */}
              <div className="reg-logo-row">
                <div className="reg-logo-dot">
                  <Sparkles size={15} color="#fff" />
                </div>
                <span className="reg-logo-text">QMS Platform</span>
              </div>

              {/* Heading */}
              <h1 className="reg-heading">
                Create an <em>account</em>
              </h1>
              <p className="reg-sub">Join us and start managing questions today</p>

              {/* Error alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="err"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="reg-alert error"
                  >
                    <AlertCircle className="reg-alert-icon" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="reg-form">
                {/* Name + Email row */}
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label" htmlFor="name">Full Name</label>
                    <div className="reg-input-wrap">
                      <User className="reg-input-icon" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        required
                        value={formData.name}
                        onChange={handleChange("name")}
                        className="pl-11"
                      />
                    </div>
                  </div>

                  <div className="reg-field">
                    <label className="reg-label" htmlFor="email">Email</label>
                    <div className="reg-input-wrap">
                      <Mail className="reg-input-icon" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        required
                        value={formData.email}
                        onChange={handleChange("email")}
                        className="pl-11"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="password">Password</label>
                  <div className="reg-input-wrap">
                    <Lock className="reg-input-icon" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      required
                      value={formData.password}
                      onChange={handleChange("password")}
                      className="pl-11"
                    />
                  </div>
                  <AnimatePresence>
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <PasswordStrength password={formData.password} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirm Password */}
                <div className="reg-field">
                  <label className="reg-label" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="reg-input-wrap">
                    <ShieldCheck className="reg-input-icon" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange("confirmPassword")}
                      className={`pl-11 ${passwordsMatch ? "match" : ""} ${passwordsMismatch ? "no-match" : ""}`}
                    />
                  </div>
                  <AnimatePresence>
                    {passwordsMismatch && (
                      <motion.p
                        key="mismatch"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="reg-mismatch"
                      >
                        <AlertCircle size={11} /> Passwords do not match
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit */}
                <button type="submit" className="reg-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="reg-spinner" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="reg-divider" />
              <div className="reg-footer">
                Already have an account?{" "}
                <Link href="/login">
                  Sign in <ArrowRight size={12} />
                </Link>
              </div>
            </motion.div>

            {/* ToS */}
            <p className="reg-tos">
              By creating an account you agree to our{" "}
              <Link href="#">Terms</Link> &amp; <Link href="#">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}