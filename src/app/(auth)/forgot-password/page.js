"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Clock,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/auth/Input";

/* ─── Google Fonts: DM Serif Display + DM Sans ───────────────────────────────
   Add to your _document or root layout:
   <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
*/

const styles = `
  :root {
    --navy:          #0b0f1e;
    --navy-2:        #111628;
    --navy-3:        #1a2038;
    --indigo:        #5c6ef8;
    --indigo-light:  #818cf8;
    --indigo-glow:   rgba(92,110,248,0.18);
    --teal:          #2dd4bf;
    --white:         #f0f4ff;
    --muted:         rgba(240,244,255,0.5);
    --glass:         rgba(255,255,255,0.04);
    --glass-border:  rgba(255,255,255,0.09);
    --error:         #f87171;
    --error-bg:      rgba(248,113,113,0.10);
    --green:         #34d399;
    --green-bg:      rgba(52,211,153,0.10);
    --radius:        18px;
  }

  .fp-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: var(--navy);
    color: var(--white);
    overflow: hidden;
  }

  /* ── Left panel ── */
  .fp-left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .fp-card-wrap {
    width: 100%;
    max-width: 420px;
  }

  /* ── Glass card ── */
  .fp-card {
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

  .fp-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(92,110,248,0.12), transparent);
    pointer-events: none;
  }

  /* ── Logo ── */
  .fp-logo-row {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 2rem;
  }

  .fp-logo-dot {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    background: linear-gradient(135deg, var(--indigo), var(--teal));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fp-logo-text {
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    color: var(--white);
  }

  /* ── Icon circle ── */
  .fp-icon-ring {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(92,110,248,0.12);
    border: 1px solid rgba(92,110,248,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.25rem;
  }

  /* ── Heading ── */
  .fp-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    font-weight: 400;
    line-height: 1.15;
    color: var(--white);
    margin: 0 0 0.4rem;
  }

  .fp-heading em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .fp-sub {
    font-size: 0.875rem;
    color: var(--muted);
    margin: 0 0 2rem;
    font-weight: 300;
    line-height: 1.6;
  }

  /* ── Alert ── */
  .fp-alert {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
    padding: 0.875rem 1rem;
    border-radius: 12px;
    margin-bottom: 1.25rem;
    font-size: 0.84rem;
    line-height: 1.4;
    background: var(--error-bg);
    border: 1px solid rgba(248,113,113,0.22);
    color: var(--error);
  }

  .fp-alert-icon { flex-shrink: 0; margin-top: 1px; width: 16px; height: 16px; }

  /* ── Form ── */
  .fp-form { display: flex; flex-direction: column; gap: 1.15rem; }

  .fp-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .fp-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: rgba(240,244,255,0.75);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .fp-input-wrap { position: relative; }

  .fp-input-icon {
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

  .fp-input-wrap:focus-within .fp-input-icon { color: var(--indigo-light); }

  .fp-input-wrap input {
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

  .fp-input-wrap input::placeholder { color: rgba(240,244,255,0.3) !important; }

  .fp-input-wrap input:focus {
    border-color: var(--indigo) !important;
    background: rgba(92,110,248,0.07) !important;
    box-shadow: 0 0 0 3px rgba(92,110,248,0.15) !important;
  }

  /* ── Submit button ── */
  .fp-btn {
    margin-top: 0.5rem;
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
    box-shadow: 0 2px 6px rgba(92,100,200,0.1);
  }

  .fp-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(100deg, rgba(255,255,255,0.1), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .fp-btn:hover:not(:disabled)::before { opacity: 1; }
  .fp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 4px rgba(92,1100,200,0.1); }
  .fp-btn:active:not(:disabled) { transform: translateY(0); }
  .fp-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .fp-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: fp-spin 0.7s linear infinite;
  }
  @keyframes fp-spin { to { transform: rotate(360deg); } }

  /* ── Back link ── */
  .fp-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.2s;
    margin-top: 1.5rem;
  }
  .fp-back:hover { color: var(--white); }

  .fp-divider {
    height: 1px;
    background: var(--glass-border);
    margin: 1.5rem 0;
  }

  .fp-signin-hint {
    text-align: center;
    font-size: 0.82rem;
    color: var(--muted);
  }
  .fp-signin-hint a {
    color: var(--indigo-light);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  .fp-signin-hint a:hover { color: var(--white); }

  /* ── Success state ── */
  .fp-success-ring {
    width: 72px;
    height: 72px;
    border-radius: 20px;
    background: var(--green-bg);
    border: 1px solid rgba(52,211,153,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
  }

  .fp-success-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.75rem;
    font-weight: 400;
    color: var(--white);
    margin: 0 0 0.5rem;
    text-align: center;
  }

  .fp-success-sub {
    font-size: 0.875rem;
    color: var(--muted);
    text-align: center;
    line-height: 1.6;
    margin: 0 0 0.375rem;
    font-weight: 300;
  }

  .fp-email-pill {
    display: inline-block;
    background: rgba(92,110,248,0.12);
    border: 1px solid rgba(92,110,248,0.25);
    border-radius: 8px;
    padding: 4px 12px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--indigo-light);
    margin: 0.25rem 0 1.25rem;
  }

  .fp-info-box {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--glass-border);
    border-radius: 12px;
    padding: 0.875rem 1rem;
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    text-align: left;
  }

  .fp-outline-btn {
    width: 100%;
    height: 44px;
    border: 1px solid var(--glass-border);
    border-radius: 13px;
    background: transparent;
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: background 0.2s, border-color 0.2s;
    margin-bottom: 1rem;
  }
  .fp-outline-btn:hover {
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.18);
  }

  /* ── Right panel ── */
  .fp-right {
    display: none;
    flex: 1.1;
    position: relative;
    background: var(--navy-2);
    overflow: hidden;
  }

  @media (min-width: 1024px) {
    .fp-right { display: flex; align-items: center; justify-content: center; }
  }

  .fp-mesh {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .fp-mesh-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.15;
  }

  .fp-mesh-circle.c1 {
    width: 480px; height: 480px;
    background: var(--indigo);
    top: -100px; left: -80px;
    animation: fp-float 10s ease-in-out infinite;
  }
  .fp-mesh-circle.c2 {
    width: 360px; height: 360px;
    background: var(--teal);
    bottom: -60px; right: -60px;
    animation: fp-float 13s ease-in-out infinite reverse;
  }
  .fp-mesh-circle.c3 {
    width: 220px; height: 220px;
    background: #a855f7;
    top: 55%; left: 40%;
    animation: fp-float 8s ease-in-out infinite 1.5s;
  }

  @keyframes fp-float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%       { transform: translate(14px, -16px) scale(1.04); }
    66%       { transform: translate(-10px, 10px) scale(0.97); }
  }

  .fp-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Security feature cards */
  .fp-features {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .fp-feat {
    position: absolute;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 0.875rem 1.125rem;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: fp-bob linear infinite;
  }

  .fp-feat.f1 { top: 20%; left: 6%;  animation-duration: 6.5s; animation-delay: 0s; }
  .fp-feat.f2 { top: 58%; right: 8%; animation-duration: 8.5s; animation-delay: 1s; }
  .fp-feat.f3 { bottom: 10%; left: 12%; animation-duration: 7.5s; animation-delay: 2.5s; }

  @keyframes fp-bob {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-8px); }
  }

  .fp-feat-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .fp-feat-icon.green  { background: rgba(52,211,153,0.15); }
  .fp-feat-icon.indigo { background: rgba(92,110,248,0.15); }
  .fp-feat-icon.amber  { background: rgba(251,191,36,0.15); }

  .fp-feat-val { font-size: 0.9rem; font-weight: 600; color: var(--white); line-height: 1; }
  .fp-feat-lbl { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }

  /* Hero copy */
  .fp-hero {
    position: relative;
    z-index: 1;
    text-align: center;
    padding: 2rem;
    max-width: 400px;
  }

  .fp-badge {
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

  .fp-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    line-height: 1.1;
    color: var(--white);
    margin: 0 0 1rem;
  }

  .fp-hero-title em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .fp-hero-desc {
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
  }

  /* Checklist items */
  .fp-checklist {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    text-align: left;
  }

  .fp-check-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.84rem;
    color: var(--muted);
  }

  .fp-check-dot {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: var(--green-bg);
    border: 1px solid rgba(52,211,153,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    .fp-card { padding: 1.75rem 1.25rem; }
    .fp-heading { font-size: 1.6rem; }
  }
`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("A server error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const RightPanel = () => (
    <div className="fp-right">
      <div className="fp-mesh">
        <div className="fp-mesh-circle c1" />
        <div className="fp-mesh-circle c2" />
        <div className="fp-mesh-circle c3" />
      </div>
      <div className="fp-grid" />

      {/* Floating feature cards */}
      <div className="fp-features">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="fp-feat f1"
        >
          <div className="fp-feat-icon green"><ShieldCheck size={16} color="#34d399" /></div>
          <div>
            <div className="fp-feat-val">256-bit</div>
            <div className="fp-feat-lbl">Encryption</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="fp-feat f2"
        >
          <div className="fp-feat-icon amber"><Clock size={16} color="#fbbf24" /></div>
          <div>
            <div className="fp-feat-val">24 hrs</div>
            <div className="fp-feat-lbl">Link expiry</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="fp-feat f3"
        >
          <div className="fp-feat-icon indigo"><KeyRound size={16} color="#818cf8" /></div>
          <div>
            <div className="fp-feat-val">Single-use</div>
            <div className="fp-feat-lbl">Reset token</div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fp-hero"
      >
        <div className="fp-badge">
          <Sparkles size={11} /> Account Security
        </div>
        <h2 className="fp-hero-title">
          Back in your<br /><em>account</em> in minutes.
        </h2>
        <p className="fp-hero-desc">
          We take security seriously. Your reset link is encrypted,
          single-use, and expires automatically after 24 hours.
        </p>
        <div className="fp-checklist">
          {[
            "Reset link sent directly to your inbox",
            "24-hour automatic expiration",
            "Single-use token for full protection",
          ].map((item) => (
            <div key={item} className="fp-check-item">
              <div className="fp-check-dot">
                <CheckCircle2 size={13} color="#34d399" />
              </div>
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  /* ── Success state ── */
  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="fp-root">
          <div className="fp-left">
            <div className="fp-card-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fp-card"
              >
                {/* Logo */}
                <div className="fp-logo-row">
                  <div className="fp-logo-dot">
                    <Sparkles size={15} color="#fff" />
                  </div>
                  <span className="fp-logo-text">QMS Platform</span>
                </div>

                {/* Success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 16 }}
                  className="fp-success-ring"
                >
                  <CheckCircle2 size={32} color="#34d399" />
                </motion.div>

                <h2 className="fp-success-title">Check your inbox</h2>
                <p className="fp-success-sub">We sent a reset link to</p>
                <div style={{ textAlign: "center" }}>
                  <span className="fp-email-pill">{email}</span>
                </div>

                <div className="fp-info-box">
                  Didn&apos;t receive it? Check your spam folder or make sure
                  you entered the correct address. The link expires in 24 hours.
                </div>

                <button
                  className="fp-outline-btn"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                >
                  <RefreshCw size={15} />
                  Try another email
                </button>

                <div className="fp-divider" />

                <div className="fp-signin-hint">
                  Remembered your password?{" "}
                  <Link href="/login">Sign in</Link>
                </div>

                <div style={{ textAlign: "center" }}>
                  <Link href="/login" className="fp-back">
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
          <RightPanel />
        </div>
      </>
    );
  }

  /* ── Default state ── */
  return (
    <>
      <style>{styles}</style>
      <div className="fp-root">
        <div className="fp-left">
          <div className="mt-24 fp-card-wrap">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="fp-card"
            >
              {/* Logo */}
              <div className="fp-logo-row">
                <div className="fp-logo-dot">
                  <Sparkles size={15} color="#fff" />
                </div>
                <span className="fp-logo-text">QMS Platform</span>
              </div>

              <h1 className="fp-heading">
                Forgot your <em>password?</em>
              </h1>
              <p className="fp-sub">
                No worries — enter your email and we&apos;ll send you a secure
                reset link right away.
              </p>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="fp-alert"
                >
                  <AlertCircle className="fp-alert-icon" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="fp-form">
                <div className="fp-field">
                  <label className="fp-label" htmlFor="email">Email Address</label>
                  <div className="fp-input-wrap">
                    <Mail className="fp-input-icon" />
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

                <button type="submit" className="fp-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="fp-spinner" />
                      Sending reset link…
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <div className="fp-divider" />

              <div className="fp-signin-hint">
                Remembered your password?{" "}
                <Link href="/login">Sign in</Link>
              </div>

              <div style={{ textAlign: "center" }}>
                <Link href="/login" className="fp-back">
                  <ArrowLeft size={14} /> Back to Login
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <RightPanel />
      </div>
    </>
  );
}