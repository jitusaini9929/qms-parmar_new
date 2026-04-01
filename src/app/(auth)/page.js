"use client";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Shield, Users, Database, Target, Globe, BarChart3,
  ArrowRight, Sparkles, CheckCircle2, Layers, Zap,
  KeyRound, ChevronRight,
} from "lucide-react";

/* ─── Google Fonts: DM Serif Display + DM Sans ───────────────────────
   Add to _document or root layout:
   <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
*/

const features = [
  {
    icon: Shield,
    title: "Enterprise-grade Security",
    description: "Advanced authentication with JWT sessions, RBAC permission layers, and protected API routes.",
    accent: "indigo",
  },
  {
    icon: Users,
    title: "Role-based Portals",
    description: "Dedicated dashboards for Super Admins, Admins, and Students with clear workflows.",
    accent: "teal",
  },
  {
    icon: Database,
    title: "Scalable Question Bank",
    description: "Store, categorize, and manage thousands of MCQs with blazing-fast search performance.",
    accent: "purple",
  },
  {
    icon: Target,
    title: "Smart Exam Builder",
    description: "Create balanced assessments by difficulty level, tags, and subject weightage.",
    accent: "indigo",
  },
  {
    icon: Globe,
    title: "Cloud Native",
    description: "Powered by Next.js 15 and MongoDB Atlas ensuring high availability and performance.",
    accent: "teal",
  },
  {
    icon: BarChart3,
    title: "Insightful Analytics",
    description: "Track performance trends, question success rate, and detailed exam insights.",
    accent: "purple",
  },
];

const stats = [
  { value: "10K+",  label: "Questions" },
  { value: "99.9%", label: "Reliability" },
  { value: "500+",  label: "Institutions" },
  { value: "24/7",  label: "Availability" },
];

const workflow = [
  {
    title: "Role-specific dashboards",
    desc: "Each user type receives a customized interface designed for efficiency.",
  },
  {
    title: "Fast API architecture",
    desc: "Modular APIs make integrations with LMS systems seamless.",
  },
  {
    title: "Real-time monitoring",
    desc: "Track exam progress and user performance instantly.",
  },
];

/* ─── CSS ─────────────────────────────────────────────────────────── */
const styles = `
  :root {
    --navy:         #0b0f1e;
    --navy-2:       #111628;
    --navy-3:       #1a2038;
    --indigo:       #5c6ef8;
    --indigo-light: #818cf8;
    --indigo-dim:   rgba(92,110,248,0.12);
    --teal:         #2dd4bf;
    --teal-dim:     rgba(45,212,191,0.12);
    --purple:       #a855f7;
    --purple-dim:   rgba(168,85,247,0.12);
    --white:        #f0f4ff;
    --muted:        rgba(240,244,255,0.48);
    --muted2:       rgba(240,244,255,0.28);
    --glass:        rgba(255,255,255,0.04);
    --glass-b:      rgba(255,255,255,0.08);
  }

   .hp-root *, .hp-root *::before, .hp-root *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .hp-root {
    font-family: 'DM Sans', sans-serif;
    background: var(--navy);
    color: var(--white);
    overflow-x: hidden;
    min-height: 100vh;
  }

  /* ── shared grid texture ── */
  .hp-grid-tex {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* ══════════════════════════════
     HERO
  ══════════════════════════════ */
  .hp-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem 1.5rem 5rem;
    text-align: center;
    overflow: hidden;
  }

  /* blobs */
  .hp-hero-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }
  .hp-hero-blob.b1 {
    width: 700px; height: 700px;
    background: var(--indigo);
    opacity: 0.10;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    animation: hp-pulse 9s ease-in-out infinite;
  }
  .hp-hero-blob.b2 {
    width: 400px; height: 400px;
    background: var(--teal);
    opacity: 0.08;
    bottom: 0; right: -100px;
    animation: hp-pulse 12s ease-in-out infinite reverse;
  }
  .hp-hero-blob.b3 {
    width: 300px; height: 300px;
    background: var(--purple);
    opacity: 0.07;
    top: 30%; left: -80px;
    animation: hp-pulse 8s ease-in-out infinite 2s;
  }
  @keyframes hp-pulse {
    0%,100% { transform: scale(1) translate(0,0); }
    50%      { transform: scale(1.08) translate(10px,-12px); }
  }

  /* badge */
  .hp-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(92,110,248,0.12);
    border: 1px solid rgba(92,110,248,0.28);
    border-radius: 999px;
    padding: 7px 16px;
    font-size: 0.70rem;
    font-weight: 500;
    color: var(--indigo-light);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 2rem;
  }

  /* headline */
  .hp-h1 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.0rem, 5.5vw, 5.5rem);
    font-weight: 400;
    line-height: 1.07;
    max-width: 820px;
    color: var(--white);
    margin-bottom: 0.5rem;
  }

  .hp-h1 em {
    font-style: italic;
    background: linear-gradient(100deg, var(--indigo-light) 0%, var(--teal) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hp-hero-sub {
    font-size: clamp(0.95rem, 2vw, 1.1rem);
    color: var(--muted);
    max-width: 560px;
    line-height: 1.75;
    font-weight: 300;
    margin: 1.5rem auto 2.75rem;
  }

  /* CTA row */
  .hp-cta-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.875rem;
  }

  .hp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 2rem;
    border-radius: 13px;
    border: none;
    background: linear-gradient(135deg, var(--indigo) 0%, #7c6ef8 100%);
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    box-shadow: 0 4px 22px rgba(92,110,248,0.38);
    transition: transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .hp-btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .hp-btn-primary:hover::before { opacity: 1; }
  .hp-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(92,110,248,0.45); }

  .hp-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 52px;
    padding: 0 2rem;
    border-radius: 13px;
    border: 1px solid var(--glass-b);
    background: var(--glass);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }
  .hp-btn-ghost:hover {
    background: rgba(255,255,255,0.07);
    border-color: rgba(255,255,255,0.18);
    transform: translateY(-2px);
  }

  /* Hero scroll indicator */
  .hp-scroll-hint {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    opacity: 0.3;
    animation: hp-fadebob 2.4s ease-in-out infinite;
  }
  @keyframes hp-fadebob {
    0%,100% { opacity: 0.25; transform: translateX(-50%) translateY(0); }
    50%      { opacity: 0.5;  transform: translateX(-50%) translateY(4px); }
  }
  .hp-scroll-line {
    width: 1px; height: 36px;
    background: linear-gradient(to bottom, transparent, var(--muted));
  }
  .hp-scroll-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--muted);
  }

  /* ══════════════════════════════
     STATS
  ══════════════════════════════ */
  .hp-stats {
    position: relative;
    z-index: 1;
    padding: 0 1.5rem 6rem;
  }

  .hp-stats-grid {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    background: var(--glass);
    border: 1px solid var(--glass-b);
    border-radius: 18px;
    overflow: hidden;
    backdrop-filter: blur(16px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
  }

  @media (max-width: 640px) {
    .hp-stats-grid { grid-template-columns: repeat(2,1fr); }
  }

  .hp-stat-cell {
    padding: 2rem 1rem;
    text-align: center;
    border-right: 1px solid var(--glass-b);
    position: relative;
    transition: background 0.25s;
  }
  .hp-stat-cell:last-child { border-right: none; }
  .hp-stat-cell:hover { background: rgba(92,110,248,0.06); }

  .hp-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 2.1rem;
    font-weight: 400;
    color: var(--white);
    line-height: 1;
    background: linear-gradient(135deg, var(--white) 0%, var(--indigo-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hp-stat-lbl {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted2);
    margin-top: 6px;
  }

  /* ══════════════════════════════
     FEATURES
  ══════════════════════════════ */
  .hp-features {
    position: relative;
    padding: 2rem 1.5rem 7rem;
    overflow: hidden;
  }

  .hp-section-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--indigo-light);
    margin-bottom: 1rem;
  }

  .hp-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4.5vw, 3.2rem);
    font-weight: 400;
    line-height: 1.15;
    color: var(--white);
    margin-bottom: 0.75rem;
    max-width: 600px;
  }

  .hp-section-title em {
    font-style: italic;
    color: var(--indigo-light);
  }

  .hp-section-sub {
    font-size: 0.9rem;
    color: var(--muted);
    font-weight: 300;
    max-width: 480px;
    line-height: 1.7;
  }

  .hp-section-head {
    text-align: center;
    max-width: 640px;
    margin: 0 auto 4rem;
  }

  .hp-features-grid {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 1.25rem;
  }

  @media (max-width: 900px) { .hp-features-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 560px) { .hp-features-grid { grid-template-columns: 1fr; } }

  .hp-feat-card {
    background: var(--glass);
    border: 1px solid var(--glass-b);
    border-radius: 18px;
    padding: 1.75rem;
    position: relative;
    overflow: hidden;
    transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s;
    cursor: default;
  }

  .hp-feat-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .hp-feat-card.accent-indigo::before { background: radial-gradient(ellipse 60% 60% at 0% 0%, rgba(92,110,248,0.10), transparent); }
  .hp-feat-card.accent-teal::before   { background: radial-gradient(ellipse 60% 60% at 0% 0%, rgba(45,212,191,0.10), transparent); }
  .hp-feat-card.accent-purple::before { background: radial-gradient(ellipse 60% 60% at 0% 0%, rgba(168,85,247,0.10), transparent); }

  .hp-feat-card:hover { transform: translateY(-4px); border-color: rgba(255,255,255,0.14); }
  .hp-feat-card:hover::before { opacity: 1; }
  .hp-feat-card.accent-indigo:hover { box-shadow: 0 12px 40px rgba(92,110,248,0.14); }
  .hp-feat-card.accent-teal:hover   { box-shadow: 0 12px 40px rgba(45,212,191,0.12); }
  .hp-feat-card.accent-purple:hover { box-shadow: 0 12px 40px rgba(168,85,247,0.12); }

  .hp-feat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
  }
  .hp-feat-icon.accent-indigo { background: var(--indigo-dim); }
  .hp-feat-icon.accent-teal   { background: var(--teal-dim); }
  .hp-feat-icon.accent-purple { background: var(--purple-dim); }

  .hp-feat-title {
    font-size: 0.97rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 0.5rem;
    line-height: 1.3;
  }

  .hp-feat-desc {
    font-size: 0.82rem;
    color: var(--muted);
    line-height: 1.7;
    font-weight: 300;
  }

  /* ══════════════════════════════
     WORKFLOW
  ══════════════════════════════ */
  .hp-workflow {
    position: relative;
    background: var(--navy-2);
    border-top: 1px solid var(--glass-b);
    border-bottom: 1px solid var(--glass-b);
    padding: 6rem 1.5rem;
    overflow: hidden;
  }

  .hp-workflow-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: center;
  }

  @media (max-width: 768px) {
    .hp-workflow-inner { grid-template-columns: 1fr; gap: 3rem; }
    .hp-terminal { order: -1; }
  }

  .hp-workflow-list {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    margin-top: 2.5rem;
  }

  .hp-wf-item {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .hp-wf-check {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: rgba(45,212,191,0.12);
    border: 1px solid rgba(45,212,191,0.25);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .hp-wf-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 4px;
  }

  .hp-wf-desc {
    font-size: 0.82rem;
    color: var(--muted);
    font-weight: 300;
    line-height: 1.65;
  }

  /* Terminal mock */
  .hp-terminal {
    background: #080c18;
    border: 1px solid var(--glass-b);
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
  }

  .hp-term-bar {
    background: rgba(255,255,255,0.04);
    border-bottom: 1px solid var(--glass-b);
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .hp-term-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
  }
  .hp-term-dot.r { background: #ff5f57; }
  .hp-term-dot.y { background: #ffbd2e; }
  .hp-term-dot.g { background: #28c941; }

  .hp-term-title {
    font-size: 0.72rem;
    color: var(--muted2);
    margin-left: 0.5rem;
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  .hp-term-body {
    padding: 1.5rem;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 0.78rem;
    line-height: 1.8;
  }

  .hp-term-row { display: flex; gap: 0.75rem; }
  .hp-term-prompt { color: var(--indigo-light); user-select: none; }
  .hp-term-cmd { color: #e2e8f0; }
  .hp-term-out { color: var(--muted); padding-left: 1rem; }
  .hp-term-key { color: var(--teal); }
  .hp-term-val { color: #f0f4ff; }
  .hp-term-ok  { color: var(--teal); }
  .hp-term-dim { color: var(--muted2); }

  /* metrics row */
  .hp-term-metrics {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 0.75rem;
  }

  .hp-term-metric {
    background: rgba(92,110,248,0.08);
    border: 1px solid rgba(92,110,248,0.15);
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    text-align: center;
  }

  .hp-term-mval {
    font-size: 1rem;
    font-weight: 700;
    color: var(--indigo-light);
    display: block;
    line-height: 1;
  }

  .hp-term-mlbl {
    font-size: 0.62rem;
    color: var(--muted2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-top: 3px;
    display: block;
    font-family: 'DM Sans', sans-serif;
  }

  /* ══════════════════════════════
     CTA
  ══════════════════════════════ */
  .hp-cta {
    position: relative;
    padding: 4.5rem 1.5rem;
    text-align: center;
    overflow: hidden;
  }

  .hp-cta-blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
  }
  .hp-cta-blob.b1 {
    width: 500px; height: 500px;
    background: var(--indigo);
    opacity: 0.09;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    animation: hp-pulse 10s ease-in-out infinite;
  }
  .hp-cta-blob.b2 {
    width: 300px; height: 300px;
    background: var(--teal);
    opacity: 0.06;
    bottom: 0; right: 10%;
    animation: hp-pulse 13s ease-in-out infinite reverse;
  }

  .hp-cta-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--indigo-light);
    margin-bottom: 1.25rem;
  }

  .hp-cta-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.2rem, 5.5vw, 4rem);
    font-weight: 400;
    line-height: 1.1;
    color: var(--white);
    max-width: 700px;
    margin: 0 auto 1.25rem;
  }

  .hp-cta-title em {
    font-style: italic;
    background: linear-gradient(100deg, var(--indigo-light) 0%, var(--teal) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hp-cta-sub {
    font-size: 0.9rem;
    color: var(--muted);
    max-width: 440px;
    margin: 0 auto 2.75rem;
    line-height: 1.75;
    font-weight: 300;
  }

  .hp-cta-divider {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, var(--glass-b), transparent);
    margin: 2.5rem auto 0;
  }

  /* ── responsive tweaks ── */
  @media (max-width: 480px) {
    .hp-h1 { font-size: 2.4rem; }
    .hp-btn-primary, .hp-btn-ghost { height: 46px; padding: 0 1.5rem; font-size: 0.85rem; }
  }
`;

/* ── icon color helper ── */
const iconColor = { indigo: "#818cf8", teal: "#2dd4bf", purple: "#c084fc" };

/* ════════════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <>
      <style>{styles}</style>
      <div className="hp-root">

        {/* ══ HERO ══════════════════════════════════════════════════ */}
        <section className="hp-hero">
          <div className="hp-grid-tex" />
          <div className="hp-hero-blob b1" />
          <div className="hp-hero-blob b2" />
          <div className="hp-hero-blob b3" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="hp-badge"
          >
            <Sparkles size={11} />
            Modern Question Management Platform
          </motion.div>

          <motion.h1
            className="hp-h1"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Simplify Exam Management<br />
            with <em>Precision</em> & Scale
          </motion.h1>

          <motion.p
            className="hp-hero-sub"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.22 }}
          >
            A powerful Question Management System designed for modern institutions.
            Secure architecture, flexible workflows, and real-time performance insights.
          </motion.p>

          <motion.div
            className="hp-cta-row"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.34 }}
          >
            <Link href="/register" className="hp-btn-primary">
              Get Started <ArrowRight size={16} />
            </Link>
            <Link href="/login" className="hp-btn-ghost">
              Login to Dashboard <ChevronRight size={15} />
            </Link>
          </motion.div>

          {/* scroll hint */}
          <div className="hp-scroll-hint">
            <div className="hp-scroll-line" />
            <div className="hp-scroll-dot" />
          </div>
        </section>

        {/* ══ STATS ═════════════════════════════════════════════════ */}
        <section className="hp-stats">
          <motion.div
            className="hp-stats-grid"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((s, i) => (
              <div key={i} className="hp-stat-cell">
                <div className="hp-stat-val">{s.value}</div>
                <div className="hp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ══ FEATURES ══════════════════════════════════════════════ */}
        <section className="hp-features">
          <div className="hp-grid-tex" style={{ opacity: 0.5 }} />

          <div className="hp-section-head">
            <div className="hp-section-label">
              <Sparkles size={11} /> Platform Features
            </div>
            <h2 className="hp-section-title" style={{ margin: "0 auto 0.75rem" }}>
              Powerful tools for <em>modern</em> institutions
            </h2>
            <p className="hp-section-sub" style={{ margin: "0 auto" }}>
              Designed for scalability, security, and performance — every feature
              built with real exam workflows in mind.
            </p>
          </div>

          <div className="hp-features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={`hp-feat-card accent-${f.accent}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className={`hp-feat-icon accent-${f.accent}`}>
                  <f.icon size={20} color={iconColor[f.accent]} />
                </div>
                <div className="hp-feat-title">{f.title}</div>
                <div className="hp-feat-desc">{f.description}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══ WORKFLOW ══════════════════════════════════════════════ */}
        <section className="hp-workflow">
          <div className="hp-grid-tex" />

          {/* ambient blobs */}
          <div style={{
            position: "absolute", width: 400, height: 400,
            borderRadius: "50%", filter: "blur(100px)",
            background: "var(--indigo)", opacity: 0.06,
            top: "-100px", right: "-80px", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", width: 300, height: 300,
            borderRadius: "50%", filter: "blur(90px)",
            background: "var(--teal)", opacity: 0.05,
            bottom: "-60px", left: "-60px", pointerEvents: "none",
          }} />

          <div className="hp-workflow-inner">
            {/* Left copy */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hp-section-label">
                <Zap size={11} /> How it works
              </div>
              <h2 className="hp-section-title">
                Designed for <em>real</em> exam workflows
              </h2>
              <p className="hp-section-sub">
                Every layer of QMS is built around how real institutions operate —
                from creation to delivery to analysis.
              </p>

              <div className="hp-workflow-list">
                {workflow.map((item, i) => (
                  <motion.div
                    key={i}
                    className="hp-wf-item"
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                  >
                    <div className="hp-wf-check">
                      <CheckCircle2 size={13} color="#2dd4bf" />
                    </div>
                    <div>
                      <div className="hp-wf-title">{item.title}</div>
                      <div className="hp-wf-desc">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Terminal mock */}
            <motion.div
              className="hp-terminal"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="hp-term-bar">
                <div className="hp-term-dot r" />
                <div className="hp-term-dot y" />
                <div className="hp-term-dot g" />
                <span className="hp-term-title">qms dashboard · live metrics</span>
              </div>

              <div className="hp-term-body">
                <div className="hp-term-row">
                  <span className="hp-term-prompt">▸</span>
                  <span className="hp-term-cmd">qms status --live</span>
                </div>
                <div style={{ marginTop: "0.5rem" }}>
                  <div className="hp-term-out">
                    <span className="hp-term-key">system      </span>
                    <span className="hp-term-ok">● online</span>
                  </div>
                  <div className="hp-term-out">
                    <span className="hp-term-key">database    </span>
                    <span className="hp-term-ok">● connected</span>
                    <span className="hp-term-dim"> (Atlas)</span>
                  </div>
                  <div className="hp-term-out">
                    <span className="hp-term-key">auth        </span>
                    <span className="hp-term-ok">● jwt · rbac</span>
                  </div>
                  <div className="hp-term-out">
                    <span className="hp-term-key">active users</span>
                    <span className="hp-term-val"> 1,284</span>
                  </div>
                  <div className="hp-term-out">
                    <span className="hp-term-key">uptime      </span>
                    <span className="hp-term-val"> 99.97%</span>
                  </div>
                </div>

                <div style={{ marginTop: "1rem" }} className="hp-term-row">
                  <span className="hp-term-prompt">▸</span>
                  <span className="hp-term-cmd">qms questions --summary</span>
                </div>

                <div className="hp-term-metrics">
                  <div className="hp-term-metric">
                    <span className="hp-term-mval">10.4K</span>
                    <span className="hp-term-mlbl">Total MCQs</span>
                  </div>
                  <div className="hp-term-metric">
                    <span className="hp-term-mval">98.2%</span>
                    <span className="hp-term-mlbl">Reviewed</span>
                  </div>
                  <div className="hp-term-metric">
                    <span className="hp-term-mval">340</span>
                    <span className="hp-term-mlbl">Subjects</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ CTA ═══════════════════════════════════════════════════ */}
        <section className="hp-cta">
          <div className="hp-grid-tex" />
          <div className="hp-cta-blob b1" />
          <div className="hp-cta-blob b2" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", zIndex: 1 }}
          >
            <div className="hp-cta-eyebrow">
              <Sparkles size={11} /> Ready to begin?
            </div>
            <h2 className="hp-cta-title">
              Start building <em>better exams</em><br />today
            </h2>
            <p className="hp-cta-sub">
              Reduce manual effort, eliminate data inconsistencies, and streamline
              assessment workflows across your institution.
            </p>

            <div className="hp-cta-row">
              <Link href="/register" className="hp-btn-primary">
                Get Started Free <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="hp-btn-ghost">
                Open Dashboard <ChevronRight size={15} />
              </Link>
            </div>

            <div className="hp-cta-divider" />
          </motion.div>
        </section>

      </div>
    </>
  );
}