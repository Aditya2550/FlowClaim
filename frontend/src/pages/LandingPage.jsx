import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollExpand from "../components/ui/ScrollExpand";
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
  Maximize2,
  Monitor,
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

// Letter stagger animation variants for "ENTERPRISE TEAMS"
const letterContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.25,
    },
  },
};

const letterVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Navbar pills entrance animation variants
const navContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const navLinks = [
  { id: "showcase", label: "Product Showcase", href: "#hero-showcase" },
  { id: "features", label: "Features", href: "#features" },
  { id: "roles", label: "Role Workspaces", href: "#roles" },
  { id: "how-it-works", label: "Workflow", href: "#how-it-works" },
  { id: "faq", label: "FAQ", href: "#faq" },
];

export default function LandingPage() {
  // Theme state: default soft cream light mode
  const [darkMode, setDarkMode] = useState(false);

  // Active navigation section state & hover state (null when in top Hero section)
  const [activeNavSection, setActiveNavSection] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const isManualScrollingRef = React.useRef(false);

  // Interactive demo states
  const [activeRoleTab, setActiveRoleTab] = useState("analytics");
  const [heroViewMode, setHeroViewMode] = useState("laptop"); // "laptop" | "stacked"
  const [activeModalImage, setActiveModalImage] = useState(null);

  // FAQ accordion open state
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Smooth scroll handler to target section
  const scrollToSection = (sectionId, e) => {
    if (e) e.preventDefault();
    setHoveredNav(null);
    setActiveNavSection(sectionId);
    isManualScrollingRef.current = true;

    const targetMap = {
      showcase: "hero-showcase",
      features: "features",
      roles: "roles",
      "how-it-works": "how-it-works",
      faq: "faq",
    };

    const targetElemId = targetMap[sectionId] || sectionId;
    const element = document.getElementById(targetElemId);
    if (element) {
      const targetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);
  };

  // Scroll listener to update active navbar section automatically as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isManualScrollingRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const heroShowcaseElem = document.getElementById("hero-showcase");

      // When in top Hero section (before Product Showcase), no navbar pill should be active!
      if (heroShowcaseElem && scrollY < heroShowcaseElem.offsetTop - 160) {
        setActiveNavSection(null);
        return;
      }

      // At bottom of page, activate last section
      if (scrollY + windowHeight >= documentHeight - 80) {
        setActiveNavSection("faq");
        return;
      }

      const targetSections = [
        { id: "showcase", element: heroShowcaseElem },
        { id: "features", element: document.getElementById("features") },
        { id: "roles", element: document.getElementById("roles") },
        {
          id: "how-it-works",
          element: document.getElementById("how-it-works"),
        },
        { id: "faq", element: document.getElementById("faq") },
      ];

      let currentActive = null;
      for (let i = targetSections.length - 1; i >= 0; i--) {
        const item = targetSections[i];
        if (item.element && scrollY >= item.element.offsetTop - 160) {
          currentActive = item.id;
          break;
        }
      }
      setActiveNavSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`min-h-screen font-inter transition-colors duration-300 ${
        darkMode
          ? "bg-[#05130A] text-[#F0FDF4] selection:bg-emerald-600 selection:text-white"
          : "bg-[#F7F4EF] text-forest-950 selection:bg-forest-600 selection:text-white"
      }`}
    >
      {/* TOP FLOATING NAV (Refined Glassmorphism Pill Capsule Navbar) */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div
          className={`h-16 px-6 rounded-full flex items-center justify-between transition-all duration-300 ${
            darkMode
              ? "bg-[#071C10]/90 border border-emerald-800/80 shadow-2xl backdrop-blur-xl"
              : "bg-white/85 text-forest-950 border border-white/80 shadow-xl backdrop-blur-xl"
          }`}
        >
          {/* BRAND WITH MUTED REFINED LOGO */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-forest-600 text-white flex items-center justify-center shadow-sm border border-forest-500/30 group-hover:scale-105 transition-transform">
              <img
                src="/favicon-32x32.png"
                alt="FlowClaim Logo"
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  if (e.target.nextSibling)
                    e.target.nextSibling.style.display = "block";
                }}
              />
              <Check className="w-4.5 h-4.5 text-white stroke-[3] hidden" />
            </div>
            <span
              className={`font-manrope font-extrabold text-lg tracking-tight ${darkMode ? "text-white" : "text-forest-950"}`}
            >
              FlowClaim
            </span>
          </Link>

          {/* NAV LINKS (Staggered load-in & active section indicator pill) */}
          <motion.nav
            className="hidden md:flex items-center space-x-1.5 text-xs font-semibold tracking-wide"
            variants={navContainerVariants}
            initial="hidden"
            animate="visible"
            onMouseLeave={() => setHoveredNav(null)}
          >
            {navLinks.map((item) => {
              const isActive = activeNavSection === item.id;
              const isHovered = hoveredNav === item.id;

              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  variants={navItemVariants}
                  onMouseEnter={() => setHoveredNav(item.id)}
                  onClick={(e) => scrollToSection(item.id, e)}
                  className={`relative px-3.5 py-1.5 rounded-full transition-colors duration-200 ${
                    isActive
                      ? darkMode
                        ? "text-white font-extrabold"
                        : "text-forest-950 font-extrabold"
                      : darkMode
                        ? "text-emerald-200/80 hover:text-white"
                        : "text-forest-900/80 hover:text-forest-950 font-semibold"
                  }`}
                >
                  {/* PERSISTENT ACTIVE GREEN OUTLINE PILL */}
                  {isActive && (
                    <motion.div
                      layoutId="navActivePill"
                      className={`absolute inset-0 rounded-full transition-all pointer-events-none ${
                        darkMode
                          ? "bg-emerald-500/25 border-2 border-emerald-400 shadow-sm shadow-emerald-950/50"
                          : "bg-forest-600/15 border-2 border-forest-600 shadow-xs"
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* HOVER INDICATOR FOR NON-ACTIVE TABS */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navHoverPill"
                      className={`absolute inset-0 rounded-full transition-all pointer-events-none ${
                        darkMode
                          ? "bg-emerald-500/15 border border-emerald-500/30"
                          : "bg-forest-600/10 border border-forest-600/20"
                      }`}
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  <span className="relative z-10">{item.label}</span>
                </motion.a>
              );
            })}
          </motion.nav>

          {/* RIGHT ACTIONS: LIGHT/DARK TOGGLE & AUTH PILLS */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${
                darkMode
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-xs"
                  : "bg-forest-600/10 hover:bg-forest-600/20 text-forest-700 border border-forest-600/20"
              }`}
              title={
                darkMode
                  ? "Switch to Soft Cream Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-emerald-300" />
              ) : (
                <Moon className="w-4 h-4 text-forest-700" />
              )}
            </button>

            <Link
              to="/login"
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                darkMode
                  ? "text-emerald-200 hover:text-white hover:bg-white/10"
                  : "text-forest-900 hover:text-black hover:bg-forest-900/10"
              }`}
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="px-5 py-2 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md shadow-forest-950/20 border border-forest-500/30 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              Sign Up
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH CINEMATIC PORTRAIT BLUR BACKGROUND & ORGANIC ROUNDED FRAME */}
      <section className="pt-6 pb-16 md:pt-8 md:pb-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* ROUNDED HERO CANVAS FRAME */}
          <div
            className={`relative overflow-hidden rounded-3xl sm:rounded-[40px] border shadow-2xl transition-all duration-300 p-6 sm:p-10 lg:p-14 ${
              darkMode
                ? "bg-[#06170D] border-emerald-900/50 shadow-emerald-950/80"
                : "bg-[#FAF7F2] border-[#E5DDD2] shadow-forest-900/10"
            }`}
          >
            {/* REAL-WORLD PORTRAIT BLUR BACKGROUND IMAGE WITH ADAPTIVE GRADIENT MASK */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src="/assets/landing/hero-cinematic-bg.png"
                alt="Executive Office Desk Bokeh Ambience"
                className="w-full h-full object-cover object-right-bottom filter scale-105 opacity-65 dark:opacity-55 transition-opacity duration-500"
              />
              {/* GRADIENT BACKDROP MASK FOR GUARANTEED 100% TEXT LEGIBILITY */}
              <div
                className={`absolute inset-0 ${
                  darkMode
                    ? "bg-gradient-to-r from-[#05130A]/95 via-[#05130A]/75 to-transparent"
                    : "bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent"
                }`}
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN (~55% width: lg:col-span-7) */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* BOLD LEFT-ALIGNED HEADLINE WITH LETTER-BY-LETTER ANIMATION */}
                <h1
                  className={`font-manrope text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] ${
                    darkMode ? "text-[#F0FDF4]" : "text-forest-950"
                  }`}
                >
                  Smarter expense reimbursements for{" "}
                  <motion.span
                    className="inline-flex flex-wrap"
                    variants={letterContainerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {"Modern Finance Teams"
                      .split(" ")
                      .map((word, wordIndex) => (
                        <span
                          key={wordIndex}
                          className="inline-block whitespace-nowrap mr-[0.28em]"
                        >
                          {Array.from(word).map((char, charIndex) => (
                            <motion.span
                              key={charIndex}
                              variants={letterVariants}
                              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-forest-500 via-emerald-600 to-[#10B981]"
                            >
                              {char}
                            </motion.span>
                          ))}
                        </span>
                      ))}
                  </motion.span>
                </h1>

                {/* LEFT-ALIGNED SUBTITLE */}
                <p
                  className={`text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl ${
                    darkMode
                      ? "text-[#B6E3C6]"
                      : "text-forest-900/90 font-medium"
                  }`}
                >
                  Eliminate friction-heavy expense forms with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-500 via-emerald-600 to-[#10B981] font-extrabold">
                    AI Vision OCR
                  </span>
                  , configurable multi-tier approvals, and real-time Socket.io
                  dispatch to move claims from receipt snap to payout in
                  seconds.
                </p>

                {/* EDITORIAL PILL CTAS */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4">
                  <Link
                    to="/signup"
                    className="px-8 py-4 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm shadow-xl shadow-forest-900/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 group"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <a
                    href="#hero-showcase"
                    onClick={(e) => scrollToSection("showcase", e)}
                    className={`px-7 py-4 rounded-full font-bold text-sm border backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 ${
                      darkMode
                        ? "bg-[#0B2317]/80 border-[#18492C] text-emerald-100 hover:bg-[#103321]"
                        : "bg-white/80 border-[#E2DAD0] text-forest-950 hover:bg-white shadow-xs"
                    }`}
                  >
                    <span>Take Product Tour</span>
                    <ChevronRight className="w-4 h-4 text-forest-700 dark:text-emerald-400" />
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN (~45% width: lg:col-span-5): CLEAN SLEEK FLOATING FINTECH CALLOUT CARD ONLY */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex items-center justify-center min-h-[220px]">
                <div
                  className={`p-5 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center gap-4 ${
                    darkMode
                      ? "bg-[#0A2617]/95 border-emerald-500/50 text-white shadow-2xl shadow-emerald-950/80 ring-1 ring-emerald-500/30"
                      : "bg-white/95 border-emerald-200/90 text-forest-950 shadow-forest-900/15 ring-1 ring-emerald-500/10"
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src="/assets/landing/hero-claim-paid.png"
                      alt="Claim Paid Receipt"
                      className="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="space-y-0.5 pr-2 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-manrope font-extrabold text-sm sm:text-base tracking-tight">
                        Claim Verified
                      </span>
                    </div>
                    <div className="text-xs font-medium flex items-center gap-2">
                      <span className="font-bold font-mono text-forest-700 dark:text-emerald-400 text-sm">
                        $1,240.00
                      </span>
                      <span className="text-surface-400">•</span>
                      <span
                        className={
                          darkMode ? "text-emerald-300" : "text-forest-800/90"
                        }
                      >
                        Payout Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED STANDALONE SCROLL-EXPAND SECTION DIRECTLY BELOW HERO */}
      <section
        id="scroll-expand-section"
        className={`relative w-full border-t transition-colors ${
          darkMode
            ? "bg-[#05130A] border-emerald-900/40"
            : "bg-[#F7F4EF] border-[#E2DAD0]"
        }`}
      >
        <ScrollExpand
          src="/assets/screenshots/ocr-scan-detail.png"
          alt="FlowClaim AI Receipt OCR Scanning"
          title="See it in action"
          scrollHint="Scroll to expand"
          startWidth={42}
          startHeight={58}
          startRadius={24}
          endRadius={0}
          mediaZoom={1.35}
          scrollDistance={1.2}
          holdDistance={0.35}
          smoothing={0.1}
          overlayScrim={darkMode ? 0.6 : 0.35}
          useWindowScroll={true}
          enabled={true}
          darkMode={darkMode}
        >
          <div
            className={`space-y-4 max-w-2xl mx-auto text-center px-6 py-8 rounded-3xl backdrop-blur-xl border shadow-2xl transition-colors ${
              darkMode
                ? "bg-[#071C10]/85 border-emerald-500/40 text-white shadow-emerald-950/80"
                : "bg-white/90 border-[#E2DAD0] text-forest-950 shadow-forest-900/10"
            }`}
          >
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-widest inline-block shadow-xs border ${
                darkMode
                  ? "bg-[#103D26] text-[#34D399] border-[#22663F]"
                  : "bg-forest-600/10 text-forest-700 border-forest-600/20"
              }`}
            >
              AI Vision Receipt OCR
            </span>
            <h2
              className={`font-manrope text-3xl sm:text-5xl font-extrabold tracking-tight ${
                darkMode ? "text-[#F0FDF4]" : "text-forest-950"
              }`}
            >
              From receipt to reimbursed in seconds
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                darkMode ? "text-[#B6E3C6]" : "text-forest-900/85 font-medium"
              }`}
            >
              Automated receipt scanning, intelligent approval routing, and
              instant payout dispatch.
            </p>
          </div>
        </ScrollExpand>
      </section>

      {/* DEDICATED PRODUCT SHOWCASE SECTION DIRECTLY BELOW HERO */}
      <section
        id="hero-showcase"
        className={`py-16 border-t ${
          darkMode
            ? "bg-[#05130A] border-emerald-900/40"
            : "bg-[#F7F4EF] border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 dark:bg-[#103D26] dark:text-[#34D399] border border-forest-600/20 dark:border-[#22663F] inline-block mb-3 shadow-xs">
              Live Interactive Workspace
            </span>
            <h2
              className={`font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight ${
                darkMode ? "text-[#F0FDF4]" : "text-forest-950"
              }`}
            >
              Explore the FlowClaim Interface
            </h2>
            <p
              className={`mt-2 text-sm ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80 font-medium"}`}
            >
              Switch between laptop and stacked layer views to preview AI Vision
              OCR scanning and manager verification in real time.
            </p>
          </div>

          {/* VIEW MODE TOGGLE CAPSULE */}
          <div className="flex justify-center mb-8">
            <div
              className={`p-1.5 rounded-full border inline-flex items-center gap-1.5 shadow-sm ${
                darkMode
                  ? "bg-[#071B10] border-[#174B2C]"
                  : "bg-[#EAE4DA] border-[#DCD3C5]"
              }`}
            >
              <button
                onClick={() => setHeroViewMode("stacked")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  heroViewMode === "stacked"
                    ? "bg-forest-700 text-white shadow-sm"
                    : darkMode
                      ? "text-emerald-200/80 hover:text-white"
                      : "text-forest-950 hover:text-black font-semibold"
                }`}
              >
                <Layers className="w-4 h-4" />
                Stacked Layer View
              </button>
              <button
                onClick={() => setHeroViewMode("laptop")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  heroViewMode === "laptop"
                    ? "bg-forest-700 text-white shadow-sm"
                    : darkMode
                      ? "text-emerald-200/80 hover:text-white"
                      : "text-forest-950 hover:text-black font-semibold"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Laptop Dashboard
              </button>
            </div>
          </div>

          {/* SHOWCASE DISPLAY CONTAINER */}
          <div
            className={`max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl border shadow-xl ${
              darkMode
                ? "bg-[#0B2317] border-[#18492C]"
                : "bg-white border-[#E2DAD0]"
            }`}
          >
            {heroViewMode === "stacked" ? (
              <div className="relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center p-4">
                {/* BACK LAYER: OCR RECEIPT SCANNER */}
                <div
                  onClick={() =>
                    setActiveModalImage(
                      "/assets/screenshots/ocr-receipt-scanner.png",
                    )
                  }
                  className={`absolute left-4 sm:left-12 top-4 w-[85%] sm:w-[420px] rounded-2xl p-2.5 border cursor-pointer transition-all duration-500 transform -rotate-3 hover:rotate-0 hover:z-30 hover:scale-105 shadow-xl ${
                    darkMode
                      ? "bg-[#0A2617]/95 border-emerald-600/50 shadow-2xl shadow-emerald-950/80"
                      : "bg-white border-[#E2DAD0] shadow-forest-900/10"
                  }`}
                  style={{ zIndex: 10 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] dark:border-[#154628] flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-forest-700 dark:text-emerald-200">
                      LAYER 01: AI Vision Receipt OCR
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F4EC] dark:bg-emerald-950 dark:border dark:border-emerald-700/40 text-[#0F5A33] dark:text-emerald-300 font-bold">
                      Scanning
                    </span>
                  </div>
                  <img
                    src="/assets/screenshots/ocr-receipt-scanner.png"
                    alt="OCR Receipt Scanner"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>

                {/* FRONT LAYER: MANAGER APPROVAL QUEUE */}
                <div
                  onClick={() =>
                    setActiveModalImage(
                      "/assets/screenshots/manager-approval-queue.png",
                    )
                  }
                  className={`absolute right-4 sm:right-12 top-16 sm:top-20 w-[88%] sm:w-[450px] rounded-2xl p-2.5 border cursor-pointer transition-all duration-500 transform rotate-2 hover:rotate-0 hover:z-30 hover:scale-105 shadow-2xl ${
                    darkMode
                      ? "bg-[#0A2617]/95 border-emerald-600/50 shadow-2xl shadow-emerald-950/80"
                      : "bg-white border-[#E2DAD0] shadow-forest-900/15"
                  }`}
                  style={{ zIndex: 20 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] dark:border-[#154628] flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-forest-700 dark:text-emerald-200">
                      LAYER 02: Expense Verification UI
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-forest-700 text-white font-bold">
                      Live
                    </span>
                  </div>
                  <img
                    src="/assets/screenshots/manager-approval-queue.png"
                    alt="Manager Approval Queue"
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
              </div>
            ) : (
              <div
                className="relative group cursor-pointer"
                onClick={() =>
                  setActiveModalImage(
                    "/assets/screenshots/hero-laptop-frame.png",
                  )
                }
              >
                <div className="relative mx-auto overflow-hidden rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
                  <img
                    src="/assets/screenshots/hero-laptop-frame.png"
                    alt="FlowClaim Product Showcase on Laptop"
                    className="w-full h-auto object-cover rounded-2xl"
                    onError={(e) => {
                      e.target.src =
                        "/assets/screenshots/hero-laptop-dashboard.png";
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CORE FEATURES GRID WITH REAL PRODUCT SCREENSHOTS & SAAS GRAPHICS */}
      <section
        id="features"
        className={`py-20 border-t transition-colors ${
          darkMode
            ? "bg-[#07190E] border-emerald-900/40"
            : "bg-white border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 dark:bg-[#103D26] dark:text-[#34D399] border border-forest-600/20 dark:border-[#22663F] inline-block mb-3 shadow-xs">
              Platform Features
            </span>
            <h2
              className={`font-manrope text-3xl sm:text-5xl font-extrabold tracking-tight ${
                darkMode ? "text-[#F0FDF4]" : "text-forest-950"
              }`}
            >
              Engineered for absolute reimbursement clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FEATURE 1: AI VISION OCR EXTRACTION */}
            <div
              className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden ${
                      darkMode
                        ? "bg-[#06180D] border-[#154628] text-emerald-300"
                        : "bg-white border-[#C2E2CE] text-[#0F5A33]"
                    }`}
                  >
                    <img
                      src="/assets/landing/feature-ocr-extract.png"
                      alt="AI OCR Extract Icon"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      style={{ transform: "scale(1.45)" }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 dark:bg-[#103D26] dark:text-[#34D399] border border-forest-600/30 dark:border-[#22663F]">
                    Automated OCR
                  </span>
                </div>
                <h3
                  className={`font-manrope text-2xl font-extrabold mb-3 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Intelligent Receipt Scanning
                </h3>
                <p
                  className={`text-sm leading-relaxed font-normal mb-6 ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Automatically parses uploaded receipt images and PDFs into
                  structured fields including vendor name, total amount, GST
                  split, category, invoice ID, and date in under 2 seconds.
                </p>
              </div>
              <div
                onClick={() =>
                  setActiveModalImage(
                    "/assets/screenshots/ocr-receipt-scanner.png",
                  )
                }
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-[#154628] cursor-pointer shadow-sm"
              >
                <img
                  src="/assets/screenshots/ocr-receipt-scanner.png"
                  alt="OCR Scanner Preview"
                  className="w-full h-44 sm:h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold backdrop-blur-xs">
                  Click to Expand Full View
                </div>
              </div>
            </div>

            {/* FEATURE 2: ENTERPRISE ACCESS CONTROLS */}
            <div
              className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 p-2.5 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden ${
                      darkMode
                        ? "bg-[#06180D] border-[#154628] text-emerald-300"
                        : "bg-white border-[#C2E2CE] text-[#0F5A33]"
                    }`}
                  >
                    <img
                      src="/assets/landing/feature-rbac-governance.png"
                      alt="RBAC Governance Seal"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      style={{ transform: "scale(1.3)" }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 dark:bg-[#103D26] dark:text-[#34D399] border border-forest-600/30 dark:border-[#22663F]">
                    Role Security
                  </span>
                </div>
                <h3
                  className={`font-manrope text-2xl font-extrabold mb-3 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Enterprise Access Controls
                </h3>
                <p
                  className={`text-sm leading-relaxed font-normal mb-6 ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Strict scope isolation and permission matrices across 5
                  dedicated roles: Employee, Manager, Admin, Director, and
                  Finance teams.
                </p>
              </div>
              <div
                onClick={() =>
                  setActiveModalImage(
                    "/assets/screenshots/admin-approval-rules.png",
                  )
                }
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-[#154628] cursor-pointer shadow-sm"
              >
                <img
                  src="/assets/screenshots/admin-approval-rules.png"
                  alt="Admin Approval Rules Preview"
                  className="w-full h-44 sm:h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold backdrop-blur-xs">
                  Click to Expand Full View
                </div>
              </div>
            </div>

            {/* FEATURE 3: REAL-TIME STATUS SYNC */}
            <div
              className={`p-7 sm:p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 p-2 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden ${
                      darkMode
                        ? "bg-[#06180D] border-[#154628] text-emerald-300"
                        : "bg-white border-[#C2E2CE] text-[#0F5A33]"
                    }`}
                  >
                    <img
                      src="/assets/landing/feature-socket-push.png"
                      alt="Socket Push Diagram"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                      style={{ transform: "scale(1.45)" }}
                    />
                  </div>
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 dark:bg-[#103D26] dark:text-[#34D399] border border-forest-600/30 dark:border-[#22663F]">
                    Instant Alerts
                  </span>
                </div>
                <h3
                  className={`font-manrope text-2xl font-extrabold mb-3 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Real-Time Status Sync
                </h3>
                <p
                  className={`text-sm leading-relaxed font-normal mb-6 ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Zero polling overhead. Approvers receive instant push
                  notifications and live badge count updates the moment a claim
                  is filed or processed.
                </p>
              </div>
              <div
                onClick={() =>
                  setActiveModalImage(
                    "/assets/screenshots/manager-approval-queue.png",
                  )
                }
                className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-[#154628] cursor-pointer shadow-sm"
              >
                <img
                  src="/assets/screenshots/manager-approval-queue.png"
                  alt="Manager Queue Preview"
                  className="w-full h-44 sm:h-48 object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold backdrop-blur-xs">
                  Click to Expand Full View
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE OS WORKSPACE SWITCHER WITH PILL SEGMENT TABS */}
      <section
        id="roles"
        className={`py-20 border-t ${
          darkMode
            ? "bg-[#05130A] border-emerald-900/40"
            : "bg-[#F7F4EF] border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2
              className={`font-manrope text-3xl font-extrabold ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
            >
              Explore Role Workspaces
            </h2>
          </div>

          {/* REFINED ROLE SWITCHER PILL CONTAINER */}
          <div className="flex justify-center mb-10">
            <div
              className={`p-1.5 rounded-full border flex flex-wrap items-center justify-center gap-1.5 ${
                darkMode
                  ? "bg-[#071B10] border-[#174B2C]"
                  : "bg-[#EAE4DA] border-[#DCD3C5]"
              }`}
            >
              {[
                {
                  id: "analytics",
                  label: "Analytics View",
                  img: "/assets/screenshots/analytics-overview.png",
                },
                {
                  id: "employee",
                  label: "Employee View",
                  img: "/assets/screenshots/ocr-receipt-scanner.png",
                },
                {
                  id: "manager",
                  label: "Manager View",
                  img: "/assets/screenshots/manager-approval-queue.png",
                },
                {
                  id: "admin",
                  label: "Admin & Rules",
                  img: "/assets/screenshots/admin-approval-rules.png",
                },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRoleTab(role.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 ${
                    activeRoleTab === role.id
                      ? "bg-forest-700 text-white shadow-sm"
                      : darkMode
                        ? "text-emerald-200/80 hover:text-white"
                        : "text-forest-900 hover:text-black font-semibold"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE ROLE SCREENSHOT DISPLAY */}
          <div
            className={`max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl border ${
              darkMode
                ? "bg-[#0B2317] border-[#18492C] shadow-xl shadow-emerald-950/50"
                : "bg-white border-[#E2DAD0] shadow-md"
            }`}
          >
            <div className="text-xs font-mono text-forest-700 dark:text-emerald-400 font-bold uppercase mb-1.5">
              Active Workspace: {activeRoleTab.toUpperCase()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <h3
                  className={`font-manrope text-2xl font-bold mb-3 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  {activeRoleTab === "employee" &&
                    "Employee Receipt Upload & Claim Verification"}
                  {activeRoleTab === "manager" &&
                    "Manager Queue & Side-by-Side Verification"}
                  {activeRoleTab === "analytics" &&
                    "Spend Velocity & Turnaround Visual Analytics"}
                  {activeRoleTab === "admin" &&
                    "System Permission Rules & Threshold Setup"}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-4 ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  FlowClaim isolates data access strictly according to user
                  roles, ensuring governance compliance, rapid turnaround times,
                  and audit reliability across every department.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div
                  onClick={() => {
                    const imgMap = {
                      employee: "/assets/screenshots/ocr-receipt-scanner.png",
                      manager: "/assets/screenshots/manager-approval-queue.png",
                      analytics: "/assets/screenshots/analytics-overview.png",
                      admin: "/assets/screenshots/admin-approval-rules.png",
                    };
                    setActiveModalImage(
                      imgMap[activeRoleTab] ||
                        "/assets/screenshots/hero-laptop-dashboard.png",
                    );
                  }}
                  className="relative rounded-xl overflow-hidden border border-[#E2DAD0] dark:border-[#154628] group cursor-pointer shadow-lg"
                >
                  <img
                    src={
                      activeRoleTab === "employee"
                        ? "/assets/screenshots/ocr-receipt-scanner.png"
                        : activeRoleTab === "manager"
                          ? "/assets/screenshots/manager-approval-queue.png"
                          : activeRoleTab === "analytics"
                            ? "/assets/screenshots/analytics-overview.png"
                            : "/assets/screenshots/admin-approval-rules.png"
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
      <section
        id="how-it-works"
        className={`py-20 border-t ${
          darkMode
            ? "bg-[#07190E] border-emerald-900/40"
            : "bg-white border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 dark:bg-emerald-950 dark:text-emerald-300 border border-forest-600/20 dark:border-emerald-700/50 inline-block mb-3">
              Automated Process
            </span>
            <h2
              className={`font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
            >
              Three Simple Steps to Reimbursement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* STEP 1 */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-extrabold bg-forest-700 text-white shadow-xs">
                    Step 01
                  </span>
                  <span className="text-[11px] font-mono font-bold text-forest-700 dark:text-emerald-400 uppercase tracking-wider">
                    AI OCR Scan
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div
                  className={`my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors ${
                    darkMode
                      ? "bg-[#06180D] border-[#154628]"
                      : "bg-white border-[#E2DAD0] shadow-xs"
                  }`}
                >
                  <img
                    src="/assets/landing/hero-ocr-visual.png"
                    alt="Snap & OCR Scan"
                    className="h-32 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3
                  className={`font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Snap & OCR Scan
                </h3>
                <p
                  className={`text-sm leading-relaxed ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Drop receipt photo or PDF. Gemini vision auto-extracts
                  merchant, date, total amount, and GST split in under 2
                  seconds.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-extrabold bg-forest-700 text-white shadow-xs">
                    Step 02
                  </span>
                  <span className="text-[11px] font-mono font-bold text-forest-700 dark:text-emerald-400 uppercase tracking-wider">
                    Smart Routing
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div
                  className={`my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors ${
                    darkMode
                      ? "bg-[#06180D] border-[#154628]"
                      : "bg-white border-[#E2DAD0] shadow-xs"
                  }`}
                >
                  <img
                    src="/assets/landing/workflow-step2-approval.png"
                    alt="Smart Approval Routing"
                    className="h-36 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3
                  className={`font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Smart Approval Routing
                </h3>
                <p
                  className={`text-sm leading-relaxed ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Claim routes automatically to direct manager or director based
                  on configured organizational threshold rules.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div
              className={`p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group ${
                darkMode
                  ? "bg-[#0B2317] border-[#18492C] hover:border-emerald-500/50 shadow-lg shadow-emerald-950/40"
                  : "bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md"
              }`}
            >
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-mono font-extrabold bg-forest-700 text-white shadow-xs">
                    Step 03
                  </span>
                  <span className="text-[11px] font-mono font-bold text-forest-700 dark:text-emerald-400 uppercase tracking-wider">
                    Direct Payout
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div
                  className={`my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors ${
                    darkMode
                      ? "bg-[#06180D] border-[#154628]"
                      : "bg-white border-[#E2DAD0] shadow-xs"
                  }`}
                >
                  <img
                    src="/assets/landing/workflow-step3-payout.png"
                    alt="Finance Audit & Payout"
                    className="h-32 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3
                  className={`font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  Finance Audit & Payout
                </h3>
                <p
                  className={`text-sm leading-relaxed ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85"}`}
                >
                  Finance verifies tax credit eligibility and completes
                  reimbursement disbursement seamlessly with full audit trail
                  logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGH-CONVERTING EMPLOYEE SUCCESS CTA BANNER */}
      <section
        className={`py-16 border-t ${
          darkMode
            ? "bg-[#05130A] border-emerald-900/40"
            : "bg-[#F3EEE6] border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`p-8 sm:p-12 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${
              darkMode
                ? "bg-gradient-to-r from-[#061C10] via-[#0C321E] to-[#061C10] border-emerald-500/40 shadow-2xl shadow-emerald-950/60"
                : "bg-white border-[#E2DAD0]"
            }`}
          >
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-[#E8F4EC] text-[#0F5A33] dark:bg-emerald-950 dark:text-emerald-300 border border-[#C2E2CE] dark:border-emerald-700/50 inline-block">
                Instant Employee Satisfaction
              </span>
              <h2
                className={`font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
              >
                Transform corporate reimbursements from hours to seconds
              </h2>
              <p
                className={`text-sm leading-relaxed ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/85 font-medium"}`}
              >
                Empower your financial team with automated OCR verification,
                audit logging, and direct payout routing.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started Free Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="relative shrink-0 z-10">
              <img
                src="/assets/landing/cta-employee-success.png"
                alt="Employee Reimbursement Success"
                className="w-56 sm:w-64 h-auto object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (ENTERPRISE FAQ ACCORDION) */}
      <section
        id="faq"
        className={`py-20 border-t ${
          darkMode
            ? "bg-[#07190E] border-emerald-900/40"
            : "bg-[#F7F4EF] border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#E8F4EC] text-[#0F5A33] dark:bg-emerald-950 dark:text-emerald-300 border border-[#C2E2CE] dark:border-emerald-700/50 inline-block mb-3">
              Frequently Asked Questions
            </span>
            <h2
              className={`font-manrope text-3xl sm:text-4xl font-extrabold ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
            >
              Everything you need to know about FlowClaim
            </h2>
            <p
              className={`mt-3 text-sm font-medium ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80"}`}
            >
              Got questions about receipt OCR, approval threshold routing, or
              audit exports? We have answers.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How accurate is the automated AI Vision receipt scanner?",
                a: "FlowClaim extracts merchant details, line items, total amounts, receipt dates, and GST splits with over 99% accuracy across JPEG, PNG, and multi-page PDF files in under 2 seconds.",
              },
              {
                q: "How do multi-tier approval workflows work?",
                a: "Claims automatically route based on your organization's custom rules. Submissions under a set threshold (e.g. $500) route to direct Managers, while higher amounts automatically escalate to Department Directors or Finance clearance.",
              },
              {
                q: "Can Finance export verified claims for accounting software?",
                a: "Yes. Finance administrators can filter claims by date range, department, status, or manager approval and export structured CSV audit reports ready for direct import into ERP systems.",
              },
              {
                q: "How does role-based access control (RBAC) keep employee data private?",
                a: "FlowClaim isolates view permissions across 5 dedicated role tiers: Employee, Manager, Director, Finance, and Admin. Employees only access their own claims, while managers strictly view direct report submissions.",
              },
              {
                q: "Are claim notifications updated in real time?",
                a: "Yes. FlowClaim uses real-time event dispatches to push instant notifications and update workspace badge counts the exact moment a claim is filed, approved, or marked paid.",
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    darkMode
                      ? "bg-[#0B2317] border-[#18492C]"
                      : "bg-white border-[#E2DAD0] shadow-xs"
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-manrope font-bold text-base sm:text-lg focus:outline-none"
                  >
                    <span
                      className={
                        darkMode ? "text-[#F0FDF4]" : "text-forest-950"
                      }
                    >
                      {faq.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-transform duration-300 ${
                        darkMode
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                          : "bg-[#E8F4EC] text-[#0F5A33] border border-[#C2E2CE]"
                      } ${isOpen ? "rotate-180" : ""}`}
                    >
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div
                      className={`px-5 pb-6 sm:px-6 sm:pb-6 text-sm leading-relaxed border-t pt-4 ${
                        darkMode
                          ? "text-[#B6E3C6] border-[#154628]"
                          : "text-forest-900/85 border-[#EFEBE4]"
                      }`}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
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
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-mono font-bold hover:bg-black border border-white/20"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}

      {/* ENTERPRISE SAAS MULTI-COLUMN FOOTER */}
      <footer
        className={`pt-16 pb-12 border-t transition-colors ${
          darkMode
            ? "bg-[#040F08] border-t border-[#133A22]"
            : "bg-white border-[#E2DAD0]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MAIN 4-COLUMN FOOTER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#EFEBE4] dark:border-[#133A22]">
            {/* COL 1: BRAND & LIVE STATUS */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-forest-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-forest-500/30">
                  <img
                    src="/favicon-32x32.png"
                    alt="FlowClaim"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      if (e.target.nextSibling)
                        e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <Check className="w-4 h-4 text-white stroke-[3] hidden" />
                </div>
                <span
                  className={`font-manrope text-xl font-extrabold tracking-tight ${darkMode ? "text-[#F0FDF4]" : "text-forest-950"}`}
                >
                  FlowClaim
                </span>
              </div>

              <p
                className={`text-xs leading-relaxed max-w-sm ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80 font-medium"}`}
              >
                Enterprise expense reimbursement platform engineered with AI
                receipt intelligence, 5-tier role access controls, multi-tier
                approval routing, and instant real-time status sync.
              </p>

              {/* LIVE SYSTEM STATUS BADGE */}
              <div className="pt-2">
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold border transition-colors ${
                    darkMode
                      ? "bg-[#0B2416] text-emerald-300 border-emerald-500/40 shadow-md"
                      : "bg-forest-600/10 text-forest-700 border-forest-600/20 shadow-xs"
                  }`}
                >
                  System Operational • v2.0 Production
                </div>
              </div>
            </div>

            {/* COL 2: PLATFORM FEATURES */}
            <div className="lg:col-span-3 space-y-3">
              <h4
                className={`text-xs font-mono font-bold uppercase tracking-wider ${darkMode ? "text-emerald-300" : "text-forest-700"}`}
              >
                Platform Core
              </h4>
              <ul
                className={`space-y-2 text-xs font-medium ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80"}`}
              >
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  AI Vision OCR Extraction
                </li>
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  5-Level Granular RBAC Matrix
                </li>
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  Configurable Threshold Rules
                </li>
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  Socket.io Real-Time Push
                </li>
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  Spend Velocity & Analytics
                </li>
                <li className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors cursor-pointer hover:underline font-medium">
                  Finance GST Audit & Payout
                </li>
              </ul>
            </div>

            {/* COL 3: ROLE PORTALS */}
            <div className="lg:col-span-2 space-y-3">
              <h4
                className={`text-xs font-mono font-bold uppercase tracking-wider ${darkMode ? "text-emerald-300" : "text-forest-700"}`}
              >
                Role Portals
              </h4>
              <ul
                className={`space-y-2 text-xs font-medium ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80"}`}
              >
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors hover:underline font-medium"
                  >
                    Employee Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors hover:underline font-medium"
                  >
                    Manager Queue
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors hover:underline font-medium"
                  >
                    Director Clearance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors hover:underline font-medium"
                  >
                    Finance Audit
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 dark:hover:text-emerald-300 transition-colors hover:underline font-medium"
                  >
                    Admin Governance
                  </Link>
                </li>
              </ul>
            </div>

            {/* COL 4: ARCHITECTURE & GITHUB */}
            <div className="lg:col-span-3 space-y-3">
              <h4
                className={`text-xs font-mono font-bold uppercase tracking-wider ${darkMode ? "text-emerald-300" : "text-forest-700"}`}
              >
                Architecture & Code
              </h4>
              <p
                className={`text-xs ${darkMode ? "text-[#B6E3C6]" : "text-forest-900/80"}`}
              >
                Built with React, Vite, Node.js, Express, PostgreSQL, Redis,
                Socket.io & Tailwind CSS.
              </p>
              <div className="pt-2">
                <a
                  href="https://github.com/Aditya2550"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs transition-all shadow-xs active:scale-95"
                >
                  <GithubIcon className="w-4 h-4" />
                  GitHub: Aditya2550
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM COPYRIGHT & LEGAL BAR WITH REFINED HIGHLIGHT COLORS */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium">
            <div
              className={
                darkMode ? "text-emerald-200/90" : "text-forest-900/90"
              }
            >
              © 2026{" "}
              <strong
                className={
                  darkMode
                    ? "text-emerald-300 font-extrabold"
                    : "text-forest-950 font-extrabold"
                }
              >
                FlowClaim
              </strong>
              .{" "}
              <span
                className={
                  darkMode
                    ? "text-emerald-300/80 font-medium"
                    : "text-forest-800/80 font-medium"
                }
              >
                Designed & Developed by{" "}
              </span>
              <strong
                className={
                  darkMode
                    ? "text-emerald-300 font-bold"
                    : "text-forest-900 font-extrabold"
                }
              >
                Aditya Valsangkar
              </strong>
              .
            </div>

            <div className="flex items-center space-x-6 text-xs font-semibold">
              <span
                className={`transition-colors cursor-pointer hover:underline ${
                  darkMode
                    ? "text-emerald-400 hover:text-white"
                    : "text-forest-700 hover:text-forest-950"
                }`}
              >
                Security Protocol
              </span>
              <span
                className={`transition-colors cursor-pointer hover:underline ${
                  darkMode
                    ? "text-emerald-400 hover:text-white"
                    : "text-forest-700 hover:text-forest-950"
                }`}
              >
                Audit Logging
              </span>
              <span
                className={`transition-colors cursor-pointer hover:underline ${
                  darkMode
                    ? "text-emerald-400 hover:text-white"
                    : "text-forest-700 hover:text-forest-950"
                }`}
              >
                Enterprise Compliance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
