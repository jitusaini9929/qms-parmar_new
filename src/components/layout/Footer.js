import { Github, Linkedin, Mail } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --navy: 	#020617;
    --indigo: #0f172a;
    --teal: #1fb8a8;
  }

  .footer-root { font-family: 'DM Sans', sans-serif; }

  .footer-wrapper {
    background: var(--navy);
    position: relative;
    overflow: hidden;
  }

  .footer-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 10% 110%, rgba(31,184,168,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 50% at 90% -10%, rgba(61,77,196,0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .footer-inner {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 3.5rem 2rem 2rem;
  }

  .footer-topline {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--indigo), var(--teal), transparent);
    margin-bottom: 3rem;
    opacity: 0.6;
  }

  .footer-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr 1fr;
    gap: 3rem;
    align-items: start;
  }

  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr; gap: 2rem; text-align: center; }
    .footer-social { justify-content: center !important; }
    .footer-links { align-items: center; }
  }

  .footer-brand-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    background: linear-gradient(135deg, #ffffff 30%, var(--teal));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 0.75rem;
  }

  .footer-brand-tag {
    display: inline-block;
    font-size: 0.65rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--teal);
    border: 1px solid rgba(31,184,168,0.35);
    padding: 0.2rem 0.6rem;
    border-radius: 2px;
    margin-bottom: 0.85rem;
  }

  .footer-brand-desc {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.42);
    line-height: 1.7;
    max-width: 240px;
    font-weight: 300;
  }

  .footer-col-label {
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--teal);
    margin-bottom: 1.25rem;
    font-weight: 500;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-link {
    font-size: 0.82rem;
    color: rgba(255,255,255,0.48);
    text-decoration: none;
    font-weight: 300;
    letter-spacing: 0.02em;
    position: relative;
    width: fit-content;
    transition: color 0.25s ease;
  }

  .footer-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 0;
    height: 1px;
    background: linear-gradient(90deg, var(--indigo), var(--teal));
    transition: width 0.3s ease;
  }

  .footer-link:hover { color: rgba(255,255,255,0.9); }
  .footer-link:hover::after { width: 100%; }

  .footer-social { display: flex; gap: 0.75rem; }

  .footer-social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .footer-social-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--indigo), var(--teal));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .footer-social-btn svg { position: relative; z-index: 1; }

  .footer-social-btn:hover {
    color: #fff;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(61,77,196,0.3);
  }

  .footer-social-btn:hover::before { opacity: 1; }

  .footer-bottom {
    margin-top: 3rem;
    padding-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .footer-copy {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.22);
    letter-spacing: 0.04em;
    font-weight: 300;
  }

  .footer-copy span { color: var(--teal); opacity: 0.7; }

  .footer-status {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.68rem;
    color: rgba(255,255,255,0.22);
    letter-spacing: 0.06em;
  }

  .footer-status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--teal);
    box-shadow: 0 0 6px var(--teal);
    animation: pulse-dot 2.5s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.35; }
  }
`;

export default function Footer() {
  return (
    <footer className="footer-root">
      <style>{styles}</style>
      <div className="footer-wrapper">
        <div className="footer-inner">
          <div className="footer-topline" />
          <div className="footer-grid">

            {/* Brand */}
            <div>
              <h2 className="footer-brand-name">QMS V1.0</h2>
              <span className="footer-brand-tag">Question Management</span>
              <p className="footer-brand-desc">
                Smart Question Management System designed for efficiency, clarity, and intelligent workflows.
              </p>
            </div>

            {/* Nav Links */}
            <div>
              <p className="footer-col-label">Navigate</p>
              <div className="footer-links">
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Support Center</a>
                <a href="#" className="footer-link">Documentation</a>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="footer-col-label">Connect</p>
              <div className="footer-social">
                <a href="#" className="footer-social-btn" aria-label="GitHub">
                  <Github size={16} />
                </a>
                <a href="#" className="footer-social-btn" aria-label="LinkedIn">
                  <Linkedin size={16} />
                </a>
                <a href="#" className="footer-social-btn" aria-label="Email">
                  <Mail size={16} />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} QMS V1.0 — Crafted with <span>precision</span>.
            </p>
            <div className="footer-status">
              <span className="footer-status-dot" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}