import { useState, useRef, useEffect, useCallback } from "react";

// ─── EMAILJS CONFIG ───────────────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = "vJyN2T-5XTZ0RC3e-";
const EMAILJS_SERVICE_ID  = "service_q2xite5";
const EMAILJS_TEMPLATE_ID = "template_8dv03qr";
const EMAILJS_ENABLED     = true;

// ─── BREVO EMAIL CONFIG (sends welcome email from hr@ltmmindtree.com) ───────────
// Step 1: Sign up free at brevo.com
// Step 2: Add sender hr@ltmmindtree.com → verify via Roundcube
// Step 3: Get API key → add to Vercel env vars as VITE_BREVO_API_KEY
const BREVO_API_KEY    = typeof import.meta !== "undefined" && import.meta.env?.VITE_BREVO_API_KEY || "YOUR_BREVO_API_KEY";
const BREVO_SENDER_EMAIL = "hr@ltmmindtree.com";
const BREVO_SENDER_NAME  = "LTM HR Onboarding";
const BREVO_ENABLED    = BREVO_API_KEY !== "YOUR_BREVO_API_KEY";

// ─── LTM HTML Email Template ──────────────────────────────────────────────────
const buildLTMEmail = ({ candidateName, portalLink }) => `
<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0eef6;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:28px 12px;background:#f0eef6;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #ddd8f0;">
  <tr><td style="height:6px;background:linear-gradient(90deg,#6B2B82,#D4198C,#EB754F);font-size:0;">&nbsp;</td></tr>
  <tr><td style="background:#0e0619;padding:22px 28px;">
    <span style="font-family:'Arial Black',Arial,sans-serif;font-size:26px;font-weight:900;color:#D4198C;letter-spacing:-1px;">LTM</span>
    <span style="display:block;font-size:7px;color:#4a4258;letter-spacing:3px;margin-top:2px;">OUTCREATE</span>
  </td></tr>
  <tr><td style="background:#6B2B82;padding:14px 28px;">
    <p style="margin:0;font-size:11px;font-weight:700;color:#f0c8ff;letter-spacing:0.1em;text-transform:uppercase;">Document Submission Request</p>
  </td></tr>
  <tr><td style="padding:26px 28px 0;background:#fff;">
    <p style="margin:0 0 14px;font-size:15px;color:#1a1a1a;">Dear <strong>${candidateName}</strong>,</p>
    <p style="margin:0 0 14px;font-size:13px;color:#444;line-height:1.7;">We are delighted to welcome you to the <strong>LTM</strong> family! You have successfully completed your selection process and we are excited to have you join us.</p>
    <p style="margin:0 0 20px;font-size:13px;color:#444;line-height:1.7;">Please submit the required documents through our secure portal to complete your background verification and onboarding.</p>
    <div style="background:#faf8ff;border:1px solid #e0d8f5;border-radius:10px;margin-bottom:20px;">
      <div style="padding:12px 16px;border-bottom:1px solid #e0d8f5;"><p style="margin:0;font-size:11px;font-weight:700;color:#6B2B82;text-transform:uppercase;letter-spacing:0.06em;">Documents Required</p></div>
      <div style="padding:12px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td width="50%" style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>PAN Card</td><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Aadhaar Card</td></tr>
          <tr><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Updated Resume</td><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Signed Offer Letter</td></tr>
          <tr><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Experience Letter</td><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Last 3 Payslips</td></tr>
          <tr><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Degree Certificate</td><td style="font-size:12px;color:#333;padding:3px 0;"><span style="color:#D4198C;margin-right:5px;">›</span>Passport Photo</td></tr>
        </table>
      </div>
    </div>
    <div style="background:#0e0619;border-radius:12px;overflow:hidden;margin-bottom:20px;">
      <div style="height:3px;background:#6B2B82;"></div>
      <div style="padding:18px 22px;text-align:center;">
        <p style="margin:0 0 5px;font-size:11px;font-weight:700;color:#d4aee8;text-transform:uppercase;letter-spacing:0.06em;">Secure Document Portal</p>
        <p style="margin:0 0 14px;font-size:12px;color:#9890a8;line-height:1.5;">Register using this email address to verify your identity and get started.</p>
        <a href="${portalLink}" style="display:inline-block;background:#D4198C;color:#fff;text-decoration:none;font-size:14px;font-weight:700;padding:13px 32px;border-radius:8px;">Access Document Portal &rarr;</a>
      </div>
    </div>
    <div style="background:#faf8ff;border-left:3px solid #6B2B82;padding:14px 16px;margin-bottom:20px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#6B2B82;">Security & Confidentiality Notice</p>
      <p style="margin:0 0 4px;font-size:11px;color:#555;line-height:1.5;">• This link is unique and intended solely for you. Do not share it.</p>
      <p style="margin:0 0 4px;font-size:11px;color:#555;line-height:1.5;">• All documents are encrypted per data protection regulations.</p>
      <p style="margin:0;font-size:11px;color:#555;line-height:1.5;">• Data deleted after 90 days of onboarding completion.</p>
    </div>
    <div style="background:#faf8ff;border:1px solid #e0d8f5;border-radius:10px;margin-bottom:20px;">
      <div style="padding:10px 16px;border-bottom:1px solid #e0d8f5;"><p style="margin:0;font-size:12px;font-weight:700;color:#6B2B82;">Submission Guidelines</p></div>
      <div style="padding:10px 16px;">
        <p style="margin:0 0 4px;font-size:11px;color:#555;line-height:1.5;">• Ensure all documents are clear, complete, valid, and accurate.</p>
        <p style="margin:0 0 4px;font-size:11px;color:#555;line-height:1.5;">• Accepted formats: PDF, JPG, PNG. Max 10MB per file.</p>
        <p style="margin:0 0 4px;font-size:11px;color:#555;line-height:1.5;">• Our AI assistant on the portal answers any document queries 24/7.</p>
        <p style="margin:0;font-size:11px;color:#555;line-height:1.5;">• Please submit within <strong>5 working days</strong>.</p>
      </div>
    </div>
    <div style="background:linear-gradient(135deg,#f8f4ff,#fdf0f8);border:1px solid #e0d0f0;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
      <table cellpadding="0" cellspacing="0"><tr>
        <td style="vertical-align:top;padding-right:12px;"><div style="width:34px;height:34px;background:#6B2B82;border-radius:9px;text-align:center;line-height:34px;font-size:18px;">&#129302;</div></td>
        <td><p style="margin:0 0 3px;font-size:12px;font-weight:700;color:#6B2B82;">LTM Buddy — AI Onboarding Assistant</p><p style="margin:0;font-size:11px;color:#666;line-height:1.5;">Not sure about a document? Our AI assistant is available 24/7 on the portal to help you.</p></td>
      </tr></table>
    </div>
    <p style="margin:0 0 6px;font-size:13px;color:#444;">For queries: <a href="mailto:hr@ltmmindtree.com" style="color:#D4198C;text-decoration:none;font-weight:600;">hr@ltmmindtree.com</a></p>
    <p style="margin:0 0 4px;font-size:13px;color:#333;font-weight:700;">With warm regards,</p>
    <p style="margin:0 0 24px;font-size:13px;color:#6B2B82;font-weight:700;">LTM People & Culture — Onboarding Team</p>
  </td></tr>
  <tr><td style="background:#0e0619;padding:14px 28px;">
    <p style="margin:0;font-size:10px;color:#6a6280;">Automated email. Do not reply. &copy; 2026 LTM Limited. All rights reserved.</p>
  </td></tr>
  <tr><td style="height:5px;font-size:0;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="width:33%;height:5px;background:#6B2B82;font-size:0;">&nbsp;</td>
      <td style="width:34%;height:5px;background:#D4198C;font-size:0;">&nbsp;</td>
      <td style="width:33%;height:5px;background:#EB754F;font-size:0;">&nbsp;</td>
    </tr></table>
  </td></tr>
</table>
</td></tr></table>
</body></html>
`;

// ─── Send welcome email via Brevo ─────────────────────────────────────────────
const sendWelcomeEmail = async ({ toEmail, toName, portalLink }) => {
  if (!BREVO_ENABLED) {
    console.log("[Brevo] Not configured — skipping welcome email");
    return;
  }
  const emailHtml = buildLTMEmail({ candidateName: toName, portalLink });
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender:  { name: BREVO_SENDER_NAME, email: BREVO_SENDER_EMAIL },
      to:      [{ email: toEmail, name: toName }],
      subject: `Welcome to LTM — Action Required: Submit Your Documents`,
      htmlContent: emailHtml,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("[Brevo] Failed:", err);
    throw new Error(`Brevo error: ${res.status}`);
  }
  console.log("[Brevo] Welcome email sent to:", toEmail);
};

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL     = "https://rukjeevvglztxaydhcyr.supabase.co";
const SUPABASE_ANON    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a2plZXZ2Z2x6dHhheWRoY3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNTA1MDEsImV4cCI6MjA5NTYyNjUwMX0.crHJSqyToPRcGaH2yOYs1BshIS8Ns-7KPVOXdxvhDmM";
const SUPABASE_ENABLED = true;

// ─── ANTHROPIC API (AI Document Helper) ──────────────────────────────────────
// Uses Claude via the Anthropic API for the in-portal AI assistant
const AI_SYSTEM_PROMPT = `You are LTM Buddy, a friendly onboarding assistant for LTM (formerly LTIMindtree). 
Help candidates understand what documents are needed, why they are needed, what to do if they don't have a document, 
and answer general onboarding questions. Be concise (2-3 sentences max), warm, and helpful.
Do NOT discuss salaries, joining dates, or confidential company info. 
For urgent HR queries always say "Please contact hr.onboarding@ltm.com".`;

// ─── LTM Brand ────────────────────────────────────────────────────────────────
const C = {
  purple:   "#6B2B82",
  purpleMd: "#8B3EA8",
  purpleLt: "#a855d4",
  pink:     "#D4198C",
  pinkDk:   "#a8126e",
  orange:   "#EB754F",
  bg:       "#07050a",
  bgAlt:    "#0e0b14",
  surf:     "#120f1a",
  surfUp:   "#1a1525",
  border:   "#2a2035",
  borderUp: "#3a304a",
  textPri:  "#f0eef5",
  textSec:  "#9890a8",
  textMute: "#4a4258",
  green:    "#22c55e",
  greenDk:  "#16a34a",
};

const GRAD = `linear-gradient(135deg,${C.purple},${C.pink},${C.orange})`;
const GRAD2 = `linear-gradient(135deg,${C.purple},${C.pink})`;

// ─── Documents config ─────────────────────────────────────────────────────────
// required: mandatory for all | fresherOptional: not needed for freshers (can mark N/A)
const DOCS = [
  { id:"pan",    label:"PAN Card",              emoji:"🪪", color:"#8B3EA8", required:true,  fresherOptional:false,
    why:"Required for tax declaration (Form 12B) and payroll setup.",
    missing:"Apply at NSDL (tin.tin.nsdl.com) or UTI. Takes 7–10 days. Share acknowledgment slip meanwhile.",
    accept:"image/*,.pdf", maxMB:5 },
  { id:"aadh",   label:"Aadhaar Card",           emoji:"🪪", color:"#D4198C", required:true,  fresherOptional:false,
    why:"Primary identity proof and KYC document as per government mandate.",
    missing:"Download from uidai.gov.in using your registered mobile. eAadhaar PDF is accepted.",
    accept:"image/*,.pdf", maxMB:5 },
  { id:"resume", label:"Updated Resume",         emoji:"📄", color:"#6B2B82", required:true,  fresherOptional:false,
    why:"Updated for HR records and to assign you to the right project team.",
    missing:"Create one using LinkedIn's export feature or Google Docs. Keep it current.",
    accept:".pdf,.doc,.docx", maxMB:10 },
  { id:"offer",  label:"Signed Offer Letter",    emoji:"✍️", color:"#EB754F", required:false, fresherOptional:true,
    why:"Confirms acceptance of the offer and employment terms.",
    missing:"If you haven't received your offer letter yet, click N/A below. HR will share it separately and you can resubmit later.",
    accept:".pdf", maxMB:10 },
  { id:"exp",    label:"Experience Letter",       emoji:"🏢", color:"#8B3EA8", required:false, fresherOptional:true,
    why:"Verifies prior employment and is needed for background check.",
    missing:"Request from your previous HR team via email. It typically takes 2–5 working days.",
    accept:"image/*,.pdf", maxMB:10 },
  { id:"pay",    label:"Last 3 Payslips",         emoji:"💰", color:"#D4198C", required:false, fresherOptional:true,
    why:"Used for compensation benchmarking and salary structure planning.",
    missing:"Download from your previous employer's payroll portal (Greythr, ADP, Darwinbox etc.).",
    accept:".pdf,.zip", maxMB:20 },
  { id:"degree", label:"Degree Certificate",      emoji:"🎓", color:"#6B2B82", required:true,  fresherOptional:false,
    why:"Educational qualification verification as part of background check.",
    missing:"Contact your university registrar. Provisional certificate or marksheet is accepted.",
    accept:"image/*,.pdf", maxMB:10 },
  { id:"photo",  label:"Passport Photo",          emoji:"📸", color:"#EB754F", required:true,  fresherOptional:false,
    why:"For your LTM employee ID card and internal directory.",
    missing:"Use a recent photo app or photo studio. White/light background, front-facing, no glasses.",
    accept:"image/*", maxMB:2 },
];

// ─── WhatsApp status timeline ────────────────────────────────────────────────
const WA_STATUSES = [
  { key:"submitted",  label:"Documents Submitted",   icon:"📤", desc:"Your documents are in our queue.",         color:"#6B2B82" },
  { key:"reviewing",  label:"Under Review",           icon:"🔍", desc:"HR team is verifying your documents.",     color:"#D4198C" },
  { key:"approved",   label:"Documents Approved",     icon:"✅", desc:"All documents verified successfully!",     color:"#22c55e" },
  { key:"joining",    label:"Joining Confirmed",       icon:"🎉", desc:"Welcome to LTM! Check your email for Day 1 details.", color:"#EB754F" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtSize = b => b < 1048576 ? `${(b/1024).toFixed(0)} KB` : `${(b/1048576).toFixed(1)} MB`;
const genOTP  = () => Math.floor(100000 + Math.random() * 900000).toString();
const genRef  = () => `LTM-${Date.now().toString(36).slice(-8).toUpperCase()}`;

// ─── SDK Loaders ──────────────────────────────────────────────────────────────
const loadEmailJS = () => new Promise(res => {
  if (window.emailjs) { res(window.emailjs); return; }
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
  s.onload = () => res(window.emailjs);
  document.head.appendChild(s);
});

const getSupabase = () => new Promise((res, rej) => {
  if (window._sb) { res(window._sb); return; }
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js";
  s.onload = () => { window._sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON); res(window._sb); };
  s.onerror = rej;
  document.head.appendChild(s);
});

const sendOtpEmail = async ({ toEmail, toName, otpCode }) => {
  const ejs = await loadEmailJS();
  await ejs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
    { to_email: toEmail, to_name: toName, otp_code: otpCode, company_name: "LTM" },
    { publicKey: EMAILJS_PUBLIC_KEY });
};

const saveToSupabase = async ({ user, files, refNumber }) => {
  if (!SUPABASE_ENABLED) return;
  const db = await getSupabase();
  const { data: cand, error: ce } = await db.from("candidates").upsert({
    name: user.name, email: user.email, phone: user.phone,
    job_title: user.jobTitle, submission_status: "submitted",
    reference_number: refNumber, submitted_at: new Date().toISOString(),
  }, { onConflict:"email" }).select().single();
  if (ce) throw ce;
  for (const [docId, file] of Object.entries(files)) {
    const path = `${user.email.replace(/[^a-z0-9]/gi,"_").toLowerCase()}/${docId}_${Date.now()}_${file.name}`;
    const { error: ue } = await db.storage.from("documents").upload(path, file, { upsert:true });
    if (!ue) await db.from("documents").insert({ candidate_id:cand.id, doc_type:docId, file_name:file.name, file_path:path, file_size:file.size });
  }
  return cand;
};

const askAI = async (messages) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: AI_SYSTEM_PROMPT,
      messages,
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "I'm having trouble connecting. Please try again.";
};

// ─── useIsDesktop ─────────────────────────────────────────────────────────────
const useIsDesktop = () => {
  const [d, setD] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 900 : true);
  useEffect(() => {
    let t;
    const fn = () => { clearTimeout(t); t = setTimeout(() => setD(window.innerWidth >= 900), 150); };
    window.addEventListener("resize", fn);
    return () => { window.removeEventListener("resize", fn); clearTimeout(t); };
  }, []);
  return d;
};

// ─── Global CSS injected once ─────────────────────────────────────────────────
const GlobalStyle = () => {
  const done = useRef(false);
  if (!done.current && typeof document !== "undefined") {
    done.current = true;
    const el = document.createElement("style");
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:#07050a;-webkit-tap-highlight-color:transparent;font-family:'Inter',sans-serif;}
      input,button,textarea{font-family:inherit;}
      ::-webkit-scrollbar{width:4px;}
      ::-webkit-scrollbar-track{background:#07050a;}
      ::-webkit-scrollbar-thumb{background:#2a2035;border-radius:2px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
      .fu{animation:fadeUp 0.4s ease both;}
      @keyframes spin{to{transform:rotate(360deg)}}
      .spin{animation:spin 0.8s linear infinite;display:inline-block;}
      @keyframes pop{from{transform:scale(0.5);opacity:0}to{transform:scale(1);opacity:1}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
      .puls{animation:pulse 1.5s ease infinite;}
      @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
      @keyframes cardFlip{from{transform:rotateY(0)}to{transform:rotateY(180deg)}}
      .ltm-field{width:100%;background:#120f1a;border:1.5px solid #2a2035;border-radius:10px;color:#f0eef5;font-size:15px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;-webkit-appearance:none;}
      .ltm-field:focus{border-color:#D4198C !important;box-shadow:0 0 0 3px rgba(212,25,140,0.15);}
      .wa-tick{display:inline-flex;gap:1px;color:#53bdeb;}
      .card-scene{perspective:1000px;}
      .card-inner{position:relative;transform-style:preserve-3d;transition:transform 0.6s cubic-bezier(.4,0,.2,1);}
      .card-inner.flipped{transform:rotateY(180deg);}
      .card-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;}
      .card-back{transform:rotateY(180deg);}
      .doc-card:hover .flip-hint{opacity:1!important;}
    `;
    document.head.appendChild(el);
  }
  return null;
};

// ─── LTM Logo ─────────────────────────────────────────────────────────────────
const LTMLogo = ({ h = 36 }) => (
  <svg height={h} viewBox="0 0 200 52" fill="none">
    <defs>
      <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6B2B82"/>
        <stop offset="55%" stopColor="#D4198C"/>
        <stop offset="100%" stopColor="#EB754F"/>
      </linearGradient>
    </defs>
    <text x="0" y="36" fontFamily="Arial Black,Arial,sans-serif" fontSize="38" fontWeight="900" fill="url(#lg1)" letterSpacing="-1">LTM</text>
    <rect x="1" y="41" width="112" height="2.5" rx="1.25" fill="url(#lg1)" opacity="0.55"/>
    <text x="2" y="51" fontFamily="Arial,sans-serif" fontSize="7.5" fontWeight="400" fill="#4a4258" letterSpacing="3.5">OUTCREATE</text>
  </svg>
);

// ─── Spinning Loader ──────────────────────────────────────────────────────────
const Spinner = ({ size = 18 }) => (
  <svg className="spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2a10 10 0 1 0 10 10" strokeLinecap="round"/>
  </svg>
);

// ─── Button ───────────────────────────────────────────────────────────────────
const Btn = ({ children, onClick, disabled, loading, full, ghost, sm }) => (
  <button onClick={onClick} disabled={disabled || loading} style={{
    width: full ? "100%" : "auto",
    padding: sm ? "8px 16px" : "13px 26px",
    borderRadius: 10,
    background: ghost ? "transparent" : disabled || loading ? C.surfUp : GRAD,
    border: ghost ? `1.5px solid ${C.borderUp}` : "none",
    color: ghost ? C.textSec : disabled || loading ? C.textMute : "#fff",
    fontSize: sm ? 13 : 15, fontWeight: 700,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    boxShadow: ghost || disabled || loading ? "none" : `0 4px 24px ${C.purple}55`,
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    transition: "all 0.2s", touchAction: "manipulation",
    WebkitTapHighlightColor: "transparent",
  }}
    onMouseEnter={e => { if (!disabled && !loading && !ghost) { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C.purple}77`; }}}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = ghost || disabled || loading ? "none" : `0 4px 24px ${C.purple}55`; }}
  >
    {loading ? <><Spinner/> Please wait…</> : children}
  </button>
);

// ─── Input Field ──────────────────────────────────────────────────────────────
const Field = ({ label, type = "text", placeholder, value, onChange, error, hint, icon, right, autoComplete }) => (
  <div>
    {label && <label style={{ display:"block", fontSize:11, fontWeight:700, color:C.textSec, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:7 }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <div style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.textMute, pointerEvents:"none", fontSize:16 }}>{icon}</div>}
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        autoComplete={autoComplete || "off"} className="ltm-field"
        style={{ padding:`13px ${right?46:16}px 13px ${icon?44:16}px` }}/>
      {right && <div style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)" }}>{right}</div>}
    </div>
    {error && <p style={{ color:"#f87171", fontSize:12, marginTop:5, display:"flex", alignItems:"center", gap:4 }}>⚠ {error}</p>}
    {hint && !error && <p style={{ color:C.textMute, fontSize:11, marginTop:5 }}>{hint}</p>}
  </div>
);

// ─── OTP Boxes ────────────────────────────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const r0=useRef(),r1=useRef(),r2=useRef(),r3=useRef(),r4=useRef(),r5=useRef();
  const refs = [r0,r1,r2,r3,r4,r5];
  const digits = value.padEnd(6," ").split("");
  const onKey = (i,e) => {
    if (e.key==="Backspace") { onChange(value.slice(0,-1)); if(i>0&&!digits[i].trim()) refs[i-1].current?.focus(); return; }
    if (/^\d$/.test(e.key)) { const a=[...digits.map(d=>d.trim())]; a[i]=e.key; onChange(a.join("").replace(/\s/g,"").slice(0,6)); if(i<5) refs[i+1].current?.focus(); }
  };
  const onPaste = e => { const t=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6); onChange(t); e.preventDefault(); refs[Math.min(t.length,5)].current?.focus(); };
  return (
    <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
      {refs.map((ref,i) => (
        <input key={i} ref={ref} type="tel" inputMode="numeric" maxLength={1}
          value={digits[i].trim()} onKeyDown={e=>onKey(i,e)} onPaste={onPaste} onChange={()=>{}}
          style={{
            width:"clamp(44px,10vw,58px)", height:"clamp(52px,12vw,66px)",
            textAlign:"center", fontSize:"clamp(22px,4vw,26px)", fontWeight:800,
            background:C.surf, border:`2px solid ${digits[i].trim()?C.pink:C.border}`,
            borderRadius:12, color:C.textPri, outline:"none", fontFamily:"monospace",
            transition:"all 0.15s", boxShadow:digits[i].trim()?`0 0 0 3px ${C.pink}22`:"none",
          }}
          onFocus={e=>e.target.style.borderColor=C.pink}
          onBlur={e=>e.target.style.borderColor=digits[i].trim()?C.pink:C.border}
        />
      ))}
    </div>
  );
};

// ─── Donut Progress ───────────────────────────────────────────────────────────
const DonutProgress = ({ files }) => {
  const size = 140, stroke = 10, r = (size-stroke*2)/2, circ = 2*Math.PI*r;
  const total = DOCS.length, done = Object.keys(files).length;
  const pct = Math.round((done/total)*100);
  const colors = ["#6B2B82","#8B3EA8","#D4198C","#e040a8","#EB754F","#f09060","#a855d4","#c084e8"];
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:"rotate(-90deg)" }}>
        {/* Background track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke}/>
        {/* Each doc segment */}
        {DOCS.map((doc, i) => {
          const segLen = circ / total;
          const offset = circ - (i * segLen);
          const filled = !!files[doc.id];
          return (
            <circle key={doc.id} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={filled ? colors[i] : C.surfUp}
              strokeWidth={stroke}
              strokeDasharray={`${segLen - 3} ${circ - segLen + 3}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition:"stroke 0.4s ease" }}
            />
          );
        })}
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <div style={{ fontSize:26, fontWeight:900, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{pct}%</div>
        <div style={{ fontSize:10, color:C.textMute, marginTop:1, letterSpacing:"0.05em" }}>{done}/{total} docs</div>
      </div>
    </div>
  );
};

// ─── AI Document Helper Chat ──────────────────────────────────────────────────
const AIHelper = ({ doc, onClose }) => {
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:`Hi! I'm LTM Buddy 👋\n\nYou asked about **${doc.label}**.\n\n📌 *Why it's needed:* ${doc.why}\n\n💡 *Don't have it?* ${doc.missing}\n\nAnything else I can help with?` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role:"user", content:input.trim() };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs); setInput(""); setLoading(true);
    try {
      const reply = await askAI(newMsgs.map(m => ({ role:m.role, content:m.content })));
      setMsgs(p => [...p, { role:"assistant", content:reply }]);
    } catch { setMsgs(p => [...p, { role:"assistant", content:"Sorry, I'm having trouble connecting. Please try again." }]); }
    setLoading(false);
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
      background:"rgba(7,5,10,0.7)", backdropFilter:"blur(6px)", padding:"20px",
    }} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="fu" style={{
        width:"min(420px,100%)", height:"min(560px,80vh)",
        background:C.surf, border:`1px solid ${C.borderUp}`,
        borderRadius:20, display:"flex", flexDirection:"column",
        overflow:"hidden", boxShadow:`0 20px 60px ${C.purple}44`,
      }}>
        {/* Header */}
        <div style={{ padding:"16px 18px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12, background:`linear-gradient(135deg,${C.purple}22,${C.pink}11)` }}>
          <div style={{ width:40, height:40, borderRadius:12, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>🤖</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.textPri }}>LTM Buddy</div>
            <div style={{ fontSize:11, color:C.green, display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.green }} className="puls"/>
              AI Assistant · Online
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.textMute, cursor:"pointer", fontSize:20, lineHeight:1 }}>×</button>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
              {m.role==="assistant" && (
                <div style={{ width:28, height:28, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginRight:8, marginTop:2 }}>🤖</div>
              )}
              <div style={{
                maxWidth:"80%", padding:"10px 14px", borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",
                background:m.role==="user"?GRAD2:C.surfUp,
                border:m.role==="user"?"none":`1px solid ${C.border}`,
                fontSize:13, color:C.textPri, lineHeight:1.6, whiteSpace:"pre-wrap",
              }}>
                {m.content.replace(/\*\*(.*?)\*\*/g,"$1").replace(/\*(.*?)\*/g,"$1")}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
              <div style={{ background:C.surfUp, border:`1px solid ${C.border}`, borderRadius:"14px 14px 14px 4px", padding:"10px 14px" }}>
                <div style={{ display:"flex", gap:4 }}>
                  {[0,1,2].map(i => <div key={i} className="puls" style={{ width:6, height:6, borderRadius:"50%", background:C.pink, animationDelay:`${i*0.2}s` }}/>)}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {/* Input */}
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8 }}>
          <input
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder="Ask anything about this document…"
            className="ltm-field"
            style={{ flex:1, padding:"10px 14px", fontSize:13 }}
          />
          <button onClick={send} disabled={!input.trim()||loading} style={{
            width:40, height:40, borderRadius:10, background:input.trim()&&!loading?GRAD:C.surfUp,
            border:"none", cursor:input.trim()&&!loading?"pointer":"not-allowed",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            transition:"all 0.2s",
          }}>
            {loading ? <Spinner size={16}/> : <span style={{ fontSize:16 }}>↑</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── WhatsApp Status Tracker ──────────────────────────────────────────────────
const WAStatusTracker = ({ refNum, candidateName, joiningDate }) => {
  const [currentStep, setCurrentStep] = useState(0); // simulated
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    // Simulate status progression for demo
    const steps = [
      { delay:1000, step:0, text:`✅ Documents received!\n\nHi ${candidateName}, your joining documents have been submitted successfully.\n\nReference: *${refNum}*` },
      { delay:4000, step:1, text:`🔍 Our HR team has started reviewing your documents. We'll notify you once verification is complete.` },
    ];
    steps.forEach(({ delay, step, text }) => {
      setTimeout(() => {
        setCurrentStep(step);
        setMsgs(p => [...p, { from:"ltm", text, time:new Date().toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" }) }]);
      }, delay);
    });
  }, []);

  const statusColors = { 0:"#6B2B82", 1:"#D4198C", 2:"#22c55e", 3:"#EB754F" };

  return (
    <div style={{ maxWidth:440, margin:"0 auto" }}>
      {/* Phone mockup */}
      <div style={{
        background:"#111b21", borderRadius:20, overflow:"hidden",
        border:`1px solid #2a373f`, boxShadow:`0 20px 60px rgba(0,0,0,0.6)`,
      }}>
        {/* WA Header */}
        <div style={{ background:"#202c33", padding:"12px 16px", display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:"50%", background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>🏢</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:600, color:"#e9edef" }}>LTM HR · Onboarding</div>
            <div style={{ fontSize:12, color:"#8696a0" }}>Typically replies within minutes</div>
          </div>
          <div style={{ fontSize:18, color:"#8696a0" }}>⋮</div>
        </div>

        {/* Date divider */}
        <div style={{ background:"#182229", padding:"6px 16px", textAlign:"center" }}>
          <span style={{ background:"#182229", color:"#8696a0", fontSize:12, padding:"4px 10px", borderRadius:8 }}>Today</span>
        </div>

        {/* Chat messages */}
        <div style={{ background:"#0b141a", padding:"12px 16px", minHeight:240, display:"flex", flexDirection:"column", gap:12 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:"flex", justifyContent:"flex-start" }}>
              <div style={{
                maxWidth:"85%", background:"#202c33", borderRadius:"0 12px 12px 12px",
                padding:"10px 14px", fontSize:13, color:"#e9edef", lineHeight:1.6,
                whiteSpace:"pre-wrap",
              }}>
                {m.text}
                <div style={{ fontSize:11, color:"#8696a0", textAlign:"right", marginTop:4, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:4 }}>
                  {m.time}
                  <span className="wa-tick">✓✓</span>
                </div>
              </div>
            </div>
          ))}
          {msgs.length === 0 && (
            <div style={{ textAlign:"center", color:"#8696a0", fontSize:13, marginTop:20 }}>
              <Spinner size={20}/><br/>Connecting to LTM HR…
            </div>
          )}
        </div>

        {/* WA input bar */}
        <div style={{ background:"#202c33", padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ flex:1, background:"#2a3942", borderRadius:20, padding:"9px 16px", fontSize:13, color:"#8696a0" }}>Type a message</div>
          <div style={{ width:38, height:38, borderRadius:"50%", background:"#00a884", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🎤</div>
        </div>
      </div>

      {/* Status timeline below phone */}
      <div style={{ marginTop:24, display:"flex", flexDirection:"column", gap:0 }}>
        {WA_STATUSES.map((s, i) => (
          <div key={s.key} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
              <div style={{
                width:40, height:40, borderRadius:"50%", flexShrink:0,
                background: i <= currentStep ? s.color : C.surf,
                border: `2px solid ${i <= currentStep ? s.color : C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:18, transition:"all 0.5s",
                boxShadow: i === currentStep ? `0 0 16px ${s.color}66` : "none",
              }}>
                {i <= currentStep ? s.icon : <span style={{ fontSize:12, color:C.textMute }}>○</span>}
              </div>
              {i < WA_STATUSES.length-1 && (
                <div style={{ width:2, height:32, background:i<currentStep?s.color:C.border, margin:"4px 0", borderRadius:1, transition:"background 0.5s" }}/>
              )}
            </div>
            <div style={{ paddingTop:8, paddingBottom:i<WA_STATUSES.length-1?20:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:i<=currentStep?C.textPri:C.textMute, transition:"color 0.5s" }}>{s.label}</div>
              <div style={{ fontSize:12, color:C.textMute, marginTop:2 }}>{s.desc}</div>
              {i === currentStep && (
                <div style={{ fontSize:11, color:s.color, marginTop:4, display:"flex", alignItems:"center", gap:4 }} className="puls">
                  ● In progress
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Document Card (flip style) ───────────────────────────────────────────────
const DocCard = ({ doc, file, onFile, onRemove, onAskAI, isNA, onToggleNA }) => {
  const [flipped, setFlipped] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();
  const uploaded = !!file;

  const validate = f => {
    if (!f) return;
    if (f.size > doc.maxMB*1024*1024) { alert(`File too large. Max ${doc.maxMB}MB`); return; }
    onFile(doc.id, f);
    setFlipped(false);
  };

  useEffect(() => { if (uploaded) setFlipped(false); }, [uploaded]);

  return (
    <div className="doc-card" style={{ position:"relative" }}>
      <div className="card-scene" style={{ height:110 }}>
        <div className={`card-inner ${flipped && !uploaded ? "flipped" : ""}`} style={{ height:110 }}>

          {/* FRONT — doc info */}
          <div className="card-face" style={{
            background: uploaded ? `${doc.color}18` : C.surf,
            border: `1.5px solid ${uploaded ? doc.color+"66" : C.border}`,
            borderRadius:14, padding:"14px 16px", height:110,
            display:"flex", alignItems:"center", gap:14, cursor:uploaded?"default":"pointer",
          }} onClick={() => !uploaded && setFlipped(true)}>
            <div style={{ width:52, height:52, borderRadius:14, background:`${doc.color}22`, border:`1.5px solid ${doc.color}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
              {uploaded ? "✅" : doc.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:C.textPri, marginBottom:3 }}>{doc.label}</div>
              {uploaded ? (
                <div style={{ fontSize:12, color:C.green }}>{file.name} · {fmtSize(file.size)}</div>
              ) : isNA ? (
                <div style={{ fontSize:12, color:"#f59e0b", fontWeight:600 }}>Marked as Not Applicable</div>
              ) : (
                <div style={{ fontSize:12, color:C.textMute }}>Tap to upload · max {doc.maxMB}MB</div>
              )}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
              {uploaded ? (
                <button onClick={e=>{e.stopPropagation();onRemove(doc.id);}} style={{
                  width:32, height:32, borderRadius:8, background:"rgba(239,68,68,0.12)",
                  border:"1px solid rgba(239,68,68,0.25)", color:"#f87171",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14,
                }}>🗑</button>
              ) : (
                <div className="flip-hint" style={{ fontSize:10, color:C.textMute, opacity:0, transition:"opacity 0.2s", textAlign:"center" }}>Flip →</div>
              )}
              <button onClick={e=>{e.stopPropagation();onAskAI(doc);}} style={{
                width:32, height:32, borderRadius:8, background:`${doc.color}18`,
                border:`1px solid ${doc.color}33`, color:doc.color,
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
              }} title="Ask AI about this document">🤖</button>
            </div>
          </div>

          {/* BACK — upload zone */}
          <div className="card-face card-back" style={{
            background: drag ? `${doc.color}15` : C.surfUp,
            border: `1.5px dashed ${drag ? doc.color : C.borderUp}`,
            borderRadius:14, height:110, display:"flex", alignItems:"center",
            justifyContent:"center", gap:12, cursor:"pointer", position:"relative",
          }}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);validate(e.dataTransfer.files[0]);}}
          >
            <input ref={inputRef} type="file" accept={doc.accept}
              style={{ position:"absolute", inset:0, opacity:0, cursor:"pointer", zIndex:10, fontSize:16 }}
              onChange={e=>{if(e.target.files?.[0])validate(e.target.files[0]);e.target.value="";}}
            />
            <div style={{ textAlign:"center", pointerEvents:"none" }}>
              <div style={{ fontSize:28, marginBottom:4 }}>{drag?"📂":"📤"}</div>
              <div style={{ fontSize:13, color:C.textSec, fontWeight:500 }}>{drag?"Release to upload":"Click or drag file here"}</div>
              <div style={{ fontSize:11, color:C.textMute, marginTop:2 }}>{doc.accept.replace(/\*/g,"any")} · max {doc.maxMB}MB</div>
            </div>
            <button onClick={()=>setFlipped(false)} style={{
              position:"absolute", top:8, right:8,
              background:"none", border:"none", color:C.textMute, cursor:"pointer", fontSize:18,
            }}>←</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Left Panel ───────────────────────────────────────────────────────────────
const LeftPanel = () => (
  <div style={{
    width:"42%", minHeight:"100vh",
    background:"linear-gradient(160deg,#07050a 0%,#0e0619 50%,#170430 100%)",
    borderRight:`1px solid ${C.border}`, padding:"56px 48px",
    display:"flex", flexDirection:"column", justifyContent:"space-between",
    position:"sticky", top:0, overflow:"hidden",
  }}>
    <div style={{ position:"absolute", top:-120, right:-120, width:320, height:320, borderRadius:"50%", background:"radial-gradient(circle,#6B2B8244 0%,transparent 70%)", pointerEvents:"none" }}/>
    <div style={{ position:"absolute", bottom:0, left:-100, width:260, height:260, borderRadius:"50%", background:"radial-gradient(circle,#D4198C18 0%,transparent 70%)", pointerEvents:"none" }}/>

    <div style={{ position:"relative" }}>
      <LTMLogo h={38}/>
      <div style={{ marginTop:52 }}>
        <div style={{ display:"inline-block", background:"linear-gradient(135deg,#6B2B8233,#D4198C18)", border:"1px solid #6B2B8244", borderRadius:20, padding:"4px 14px", marginBottom:16, fontSize:11, color:"#d4aee8", fontWeight:700, letterSpacing:"0.1em" }}>
          CANDIDATE ONBOARDING
        </div>
        <h2 style={{ fontSize:30, fontWeight:900, color:C.textPri, lineHeight:1.25, marginBottom:16 }}>
          Your journey<br/>
          <span style={{ background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>starts here.</span>
        </h2>
        <p style={{ color:C.textSec, fontSize:14, lineHeight:1.8, maxWidth:320 }}>
          Submit your documents securely. Our AI assistant is here to help you every step of the way.
        </p>
      </div>

      {/* Feature highlights */}
      <div style={{ marginTop:40, display:"flex", flexDirection:"column", gap:14 }}>
        {[
          { icon:"🤖", text:"AI document helper — ask anything" },
          { icon:"📱", text:"WhatsApp-style status updates" },
          { icon:"🃏", text:"Interactive flip-card uploads" },
          { icon:"📊", text:"Live donut progress tracker" },
        ].map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`${C.purple}22`, border:`1px solid ${C.purple}33`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{f.icon}</div>
            <span style={{ fontSize:13, color:C.textSec }}>{f.text}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={{ position:"relative" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
        {[{ v:"81K+", l:"Employees" },{ v:"30+", l:"Countries" },{ v:"$4.6B", l:"Revenue" }].map((s,i) => (
          <div key={i} style={{ background:"#6B2B8215", border:"1px solid #6B2B8228", borderRadius:10, padding:"10px 8px", textAlign:"center" }}>
            <div style={{ fontSize:17, fontWeight:900, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.textMute, marginTop:2, letterSpacing:"0.05em" }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {["🔒 Encrypted","🛡️ GDPR","🗑️ Auto-delete 90d"].map((b,i) => (
          <div key={i} style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 10px", fontSize:11, color:C.textSec }}>{b}</div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Auth Shell (split layout) ────────────────────────────────────────────────
const AuthShell = ({ children, isDesktop }) => (
  <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif", color:C.textPri, display:"flex" }}>
    <GlobalStyle/>
    {isDesktop && <LeftPanel/>}
    <div style={{ flex:1, display:"flex", flexDirection:"column", minHeight:"100vh", overflowY:"auto" }}>
      {!isDesktop && (
        <header style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, background:"rgba(7,5,10,0.95)", backdropFilter:"blur(12px)", position:"sticky", top:0, zIndex:50 }}>
          <LTMLogo h={26}/>
        </header>
      )}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:isDesktop?"56px 60px":"28px 20px 60px" }}>
        <div style={{ width:"100%", maxWidth:isDesktop?460:440 }}>{children}</div>
      </div>
      <footer style={{ padding:"16px 24px", borderTop:`1px solid ${C.border}`, textAlign:"center", fontSize:12, color:C.textMute }}>
        © {new Date().getFullYear()} LTM Limited · All Rights Reserved
      </footer>
    </div>
  </div>
);

// ─── Upload Shell (full width + sidebar on desktop) ───────────────────────────
const UploadShell = ({ children, isDesktop, user, files, fileErr, naMarked, pct, uploadedCount, submitting, uploadPct, handleSubmit }) => (
  <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'Inter',sans-serif", color:C.textPri }}>
    <GlobalStyle/>
    {submitting && (
      <div style={{ position:"fixed", top:0, left:0, right:0, height:3, zIndex:300, background:C.surf }}>
        <div style={{ height:"100%", background:GRAD, width:`${uploadPct}%`, transition:"width 0.2s" }}/>
      </div>
    )}
    <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(7,5,10,0.96)", backdropFilter:"blur(16px)", borderBottom:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 clamp(16px,3vw,48px)", height:64, display:"flex", alignItems:"center", justifyContent:"space-between", gap:16 }}>
        <LTMLogo h={isDesktop?30:24}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {isDesktop && <span style={{ fontSize:13, color:C.textMute }}>Logged in as <strong style={{ color:C.textSec }}>{user.email}</strong></span>}
          <div style={{ padding:"5px 12px", borderRadius:8, background:`${C.green}15`, border:`1px solid ${C.green}33`, fontSize:12, color:C.green, display:"flex", alignItems:"center", gap:5 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green }} className="puls"/>
            {uploadedCount}/{DOCS.length} uploaded
          </div>
        </div>
      </div>
    </header>
    <main style={{ maxWidth:1200, margin:"0 auto", padding:"clamp(24px,4vw,48px) clamp(16px,3vw,48px) 80px" }}>
      {isDesktop ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 280px", gap:32, alignItems:"start" }}>
          <div>{children}</div>
          {/* Sticky sidebar */}
          <div style={{ position:"sticky", top:88, display:"flex", flexDirection:"column", gap:16 }}>
            {/* Donut */}
            <div style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:16, padding:24 }}>
              <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
                <DonutProgress files={files}/>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {DOCS.map(d => (
                  <div key={d.id} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:8, background:files[d.id]?`${d.color}0d`:fileErr[d.id]?"rgba(239,68,68,0.06)":C.surfUp }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, background:files[d.id]?d.color:naMarked[d.id]?"#f59e0b":fileErr[d.id]?"#ef4444":C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:700 }}>
                      {files[d.id]?"✓":naMarked[d.id]?"—":fileErr[d.id]?"!":""}
                    </div>
                    <span style={{ fontSize:11, color:files[d.id]?C.green:naMarked[d.id]?"#f59e0b":fileErr[d.id]?"#f87171":C.textMute, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{d.label}{naMarked[d.id]?" (N/A)":""}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop:16 }}>
                <Btn full loading={submitting} onClick={handleSubmit}>
                  Submit All →
                </Btn>
              </div>
            </div>
            {/* AI helper promo */}
            <div style={{ background:`linear-gradient(135deg,${C.purple}18,${C.pink}0d)`, border:`1px solid ${C.purple}33`, borderRadius:14, padding:16 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.textPri, marginBottom:6 }}>🤖 Need help?</div>
              <div style={{ fontSize:12, color:C.textSec, lineHeight:1.6 }}>Click the 🤖 button on any document card to ask LTM Buddy what it is and what to do if you don't have it.</div>
            </div>
          </div>
        </div>
      ) : children}
    </main>
    <footer style={{ borderTop:`1px solid ${C.border}`, padding:"16px 24px", textAlign:"center", fontSize:12, color:C.textMute }}>
      © {new Date().getFullYear()} LTM Limited · All Rights Reserved
    </footer>
  </div>
);

// ─── Pill — OUTSIDE main component ──────────────────────────────────────────
const Pill = ({ label }) => (
  <div style={{ display:"inline-flex", alignItems:"center", gap:7, background:`linear-gradient(90deg,${C.purple}18,${C.pink}0d)`, border:`1px solid ${C.purple}33`, borderRadius:20, padding:"4px 14px", marginBottom:14 }}>
    <div style={{ width:6, height:6, borderRadius:"50%", background:GRAD, boxShadow:`0 0 8px ${C.pink}` }}/>
    <span style={{ fontSize:11, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", fontWeight:700, letterSpacing:"0.09em" }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function LTMDocPortal() {
  const isDesktop = useIsDesktop();

  // Screens: auth-choice | signup | otp | signin | upload | status | success
  const [screen, setScreen]     = useState("auth-choice");
  const [user, setUser]         = useState({ name:"", email:"", phone:"", jobTitle:"", password:"" });
  const [errs, setErrs]         = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  // OTP
  const [otp, setOtp]           = useState("");
  const [otpReal, setOtpReal]   = useState("");
  const [otpErr, setOtpErr]     = useState("");
  const [otpSent, setOtpSent]   = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [copied, setCopied]     = useState(false);

  // Upload
  const [files, setFiles]       = useState({});
  const [fileErr, setFileErr]   = useState({});
  const [isFresher, setIsFresher] = useState(false);
  const [naMarked, setNaMarked]   = useState({});  // docs marked as N/A
  const [submitting, setSubmit] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [refNum, setRefNum]     = useState("");

  // AI Helper
  const [aiDoc, setAiDoc]       = useState(null);

  useEffect(() => {
    if (otpTimer <= 0) return;
    const t = setInterval(() => setOtpTimer(p => p-1), 1000);
    return () => clearInterval(t);
  }, [otpTimer]);

  const setF = k => e => setUser(p => ({...p,[k]:e.target.value}));

  // Validation
  const validateSignUp = () => {
    const e = {};
    if (!user.name.trim())                               e.name     = "Full name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) e.email    = "Valid email required";
    if (!/^[6-9]\d{9}$/.test(user.phone))                e.phone   = "Valid 10-digit mobile required";
    if (!user.jobTitle.trim())                           e.jobTitle = "Job title required";
    if (user.password.length < 8)                        e.password = "Minimum 8 characters";
    setErrs(e); return !Object.keys(e).length;
  };
  const validateSignIn = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) e.email   = "Valid email required";
    if (!user.password)                                  e.password = "Password required";
    setErrs(e); return !Object.keys(e).length;
  };

  const doSendOtp = async () => {
    if (!validateSignUp()) return;
    setLoading(true);
    const code = genOTP();
    setOtpReal(code); setOtp(""); setOtpErr(""); setOtpSent(false);
    if (EMAILJS_ENABLED) {
      try { await sendOtpEmail({ toEmail:user.email, toName:user.name, otpCode:code }); setOtpSent(true); }
      catch(e) { console.error("[EmailJS]", e); }
    }
    setOtpTimer(60); setLoading(false); setScreen("otp");
  };

  const verifyOtp = async () => {
    if (otp.length < 6) { setOtpErr("Enter complete 6-digit OTP"); return; }
    if (otp !== otpReal) { setOtpErr("Incorrect OTP — please try again"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setLoading(false);
    setScreen("upload");
  };

  const resendOtp = async () => {
    const code = genOTP(); setOtpReal(code); setOtp(""); setOtpErr(""); setOtpTimer(60);
    if (EMAILJS_ENABLED) try { await sendOtpEmail({ toEmail:user.email, toName:user.name, otpCode:code }); setOtpSent(true); } catch {}
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;
    setLoading(true); await new Promise(r=>setTimeout(r,1100)); setLoading(false); setScreen("upload");
  };

  const handleFile = useCallback((id, file) => {
    setFiles(p => ({...p,[id]:file}));
    setFileErr(p => { const n={...p}; delete n[id]; return n; });
  }, []);

  const removeFile = useCallback(id => {
    setFiles(p => { const n={...p}; delete n[id]; return n; });
  }, []);

  const handleSubmit = async () => {
    const missing = {};
    DOCS.forEach(d => {
      const skipped = (isFresher && d.fresherOptional) || naMarked[d.id];
      if (!files[d.id] && !skipped) missing[d.id] = "Required — upload or mark as Not Applicable";
    });
    if (Object.keys(missing).length) { setFileErr(missing); window.scrollTo({top:0,behavior:"smooth"}); return; }
    setSubmit(true);
    const ref = genRef(); setRefNum(ref);
    if (SUPABASE_ENABLED) {
      try {
        setUploadPct(10);
        await saveToSupabase({ user, files, refNumber:ref });
        for (let i=40;i<=100;i+=5) { await new Promise(r=>setTimeout(r,60)); setUploadPct(i); }
      } catch(e) {
        console.error("[Supabase]",e);
        for (let i=0;i<=100;i+=5) { await new Promise(r=>setTimeout(r,50)); setUploadPct(i); }
      }
    } else {
      for (let i=0;i<=100;i+=3) { await new Promise(r=>setTimeout(r,55)); setUploadPct(i); }
    }
    setScreen("status");
  };

  const uploadedCount = Object.keys(files).length;
  const naCount = Object.keys(naMarked).length;
  const effectiveTotal = DOCS.length - naCount;
  const pct = effectiveTotal === 0 ? 100 : Math.round((uploadedCount / effectiveTotal) * 100);

  // Pill defined outside main component

  // ════════ AUTH CHOICE ════════
  if (screen === "auth-choice") return (
    <AuthShell isDesktop={isDesktop}>
      <div className="fu">
        {!isDesktop && (
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ width:70, height:70, borderRadius:20, margin:"0 auto 16px", background:GRAD, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, boxShadow:`0 8px 32px ${C.purple}55` }}>🚀</div>
            <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>LTM Onboarding</h1>
            <p style={{ color:C.textSec, fontSize:14 }}>Submit your joining documents securely</p>
          </div>
        )}
        {isDesktop && (
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:26, fontWeight:900, marginBottom:8 }}>Get Started</h2>
            <p style={{ color:C.textSec, fontSize:14, lineHeight:1.6 }}>New candidate? Create an account. Returning? Sign back in.</p>
          </div>
        )}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Btn full onClick={() => { setErrs({}); setScreen("signup"); }}>
            Create New Account →
          </Btn>
          <Btn full ghost onClick={() => { setErrs({}); setScreen("signin"); }}>
            Sign In to Existing Account
          </Btn>
        </div>
        <div style={{ marginTop:20, padding:"13px 16px", background:C.surf, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.textMute, lineHeight:1.6 }}>
          🔒 Use the email from your LTM offer letter to register.
        </div>
      </div>
    </AuthShell>
  );

  // ════════ SIGN UP ════════
  if (screen === "signup") return (
    <AuthShell isDesktop={isDesktop}>
      <div className="fu">
        <button onClick={() => setScreen("auth-choice")} style={{ background:"none", border:"none", color:C.textMute, cursor:"pointer", fontSize:13, marginBottom:20, padding:0, fontFamily:"inherit" }}>← Back</button>
        <Pill label="NEW CANDIDATE"/>
        <h1 style={{ fontSize:"clamp(20px,4vw,26px)", fontWeight:900, marginBottom:6 }}>Create your account</h1>
        <p style={{ color:C.textSec, fontSize:14, marginBottom:24, lineHeight:1.6 }}>Use the email from your offer letter. We'll send a verification OTP.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 1fr":"1fr", gap:16 }}>
            <Field label="Full Name" placeholder="As on Aadhaar" value={user.name} onChange={setF("name")} error={errs.name} icon="👤" autoComplete="name"/>
            <Field label="Mobile" type="tel" placeholder="10-digit number" value={user.phone} onChange={setF("phone")} error={errs.phone} icon="📱" autoComplete="tel"/>
          </div>
          <Field label="Email Address" type="email" placeholder="your@email.com" value={user.email} onChange={setF("email")} error={errs.email} icon="📧" autoComplete="email"/>
          <Field label="Offered Job Title" placeholder="e.g. Senior Engineer" value={user.jobTitle} onChange={setF("jobTitle")} error={errs.jobTitle} icon="💼"/>
          <Field label="Set Password" type={showPass?"text":"password"} placeholder="Min 8 characters" value={user.password} onChange={setF("password")} error={errs.password} icon="🔒" autoComplete="new-password"
            right={<button onClick={() => setShowPass(p=>!p)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMute, fontSize:16, padding:4 }}>{showPass?"🙈":"👁"}</button>}
          />
        </div>
        <div style={{ marginTop:22 }}><Btn full onClick={doSendOtp} loading={loading}>Send OTP to Email →</Btn></div>
        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.textMute }}>
          Already registered?{" "}
          <button onClick={() => setScreen("signin")} style={{ background:"none", border:"none", color:C.pink, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>Sign In</button>
        </p>
      </div>
    </AuthShell>
  );

  // ════════ OTP ════════
  if (screen === "otp") return (
    <AuthShell isDesktop={isDesktop}>
      <div className="fu" style={{ textAlign:"center" }}>
        <div style={{ width:64, height:64, borderRadius:18, margin:"0 auto 20px", background:`${C.pink}18`, border:`1.5px solid ${C.pink}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:30 }}>📧</div>
        <Pill label="VERIFY IDENTITY"/>
        <h1 style={{ fontSize:"clamp(20px,4vw,26px)", fontWeight:900, marginBottom:8 }}>Your Verification Code</h1>
        <p style={{ color:C.textSec, fontSize:14, lineHeight:1.7, maxWidth:360, margin:"0 auto 20px" }}>
          For <strong style={{ color:C.textPri }}>{user.email}</strong>
        </p>
        {/* OTP Display Card */}
        <div style={{ background:`linear-gradient(135deg,${C.purple}0d,${C.pink}08)`, border:`1.5px solid ${C.purple}35`, borderRadius:14, padding:"16px 18px", marginBottom:24, textAlign:"left", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:GRAD, opacity:0.6 }}/>
          <div style={{ fontSize:11, fontWeight:700, color:C.purpleLt, letterSpacing:"0.07em", textTransform:"uppercase", marginBottom:8 }}>🔐 One-Time Password</div>
          <p style={{ fontSize:12, color:C.textSec, lineHeight:1.6, marginBottom:12 }}>
            {otpSent ? <>Also sent to <strong style={{ color:C.textPri }}>{user.email}</strong></> : <>Enter this code to verify your identity. Valid 10 mins.</>}
          </p>
          <div style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:C.textMute, marginBottom:3 }}>OTP Code</div>
              <div style={{ fontSize:36, fontFamily:"monospace", fontWeight:900, letterSpacing:"0.22em", background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{otpReal}</div>
            </div>
            <button onClick={() => { navigator.clipboard?.writeText(otpReal); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              style={{ padding:"10px 16px", borderRadius:8, cursor:"pointer", background:copied?`${C.green}18`:GRAD, border:"none", color:"#fff", fontSize:12, fontWeight:600, display:"flex", alignItems:"center", gap:6, fontFamily:"inherit", transition:"all 0.2s" }}>
              {copied ? "✅ Copied" : "Copy"}
            </button>
          </div>
        </div>
        <OTPInput value={otp} onChange={setOtp}/>
        {otpErr && <p style={{ color:"#f87171", fontSize:13, marginTop:14 }}>⚠ {otpErr}</p>}
        <div style={{ marginTop:22 }}><Btn full onClick={verifyOtp} loading={loading}>Verify & Continue →</Btn></div>
        <div style={{ marginTop:16, fontSize:13, color:C.textMute }}>
          {otpTimer > 0 ? <>Resend in <strong style={{ color:C.textSec }}>{otpTimer}s</strong></> : <button onClick={resendOtp} style={{ background:"none", border:"none", color:C.pink, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>Resend OTP</button>}
        </div>
        <p style={{ marginTop:10, fontSize:12, color:C.textMute }}>Wrong email? <button onClick={() => setScreen("signup")} style={{ background:"none", border:"none", color:C.pink, cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:"inherit" }}>Go back</button></p>
      </div>
    </AuthShell>
  );

  // ════════ SIGN IN ════════
  if (screen === "signin") return (
    <AuthShell isDesktop={isDesktop}>
      <div className="fu">
        <button onClick={() => setScreen("auth-choice")} style={{ background:"none", border:"none", color:C.textMute, cursor:"pointer", fontSize:13, marginBottom:20, padding:0, fontFamily:"inherit" }}>← Back</button>
        <Pill label="RETURNING CANDIDATE"/>
        <h1 style={{ fontSize:"clamp(20px,4vw,26px)", fontWeight:900, marginBottom:6 }}>Welcome back</h1>
        <p style={{ color:C.textSec, fontSize:14, marginBottom:24, lineHeight:1.6 }}>Sign in with your registered credentials.</p>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <Field label="Email" type="email" placeholder="your@email.com" value={user.email} onChange={setF("email")} error={errs.email} icon="📧" autoComplete="email"/>
          <Field label="Password" type={showPass?"text":"password"} placeholder="Your password" value={user.password} onChange={setF("password")} error={errs.password} icon="🔒" autoComplete="current-password"
            right={<button onClick={() => setShowPass(p=>!p)} style={{ background:"none", border:"none", cursor:"pointer", color:C.textMute, fontSize:16, padding:4 }}>{showPass?"🙈":"👁"}</button>}
          />
        </div>
        <div style={{ marginTop:20 }}><Btn full onClick={handleSignIn} loading={loading}>Sign In →</Btn></div>
        <p style={{ textAlign:"center", marginTop:16, fontSize:13, color:C.textMute }}>
          New candidate?{" "}
          <button onClick={() => setScreen("signup")} style={{ background:"none", border:"none", color:C.pink, cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"inherit" }}>Create Account</button>
        </p>
      </div>
    </AuthShell>
  );

  // ════════ UPLOAD ════════
  if (screen === "upload") return (
    <>
      <UploadShell isDesktop={isDesktop} user={user} files={files} fileErr={fileErr} naMarked={naMarked} pct={pct} uploadedCount={uploadedCount} submitting={submitting} uploadPct={uploadPct} handleSubmit={handleSubmit}>
        <div className="fu">
          <div style={{ marginBottom:24 }}>
            <Pill label="DOCUMENT SUBMISSION"/>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, flexWrap:"wrap" }}>
              <div>
                <h1 style={{ fontSize:"clamp(20px,3vw,28px)", fontWeight:900, lineHeight:1.3, marginBottom:6 }}>Upload Your Documents</h1>
                <p style={{ color:C.textSec, fontSize:14 }}>Hi <strong style={{ color:C.pink }}>{user.name||"Candidate"}</strong> — tap any card to upload. Click 🤖 for AI help on any document.</p>
              </div>
              {!isDesktop && <DonutProgress files={files}/>}
            </div>
          </div>

          {/* Security notice */}
          <div style={{ background:"rgba(59,130,246,0.06)", border:"1px solid rgba(59,130,246,0.16)", borderRadius:12, padding:"12px 16px", marginBottom:12, display:"flex", alignItems:"flex-start", gap:10 }}>
            <span style={{ fontSize:18, flexShrink:0 }}>🔒</span>
            <p style={{ color:"#93c5fd", fontSize:13, lineHeight:1.6 }}>All files are <strong>end-to-end encrypted</strong>. Only LTM HR can view your submissions. Auto-deleted after 90 days.</p>
          </div>

          {/* Fresher toggle */}
          <div style={{ background:`linear-gradient(135deg,${C.purple}15,${C.pink}0d)`, border:`1px solid ${C.purple}33`, borderRadius:12, padding:"14px 18px", marginBottom:20, display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, flexWrap:"wrap" }}>
            <div>
              <p style={{ fontSize:13, fontWeight:700, color:C.textPri, marginBottom:3 }}>🎓 Are you a Fresher?</p>
              <p style={{ fontSize:12, color:C.textSec, lineHeight:1.5 }}>
                {isFresher ? "Fresher mode ON — Experience Letter & Payslips marked as Not Applicable." : "Toggle if you have no prior work experience. Offer Letter can be marked N/A individually if not yet received."}
              </p>
            </div>
            <button onClick={() => { setIsFresher(p=>!p); setNaMarked(p => { const n={...p}; if(!isFresher){n["exp"]=true;n["pay"]=true;}else{delete n["exp"];delete n["pay"];}; return n; }); }}
              style={{
                padding:"9px 20px", borderRadius:8, cursor:"pointer", fontWeight:700, fontSize:13,
                background:isFresher?C.pink:"transparent",
                border:`1.5px solid ${isFresher?C.pink:C.borderUp}`,
                color:isFresher?"#fff":C.textSec,
                transition:"all 0.2s", flexShrink:0, fontFamily:"inherit",
                boxShadow:isFresher?`0 2px 10px ${C.pink}44`:"none",
              }}>
              {isFresher ? "✓ Fresher Mode ON" : "I am a Fresher"}
            </button>
          </div>

          {/* Error banner */}
          {Object.keys(fileErr).length > 0 && (
            <div style={{ background:`${C.pink}0c`, border:`1px solid ${C.pink}2a`, borderRadius:12, padding:"11px 16px", marginBottom:16, fontSize:13, color:"#fca5a5" }}>
              ⚠ {Object.keys(fileErr).length} document(s) still needed — see highlighted cards.
            </div>
          )}

          {/* Document cards grid */}
          <div style={{ display:"grid", gridTemplateColumns:isDesktop?"1fr 1fr":"1fr", gap:12 }}>
            {DOCS.map((doc,i) => (
              <div key={doc.id} className="fu" style={{ animationDelay:`${i*0.04}s` }}>
                <DocCard doc={doc} file={files[doc.id]} onFile={handleFile} onRemove={removeFile} onAskAI={setAiDoc}
                  isNA={naMarked[doc.id]}
                  onToggleNA={id => setNaMarked(p => { const n={...p}; if(n[id]) delete n[id]; else n[id]=true; return n; })}
                />
                {fileErr[doc.id] && <p style={{ color:"#f87171", fontSize:11, marginTop:4, paddingLeft:4 }}>⚠ {fileErr[doc.id]}</p>}
              </div>
            ))}
          </div>

          {/* Mobile submit */}
          {!isDesktop && (
            <div style={{ marginTop:24, background:C.surf, border:`1px solid ${C.border}`, borderRadius:16, padding:"18px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <span style={{ fontSize:13, color:C.textSec }}>{uploadedCount}/{DOCS.length} uploaded</span>
                <span style={{ fontSize:13, fontWeight:700, color:pct===100?C.green:C.pink }}>{pct}%</span>
              </div>
              <div style={{ height:5, background:C.bg, borderRadius:3, marginBottom:18 }}>
                <div style={{ height:"100%", borderRadius:3, width:`${pct}%`, background:pct===100?C.green:GRAD, transition:"width 0.4s" }}/>
              </div>
              <Btn full loading={submitting} onClick={handleSubmit}>Submit All Documents →</Btn>
            </div>
          )}
          <p style={{ textAlign:"center", color:C.textMute, fontSize:11, marginTop:16, lineHeight:1.7 }}>
            By submitting you confirm all documents are genuine. Fraudulent submissions may result in offer withdrawal.
          </p>
        </div>
      </UploadShell>

      {/* AI Helper Modal */}
      {aiDoc && <AIHelper doc={aiDoc} onClose={() => setAiDoc(null)}/>}
    </>
  );

  // ════════ WHATSAPP STATUS ════════
  if (screen === "status") return (
    <AuthShell isDesktop={isDesktop}>
      <div className="fu" style={{ textAlign:"center" }}>
        <Pill label="SUBMISSION COMPLETE"/>
        <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:900, marginBottom:8 }}>You're all set! 🎉</h1>
        <p style={{ color:C.textSec, fontSize:14, lineHeight:1.7, maxWidth:420, margin:"0 auto 8px" }}>
          Thank you, <strong style={{ color:C.pink }}>{user.name}</strong>!<br/>
          Track your document review status below in real-time.
        </p>
        <div style={{ background:C.surf, border:`1px solid ${C.border}`, borderRadius:12, padding:"12px 20px", display:"inline-block", marginBottom:28 }}>
          <span style={{ fontSize:11, color:C.textMute, letterSpacing:"0.1em", textTransform:"uppercase" }}>Reference</span>
          <div style={{ fontSize:20, fontFamily:"monospace", fontWeight:900, background:GRAD, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"0.1em" }}>{refNum}</div>
        </div>

        {/* WhatsApp tracker */}
        <WAStatusTracker refNum={refNum} candidateName={user.name.split(" ")[0]} joiningDate={null}/>

        <div style={{ marginTop:28 }}>
          <Btn ghost onClick={() => { setScreen("auth-choice"); setUser({name:"",email:"",phone:"",jobTitle:"",password:""}); setFiles({}); setFileErr({}); setRefNum(""); }}>
            ← Back to Portal
          </Btn>
        </div>
      </div>
    </AuthShell>
  );
}
