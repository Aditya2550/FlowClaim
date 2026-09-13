import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Scan,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
  Receipt,
  Cpu,
  Radio,
  Check,
  ExternalLink,
  Sun,
  Moon,
  Video,
  Scissors,
  Eye,
  Sliders,
  Layers,
  Lock,
  TrendingUp,
  FileCheck,
  Maximize2
} from "lucide-react";

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function LandingPage() {
  // Theme state: default soft cream light mode
  const [darkMode, setDarkMode] = useState(false);

  // Interactive demo states
  const [activeRoleTab, setActiveRoleTab] = useState("employee");
  const [heroViewMode, setHeroViewMode] = useState("laptop"); // "laptop" | "stacked"
  const [activeModalImage, setActiveModalImage] = useState(null);

  return (
    <div className={`min-h-screen font-inter transition-colors duration-300 ${
      darkMode 
        ? "bg-[#06140c] text-surface-50 selection:bg-emerald-600 selection:text-white" 
        : "bg-[#F7F4EF] text-forest-950 selection:bg-forest-600 selection:text-white"
    }`}>

      {/* TOP FLOATING NAV (Refined Dark Capsule Navbar) */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className={`h-16 px-6 rounded-full flex items-center justify-between transition-all duration-300 ${
          darkMode 
            ? "bg-forest-950/95 border border-forest-800/80 shadow-2xl backdrop-blur-xl" 
            : "bg-forest-900 text-white border border-forest-800/60 shadow-xl backdrop-blur-xl"
        }`}>
          
          {/* BRAND WITH MUTED REFINED LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-forest-600 text-white flex items-center justify-center shadow-sm border border-forest-500/30 group-hover:scale-105 transition-transform">
              <img 
                src="/favicon-32x32.png" 
                alt="FlowClaim Logo" 
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                }}
              />
              <Check className="w-4.5 h-4.5 text-white stroke-[3] hidden" />
            </div>
            <span className="font-manrope font-extrabold text-lg text-white tracking-tight">
              FlowClaim
            </span>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wide text-surface-300">
            <a href="#hero-showcase" className="hover:text-emerald-300 transition-colors">Product Showcase</a>
            <a href="#features" className="hover:text-emerald-300 transition-colors">Features</a>
            <a href="#roles" className="hover:text-emerald-300 transition-colors">Role OS</a>
            <a href="#how-it-works" className="hover:text-emerald-300 transition-colors">Workflow</a>
            <a href="#tools-guide" className="hover:text-emerald-300 transition-colors">Video Kit Guide</a>
          </nav>

          {/* RIGHT ACTIONS: LIGHT/DARK TOGGLE & AUTH ONLY */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-forest-800/70 hover:bg-forest-700 text-emerald-300 transition-colors flex items-center justify-center"
              title={darkMode ? "Switch to Soft Cream Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-semibold text-surface-300 hover:text-white transition-colors"
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="px-4.5 py-2 rounded-full bg-forest-600 hover:bg-forest-500 text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5 border border-forest-400/30"
            >
              Sign Up
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH REAL PRODUCT SHOWCASE */}
      <section className="pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* ODOO HACKATHON PILL BADGE */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
              darkMode 
                ? "bg-forest-900/90 text-emerald-300 border border-emerald-500/30 shadow-lg" 
                : "bg-[#EAE4DA] text-forest-900 border border-[#DCD3C5] shadow-xs"
            }`}>
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Originally prototyped at Odoo Hackathon 2026 — rebuilt & expanded solo
            </div>
          </div>

          {/* BOLD HEADLINE */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className={`font-manrope text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] ${
              darkMode ? "text-white" : "text-forest-950"
            }`}>
              SMARTER EXPENSE REIMBURSEMENTS FOR {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 via-emerald-600 to-[#10B981]">
                ENTERPRISE TEAMS
              </span>
            </h1>

            {/* SUBTITLE */}
            <p className={`mt-6 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed ${
              darkMode ? "text-surface-200" : "text-forest-900/85 font-medium"
            }`}>
              Eliminate friction-heavy expense forms with <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 via-emerald-600 to-[#10B981] font-extrabold">AI Vision OCR</span>, 
              configurable multi-tier approvals, and real-time Socket.io dispatch — from receipt snap to payout in seconds.
            </p>

            {/* AUTH CTAS */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md shadow-forest-800/15 active:scale-98 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm border active:scale-98 transition-all flex items-center justify-center gap-2 ${
                  darkMode 
                    ? "bg-forest-900/60 border-forest-800 text-white hover:bg-forest-800" 
                    : "bg-white border-[#E2DAD0] text-forest-950 hover:bg-[#F2ECE3] shadow-xs"
                }`}
              >
                <span>Log In to Portal</span>
                <ChevronRight className="w-4 h-4 text-forest-700 dark:text-surface-400" />
              </Link>
            </div>
          </div>

          {/* REAL PRODUCT SHOWCASE CONTAINER (HERO LAPTOP & STACKED DEPT) */}
          <div id="hero-showcase" className="mt-14 relative max-w-6xl mx-auto">
            
            {/* VIEW MODE TOGGLE (Laptop Mockup vs Stacked Depth Artifacts) */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setHeroViewMode("laptop")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  heroViewMode === "laptop"
                    ? "bg-forest-700 text-white shadow-xs"
                    : darkMode ? "bg-forest-900 text-surface-300" : "bg-white text-forest-800 border border-[#E2DAD0]"
                }`}
              >
                Laptop Showcase Frame
              </button>
              <button
                onClick={() => setHeroViewMode("stacked")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  heroViewMode === "stacked"
                    ? "bg-forest-700 text-white shadow-xs"
                    : darkMode ? "bg-forest-900 text-surface-300" : "bg-white text-forest-800 border border-[#E2DAD0]"
                }`}
              >
                Stacked Artifact Composition
              </button>
            </div>

            {/* VIEW 1: LAPTOP MOCKUP SHOWCASE */}
            {heroViewMode === "laptop" && (
              <div className="relative group cursor-pointer" onClick={() => setActiveModalImage("/assets/screenshots/hero-laptop-frame.png")}>
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                  <img
                    src="/assets/screenshots/hero-laptop-frame.png"
                    alt="FlowClaim Product Showcase on Laptop"
                    className="w-full h-auto object-cover rounded-2xl"
                    onError={(e) => {
                      // Fallback to laptop dashboard screenshot if frame image fails
                      e.target.src = "/assets/screenshots/hero-laptop-dashboard.png";
                    }}
                  />
                </div>
                <div className="absolute top-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity bg-forest-950/80 text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 backdrop-blur-md">
                  <Maximize2 className="w-3.5 h-3.5" /> Click to Expand Full View
                </div>
              </div>
            )}

            {/* VIEW 2: STACKED ARTIFACT DEPTH COMPOSITION */}
            {heroViewMode === "stacked" && (
              <div className="relative min-h-[520px] flex items-center justify-center">
                
                {/* BACK LAYER: OCR RECEIPT SCANNER */}
                <div 
                  onClick={() => setActiveModalImage("/assets/screenshots/ocr-receipt-scanner.png")}
                  className={`absolute left-2 sm:left-6 top-4 w-[90%] sm:w-[500px] rounded-2xl p-2 border cursor-pointer transition-all duration-500 transform -rotate-6 hover:rotate-0 hover:z-30 hover:scale-105 shadow-2xl ${
                    darkMode ? "bg-forest-950/95 border-forest-700" : "bg-white border-[#E2DAD0] shadow-forest-900/10"
                  }`}
                  style={{ zIndex: 10 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] dark:border-forest-800 flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-forest-700 dark:text-surface-300">LAYER 01: AI Vision Receipt OCR</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#E8F4EC] dark:bg-forest-900 text-[#0F5A33] dark:text-emerald-300 font-bold">Zoom</span>
                  </div>
                  <img 
                    src="/assets/screenshots/ocr-receipt-scanner.png" 
                    alt="OCR Receipt Scanner" 
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>

                {/* FRONT LAYER: MANAGER APPROVAL QUEUE */}
                <div 
                  onClick={() => setActiveModalImage("/assets/screenshots/manager-approval-queue.png")}
                  className={`absolute right-2 sm:right-6 top-16 w-[90%] sm:w-[520px] rounded-2xl p-2 border cursor-pointer transition-all duration-500 transform rotate-3 hover:rotate-0 hover:z-30 hover:scale-105 shadow-2xl ${
                    darkMode ? "bg-forest-950/95 border-forest-700" : "bg-white border-[#E2DAD0] shadow-forest-900/15"
                  }`}
                  style={{ zIndex: 20 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] dark:border-forest-800 flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-forest-700 dark:text-surface-300">LAYER 02: Real-time Manager Queue</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-forest-700 text-white font-bold">Zoom</span>
                  </div>
                  <img 
                    src="/assets/screenshots/manager-approval-queue.png" 
                    alt="Manager Approval Queue" 
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

      {/* CORE FEATURES GRID WITH REAL PRODUCT SCREENSHOTS */}
      <section id="features" className={`py-20 border-t transition-colors ${
        darkMode ? "bg-forest-950/80 border-forest-800/40" : "bg-white border-[#E2DAD0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-[#E8F4EC] text-[#0F5A33] dark:bg-forest-900 dark:text-emerald-300 border border-[#C2E2CE] dark:border-forest-700 inline-block mb-3">
              Platform Features
            </span>
            <h2 className={`font-manrope text-3xl sm:text-5xl font-extrabold tracking-tight ${
              darkMode ? "text-white" : "text-forest-950"
            }`}>
              Engineered for absolute reimbursement clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* FEATURE 1 WITH REAL OCR SCREENSHOT */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0] shadow-xs"
            }`}>
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 shadow-xs ${
                  darkMode ? "bg-forest-900 border border-forest-700 text-emerald-300" : "bg-[#E8F4EC] border border-[#C2E2CE] text-[#0F5A33]"
                }`}>
                  <Scan className="w-5.5 h-5.5" />
                </div>
                <h3 className={`font-manrope text-xl font-bold mb-2.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                  AI Vision OCR Extraction
                </h3>
                <p className={`text-sm leading-relaxed font-normal mb-5 ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                  Automatically parses uploaded receipt images and PDFs into structured fields — Vendor name, Total Amount, GST split, Category, Invoice ID, and Date — in under 2 seconds.
                </p>
              </div>
              <div 
                onClick={() => setActiveModalImage("/assets/screenshots/ocr-receipt-scanner.png")}
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-forest-800 group cursor-pointer"
              >
                <img 
                  src="/assets/screenshots/ocr-receipt-scanner.png" 
                  alt="OCR Scanner Preview" 
                  className="w-full h-36 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                  Expand Screenshot
                </div>
              </div>
            </div>

            {/* FEATURE 2 WITH REAL RBAC RULES SCREENSHOT */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0] shadow-xs"
            }`}>
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 shadow-xs ${
                  darkMode ? "bg-forest-900 border border-forest-700 text-emerald-300" : "bg-[#E8F4EC] border border-[#C2E2CE] text-[#0F5A33]"
                }`}>
                  <ShieldCheck className="w-5.5 h-5.5" />
                </div>
                <h3 className={`font-manrope text-xl font-bold mb-2.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                  5-Level Granular RBAC
                </h3>
                <p className={`text-sm leading-relaxed font-normal mb-5 ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                  Strict scope isolation and permission matrices across 5 dedicated roles: Employee, Manager, Admin, Director, and Finance teams.
                </p>
              </div>
              <div 
                onClick={() => setActiveModalImage("/assets/screenshots/admin-approval-rules.png")}
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-forest-800 group cursor-pointer"
              >
                <img 
                  src="/assets/screenshots/admin-approval-rules.png" 
                  alt="Admin Approval Rules Preview" 
                  className="w-full h-36 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                  Expand Screenshot
                </div>
              </div>
            </div>

            {/* FEATURE 3 WITH REAL MANAGER QUEUE SCREENSHOT */}
            <div className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0] shadow-xs"
            }`}>
              <div>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-5 shadow-xs ${
                  darkMode ? "bg-forest-900 border border-forest-700 text-emerald-300" : "bg-[#E8F4EC] border border-[#C2E2CE] text-[#0F5A33]"
                }`}>
                  <Radio className="w-5.5 h-5.5" />
                </div>
                <h3 className={`font-manrope text-xl font-bold mb-2.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                  Socket.io Real-time Push
                </h3>
                <p className={`text-sm leading-relaxed font-normal mb-5 ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                  Zero polling overhead. Approvers receive instant push notifications and live badge count updates the moment a claim is filed or processed.
                </p>
              </div>
              <div 
                onClick={() => setActiveModalImage("/assets/screenshots/manager-approval-queue.png")}
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-forest-800 group cursor-pointer"
              >
                <img 
                  src="/assets/screenshots/manager-approval-queue.png" 
                  alt="Manager Queue Preview" 
                  className="w-full h-36 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                  Expand Screenshot
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ROLE OS WORKSPACE SWITCHER WITH REAL APP SCREENSHOT PREVIEWS */}
      <section id="roles" className={`py-20 border-t ${
        darkMode ? "bg-forest-950 border-forest-800/40" : "bg-[#F7F4EF] border-[#E2DAD0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className={`font-manrope text-3xl font-extrabold ${darkMode ? "text-white" : "text-forest-950"}`}>
              Explore Role Workspaces
            </h2>
          </div>

          {/* ROLE SWITCHER TABS */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: "employee", label: "Employee", img: "/assets/screenshots/ocr-receipt-scanner.png" },
              { id: "manager", label: "Manager", img: "/assets/screenshots/manager-approval-queue.png" },
              { id: "analytics", label: "Analytics View", img: "/assets/screenshots/analytics-overview.png" },
              { id: "admin", label: "Admin & Rules", img: "/assets/screenshots/admin-approval-rules.png" }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRoleTab(role.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
                  activeRoleTab === role.id
                    ? "bg-forest-700 text-white shadow-sm"
                    : darkMode
                      ? "bg-forest-900 text-surface-300 hover:bg-forest-800"
                      : "bg-white text-forest-900 border border-[#E2DAD0] hover:bg-[#EFEBE4]"
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* ACTIVE ROLE SCREENSHOT DISPLAY */}
          <div className={`max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl border ${
            darkMode ? "bg-forest-900/50 border-forest-800" : "bg-white border-[#E2DAD0] shadow-md"
          }`}>
            <div className="text-xs font-mono text-[#0F5A33] dark:text-emerald-300 font-bold uppercase mb-1.5">
              Active Workspace: {activeRoleTab.toUpperCase()}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <h3 className={`font-manrope text-2xl font-bold mb-3 ${darkMode ? "text-white" : "text-forest-950"}`}>
                  {activeRoleTab === "employee" && "Employee Receipt Upload & Claim Verification"}
                  {activeRoleTab === "manager" && "Manager Queue & Side-by-Side Verification"}
                  {activeRoleTab === "analytics" && "Spend Velocity & Turnaround Visual Analytics"}
                  {activeRoleTab === "admin" && "System Permission Rules & Threshold Setup"}
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                  FlowClaim isolates data access strictly according to user roles, ensuring governance compliance, rapid turnaround times, and audit reliability across every department.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div 
                  onClick={() => {
                    const imgMap = {
                      employee: "/assets/screenshots/ocr-receipt-scanner.png",
                      manager: "/assets/screenshots/manager-approval-queue.png",
                      analytics: "/assets/screenshots/analytics-overview.png",
                      admin: "/assets/screenshots/admin-approval-rules.png"
                    };
                    setActiveModalImage(imgMap[activeRoleTab] || "/assets/screenshots/hero-laptop-dashboard.png");
                  }}
                  className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-forest-800 group cursor-pointer shadow-lg"
                >
                  <img 
                    src={
                      activeRoleTab === "employee" ? "/assets/screenshots/ocr-receipt-scanner.png" :
                      activeRoleTab === "manager" ? "/assets/screenshots/manager-approval-queue.png" :
                      activeRoleTab === "analytics" ? "/assets/screenshots/analytics-overview.png" :
                      "/assets/screenshots/admin-approval-rules.png"
                    } 
                    alt="Workspace Preview" 
                    className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold">
                    Click to Expand Full Screenshot
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 STEPS) */}
      <section id="how-it-works" className={`py-20 border-t ${
        darkMode ? "bg-forest-950/90 border-forest-800/40" : "bg-white border-[#E2DAD0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`font-manrope text-3xl sm:text-4xl font-extrabold ${darkMode ? "text-white" : "text-forest-950"}`}>
              Three Simple Steps to Reimbursement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`p-7 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0]"
            }`}>
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-white font-extrabold font-mono flex items-center justify-center mb-4 text-xs shadow-xs">
                01
              </div>
              <h3 className={`font-manrope text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-forest-950"}`}>
                Snap & OCR Scan
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                Drop receipt photo or PDF. Gemini vision auto-extracts merchant, date, total amount, and GST split.
              </p>
            </div>

            <div className={`p-7 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0]"
            }`}>
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-white font-extrabold font-mono flex items-center justify-center mb-4 text-xs shadow-xs">
                02
              </div>
              <h3 className={`font-manrope text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-forest-950"}`}>
                Smart Approval Routing
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                Claim routes automatically to direct manager or director based on configured organizational rules.
              </p>
            </div>

            <div className={`p-7 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-[#FAF8F5] border-[#E2DAD0]"
            }`}>
              <div className="w-9 h-9 rounded-xl bg-forest-700 text-white font-extrabold font-mono flex items-center justify-center mb-4 text-xs shadow-xs">
                03
              </div>
              <h3 className={`font-manrope text-lg font-bold mb-2 ${darkMode ? "text-white" : "text-forest-950"}`}>
                Finance Audit & Payout
              </h3>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-surface-200" : "text-forest-900/85"}`}>
                Finance verifies tax credit eligibility and completes reimbursement disbursement seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RECOMMENDED VIDEO EDITING & RECORDING TOOLS GUIDE */}
      <section id="tools-guide" className={`py-20 border-t ${
        darkMode ? "bg-forest-950 border-forest-800/40" : "bg-[#F7F4EF] border-[#E2DAD0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#E8F4EC] text-[#0F5A33] dark:bg-forest-900 dark:text-emerald-300 border border-[#C2E2CE] dark:border-forest-700 inline-block mb-3">
              Developer Kit Guide
            </span>
            <h2 className={`font-manrope text-3xl sm:text-4xl font-extrabold ${darkMode ? "text-white" : "text-forest-950"}`}>
              Recommended Screen Recording & Demo Video Tools
            </h2>
            <p className={`mt-3 text-sm font-medium ${darkMode ? "text-surface-200" : "text-forest-900/80"}`}>
              Curated tools to record, edit, zoom, and produce polished SaaS product launch clips.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* TOOL 1 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-white border-[#E2DAD0] shadow-xs"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-800 dark:text-purple-400 flex items-center justify-center mb-4">
                <Video className="w-5 h-5" />
              </div>
              <h3 className={`font-manrope text-base font-bold mb-1.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                Screen Studio / Loom
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${darkMode ? "text-surface-200" : "text-forest-900/80"}`}>
                <strong>Best for:</strong> Automatic 4K zooms & smooth cursor movements whenever you click on input forms or approval buttons.
              </p>
              <div className="text-[11px] font-mono text-purple-800 dark:text-purple-400 font-bold">
                Auto 4K Zoom • Smooth Cursor
              </div>
            </div>

            {/* TOOL 2 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-white border-[#E2DAD0] shadow-xs"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-[#E8F4EC] text-[#0F5A33] dark:bg-forest-900 dark:text-emerald-400 flex items-center justify-center mb-4 border border-[#C2E2CE] dark:border-forest-700">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className={`font-manrope text-base font-bold mb-1.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                CapCut Desktop
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${darkMode ? "text-surface-200" : "text-forest-900/80"}`}>
                <strong>Best for:</strong> Rapid clip trimming, text callout FX, background beat sync, and auto-captioning for product demo clips.
              </p>
              <div className="text-[11px] font-mono text-[#0F5A33] dark:text-emerald-400 font-bold">
                Free • Auto Captions • Text FX
              </div>
            </div>

            {/* TOOL 3 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-white border-[#E2DAD0] shadow-xs"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-800 dark:text-blue-400 flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className={`font-manrope text-base font-bold mb-1.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                OBS Studio + ZoomIt
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${darkMode ? "text-surface-200" : "text-forest-900/80"}`}>
                <strong>Best for:</strong> Smooth 60fps raw recording. Sysinternals ZoomIt lets you draw live shapes on receipt OCR fields during capture.
              </p>
              <div className="text-[11px] font-mono text-blue-800 dark:text-blue-400 font-bold">
                Open Source • 60 FPS Capture
              </div>
            </div>

            {/* TOOL 4 */}
            <div className={`p-6 rounded-2xl border ${
              darkMode ? "bg-forest-900/40 border-forest-800" : "bg-white border-[#E2DAD0] shadow-xs"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-800 dark:text-amber-400 flex items-center justify-center mb-4">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className={`font-manrope text-base font-bold mb-1.5 ${darkMode ? "text-white" : "text-forest-950"}`}>
                DaVinci Resolve
              </h3>
              <p className={`text-xs leading-relaxed mb-3 ${darkMode ? "text-surface-200" : "text-forest-900/80"}`}>
                <strong>Best for:</strong> Professional keyframe zooms, speed ramping, color grading, and high-fidelity sound design.
              </p>
              <div className="text-[11px] font-mono text-amber-800 dark:text-amber-400 font-bold">
                Pro Grade Editor • Free Version
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL FOR EXPANDED FULL-SCREEN SCREENSHOT INSPECION */}
      {activeModalImage && (
        <div 
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-6xl max-h-[90vh] overflow-auto rounded-2xl border border-white/20">
            <img 
              src={activeModalImage} 
              alt="Expanded Screenshot View" 
              className="w-full h-auto object-contain rounded-2xl"
            />
            <button 
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-mono font-bold hover:bg-black"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className={`py-12 border-t ${
        darkMode ? "bg-forest-950 border-forest-800/60" : "bg-white border-[#E2DAD0]"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                FC
              </div>
              <div>
                <span className={`font-manrope text-base font-bold ${darkMode ? "text-white" : "text-forest-950"}`}>
                  FlowClaim
                </span>
                <p className="text-xs text-forest-700 dark:text-surface-400">Enterprise Expense Reimbursement Platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-forest-800 dark:text-surface-300 font-semibold">
              <Link to="/login" className="hover:text-forest-600 transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-forest-600 transition-colors">Sign Up</Link>
              <a 
                href="https://github.com/Aditya2550" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-700 text-white font-bold hover:bg-forest-800 active:scale-95 transition-all shadow-xs"
              >
                <GithubIcon className="w-4 h-4" />
                GitHub Profile
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>

          <div className="mt-8 pt-6 border-t border-[#EFEBE4] dark:border-forest-900 text-center text-xs text-forest-700 dark:text-surface-400">
            <p>
              Designed & Built Solo by <strong className={darkMode ? "text-white" : "text-forest-950"}>Aditya Valsangkar</strong>. Originally prototyped at Odoo Hackathon 2026.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
