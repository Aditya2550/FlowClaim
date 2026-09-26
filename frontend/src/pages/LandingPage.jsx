import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ScrollExpand from "../components/ui/ScrollExpand";
import FlipCard from "../components/ui/FlipCard";
import ClosingCtaShader from "../components/ui/ClosingCtaShader";
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
  Menu,
  X,
  RotateCw,
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

  // Active navigation section state & hover state (null when in top Hero section)
  const [activeNavSection, setActiveNavSection] = useState(null);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isManualScrollingRef = React.useRef(false);

  // Interactive demo states
  const [activeRoleTab, setActiveRoleTab] = useState("analytics");
  const [heroViewMode, setHeroViewMode] = useState("laptop"); // "laptop" | "stacked"
  const [activeModalImage, setActiveModalImage] = useState(null);

  // Closing CTA shader background variant ("spotlight" | "lines")
  const [ctaShaderVariant, setCtaShaderVariant] = useState("spotlight");

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
    <div className="min-h-screen font-inter transition-colors duration-300 bg-[#F7F4EF] text-forest-950 selection:bg-forest-600 selection:text-white">
      {/* TOP FLOATING NAV (Refined Glassmorphism Pill Capsule Navbar) */}
      <header className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="h-16 px-6 rounded-full flex items-center justify-between transition-all duration-300 bg-white/85 text-forest-950 border border-white/80 shadow-xl backdrop-blur-xl">
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
            <span className="font-manrope font-extrabold text-lg tracking-tight text-forest-950">
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
                      ? "text-forest-950 font-extrabold"
                      : "text-forest-900/80 hover:text-forest-950 font-semibold"
                  }`}
                >
                  {/* PERSISTENT ACTIVE GREEN OUTLINE PILL */}
                  {isActive && (
                    <motion.div
                      layoutId="navActivePill"
                      className="absolute inset-0 rounded-full transition-all pointer-events-none bg-forest-600/15 border-2 border-forest-600 shadow-xs"
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
                      className="absolute inset-0 rounded-full transition-all pointer-events-none bg-forest-600/10 border border-forest-600/20"
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

          {/* RIGHT ACTIONS: AUTH PILLS & MOBILE MENU BUTTON */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Desktop Log In Button */}
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 py-1.5 rounded-full text-xs font-bold transition-all text-forest-900 hover:text-black hover:bg-forest-900/10"
            >
              Log In
            </Link>

            {/* Signup CTA Button: Compact visible CTA on Mobile SaaS Navbar */}
            <Link
              to="/signup"
              className="px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md shadow-forest-950/20 border border-forest-500/30 inline-flex items-center gap-1 sm:gap-1.5 active:scale-95 transition-all"
            >
              Sign Up
              <ArrowRight className="w-3.5 h-3.5 hidden sm:inline-block" />
            </Link>

            {/* Mobile Burger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full transition-colors text-forest-900 hover:bg-forest-600/10"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 p-5 rounded-3xl border shadow-2xl backdrop-blur-2xl bg-white/95 border-[#E5DDD2] text-forest-950"
            >
              <div className="flex flex-col space-y-3 font-manrope font-semibold text-sm">
                {navLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      scrollToSection(item.id, e);
                    }}
                    className="px-4 py-2.5 rounded-2xl transition-colors hover:bg-forest-600/10 text-forest-900"
                  >
                    {item.label}
                  </a>
                ))}

                <div className="pt-3 border-t border-forest-900/10 flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-full font-bold text-xs border border-forest-600/30 text-forest-900 hover:bg-forest-600/10"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    Sign Up
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION WITH CINEMATIC PORTRAIT BLUR BACKGROUND & ORGANIC ROUNDED FRAME */}
      <section className="pt-6 pb-16 md:pt-8 md:pb-24">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* ROUNDED HERO CANVAS FRAME */}
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[40px] border shadow-2xl transition-all duration-300 p-6 sm:p-10 lg:p-14 bg-[#FAF7F2] border-[#E5DDD2] shadow-forest-900/10">
            {/* REAL-WORLD PORTRAIT BLUR BACKGROUND IMAGE WITH ADAPTIVE GRADIENT MASK */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
              <img
                src="/assets/landing/hero-cinematic-bg.png"
                alt="Executive Office Desk Bokeh Ambience"
                className="w-full h-full object-cover object-right-bottom filter scale-105 opacity-65 transition-opacity duration-500"
              />
              {/* GRADIENT BACKDROP MASK FOR GUARANTEED 100% TEXT LEGIBILITY */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/75 to-transparent" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* LEFT COLUMN (~55% width: lg:col-span-7) */}
              <div className="lg:col-span-7 text-left space-y-6">
                {/* BOLD LEFT-ALIGNED HEADLINE WITH LETTER-BY-LETTER ANIMATION */}
                <h1 className="font-manrope text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-forest-950">
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
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl text-forest-900/90 font-medium">
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
                    className="px-7 py-4 rounded-full font-bold text-sm border backdrop-blur-md active:scale-95 transition-all flex items-center justify-center gap-2 bg-white/80 border-[#E2DAD0] text-forest-950 hover:bg-white shadow-xs"
                  >
                    <span>Take Product Tour</span>
                    <ChevronRight className="w-4 h-4 text-forest-700" />
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN (~45% width: lg:col-span-5): CLEAN SLEEK FLOATING FINTECH CALLOUT CARD ONLY */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex items-center justify-center min-h-[220px]">
                <div className="p-5 sm:p-6 rounded-3xl border shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105 flex items-center gap-4 bg-white/95 border-emerald-200/90 text-forest-950 shadow-forest-900/15 ring-1 ring-emerald-500/10">
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
                      <span className="font-bold text-forest-700 text-sm tracking-tight">
                        $1,240.00
                      </span>
                      <span className="text-surface-400">•</span>
                      <span className="text-forest-800/90">
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
        className="relative w-full border-t transition-colors bg-[#F7F4EF] border-[#E2DAD0]"
      >
        <ScrollExpand
          src="/assets/landing/ocr-workflow-demo.mp4"
          mediaType="video"
          poster="/assets/screenshots/ocr-scan-detail.png"
          alt="FlowClaim AI Receipt OCR Scanning & Reimbursement Workflow"
          title="See OCR Workflow in Action"
          scrollHint="Scroll to watch workflow"
          startWidth={48}
          startHeight={62}
          startRadius={24}
          endRadius={0}
          mediaZoom={1.0}
          scrollDistance={2.5}
          holdDistance={0.4}
          smoothing={0.1}
          overlayScrim={0.35}
          useWindowScroll={true}
          enabled={true}
        >
          <div className="space-y-4 max-w-2xl mx-auto text-center px-6 py-8 rounded-3xl backdrop-blur-xl border shadow-2xl transition-colors bg-white/90 border-[#E2DAD0] text-forest-950 shadow-forest-900/10">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block shadow-xs border bg-forest-600/10 text-forest-700 border-forest-600/20">
              AI Vision Receipt OCR
            </span>
            <h2 className="font-manrope text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
              From receipt to reimbursed in seconds
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-forest-900/85 font-medium">
              Automated receipt scanning, intelligent approval routing, and
              instant payout dispatch.
            </p>
          </div>
        </ScrollExpand>
      </section>

      {/* DEDICATED PRODUCT SHOWCASE SECTION DIRECTLY BELOW HERO */}
      <section
        id="hero-showcase"
        className="py-16 border-t bg-[#F7F4EF] border-[#E2DAD0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 border border-forest-600/20 inline-block mb-3 shadow-xs">
              Live Interactive Workspace
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-forest-950">
              Explore the FlowClaim Interface
            </h2>
            <p className="mt-2 text-sm text-forest-900/80 font-medium">
              Switch between laptop and stacked layer views to preview AI Vision
              OCR scanning and manager verification in real time.
            </p>
          </div>

          {/* VIEW MODE TOGGLE CAPSULE */}
          <div className="flex justify-center mb-8">
            <div className="p-1.5 rounded-full border inline-flex items-center gap-1.5 shadow-sm bg-[#EAE4DA] border-[#DCD3C5]">
              <button
                onClick={() => setHeroViewMode("stacked")}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  heroViewMode === "stacked"
                    ? "bg-forest-700 text-white shadow-sm"
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
                    : "text-forest-950 hover:text-black font-semibold"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Laptop Dashboard
              </button>
            </div>
          </div>

          {/* SHOWCASE DISPLAY CONTAINER */}
          <div className="max-w-5xl mx-auto p-6 sm:p-10 rounded-3xl border shadow-xl bg-white border-[#E2DAD0]">
            {heroViewMode === "stacked" ? (
              <div className="relative min-h-[420px] sm:min-h-[460px] flex items-center justify-center p-4">
                {/* BACK LAYER: OCR RECEIPT SCANNER */}
                <div
                  onClick={() =>
                    setActiveModalImage(
                      "/assets/screenshots/ocr-receipt-scanner.png",
                    )
                  }
                  className="absolute left-4 sm:left-12 top-4 w-[85%] sm:w-[420px] rounded-2xl p-2.5 border cursor-pointer transition-all duration-500 transform -rotate-3 hover:rotate-0 hover:z-30 hover:scale-105 shadow-xl bg-white border-[#E2DAD0] shadow-forest-900/10"
                  style={{ zIndex: 10 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] flex justify-between items-center text-xs font-semibold tracking-wide">
                    <span className="font-bold text-forest-700">
                      LAYER 01: AI Vision Receipt OCR
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E8F4EC] text-[#0F5A33] font-bold">
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
                  className="absolute right-4 sm:right-12 top-16 sm:top-20 w-[88%] sm:w-[450px] rounded-2xl p-2.5 border cursor-pointer transition-all duration-500 transform rotate-2 hover:rotate-0 hover:z-30 hover:scale-105 shadow-2xl bg-white border-[#E2DAD0] shadow-forest-900/15"
                  style={{ zIndex: 20 }}
                >
                  <div className="p-2 border-b border-[#EFEBE4] flex justify-between items-center text-xs font-semibold tracking-wide">
                    <span className="font-bold text-forest-700">
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
        className="py-20 border-t transition-colors bg-white border-[#E2DAD0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 border border-forest-600/20 inline-block mb-3 shadow-xs">
              Platform Features
            </span>
            <h2 className="font-manrope text-3xl sm:text-5xl font-extrabold tracking-tight text-forest-950">
              Engineered for absolute reimbursement clarity
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* FEATURE 1: AI VISION OCR EXTRACTION FLIP CARD */}
            <FlipCard
              height="h-[430px]"
              front={
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 p-2 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden bg-white border-[#C2E2CE] text-[#0F5A33]">
                        <img
                          src="/assets/landing/feature-ocr-extract.png"
                          alt="AI OCR Extract Icon"
                          className="w-full h-full object-contain filter drop-shadow-sm scale-125"
                        />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 border border-forest-600/30">
                        Automated OCR
                      </span>
                    </div>
                    <h3 className="font-manrope text-2xl font-extrabold mb-2.5 text-forest-950">
                      Intelligent Receipt Scanning
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal text-forest-900/85">
                      Parses uploaded receipts and PDFs into structured fields including vendor, amount, GST split, and invoice date.
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="relative rounded-xl overflow-hidden border border-[#E2DAD0] shadow-sm mb-3">
                      <img
                        src="/assets/screenshots/ocr-receipt-scanner.png"
                        alt="OCR Scanner Preview"
                        className="w-full h-28 object-cover object-top"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-forest-700">
                      <span>Hover or tap to inspect card</span>
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                  </div>
                </div>
              }
              back={
                <div className="h-full flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                        AI Vision Insights
                      </span>
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="font-manrope text-xl font-extrabold text-forest-950">
                      Under 2-Second Extraction
                    </h4>
                    <p className="text-xs leading-relaxed text-forest-900/90">
                      Zero manual data entry. Uploaded receipts auto-populate title, total amount, live currency conversions, and GST tax codes.
                    </p>
                    <ul className="space-y-2 pt-1 text-xs font-medium">
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Live INR / USD / EUR FX Rates
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Multi-Format PDF & Image Support
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Automated Draft Prefill
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalImage("/assets/screenshots/ocr-receipt-scanner.png");
                    }}
                    className="w-full py-2.5 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all mt-4"
                  >
                    Expand Full Screenshot
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            />

            {/* FEATURE 2: ENTERPRISE ACCESS CONTROLS FLIP CARD */}
            <FlipCard
              height="h-[430px]"
              front={
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 p-2.5 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden bg-white border-[#C2E2CE] text-[#0F5A33]">
                        <img
                          src="/assets/landing/feature-rbac-governance.png"
                          alt="RBAC Governance Seal"
                          className="w-full h-full object-contain filter drop-shadow-sm scale-125"
                        />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 border border-forest-600/30">
                        Role Security
                      </span>
                    </div>
                    <h3 className="font-manrope text-2xl font-extrabold mb-2.5 text-forest-950">
                      Enterprise Access Controls
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal text-forest-900/85">
                      Strict scope isolation and granular permission matrices across 5 dedicated corporate roles.
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="relative rounded-xl overflow-hidden border border-[#E2DAD0] shadow-sm mb-3">
                      <img
                        src="/assets/screenshots/admin-approval-rules.png"
                        alt="Admin Approval Rules Preview"
                        className="w-full h-28 object-cover object-top"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-forest-700">
                      <span>Hover or tap to inspect card</span>
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                  </div>
                </div>
              }
              back={
                <div className="h-full flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                        Governance Matrix
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="font-manrope text-xl font-extrabold text-forest-950">
                      5-Tier Role Isolation
                    </h4>
                    <p className="text-xs leading-relaxed text-forest-900/90">
                      Dedicated portals for Employee, Manager, Director, Finance, and Admin with threshold routing logic.
                    </p>
                    <ul className="space-y-2 pt-1 text-xs font-medium">
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Threshold-Based Approval Chains
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Finance GST Audit & Payout Workflow
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Full Immutable Audit Trail
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalImage("/assets/screenshots/admin-approval-rules.png");
                    }}
                    className="w-full py-2.5 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all mt-4"
                  >
                    Expand Full Screenshot
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            />

            {/* FEATURE 3: REAL-TIME STATUS SYNC FLIP CARD */}
            <FlipCard
              height="h-[430px]"
              front={
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 p-2 rounded-2xl flex items-center justify-center shadow-md border transition-transform duration-300 group-hover:scale-105 overflow-hidden bg-white border-[#C2E2CE] text-[#0F5A33]">
                        <img
                          src="/assets/landing/feature-socket-push.png"
                          alt="Socket Push Diagram"
                          className="w-full h-full object-contain filter drop-shadow-sm scale-125"
                        />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-600/15 text-forest-700 border border-forest-600/30">
                        Instant Alerts
                      </span>
                    </div>
                    <h3 className="font-manrope text-2xl font-extrabold mb-2.5 text-forest-950">
                      Real-Time Status Sync
                    </h3>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal text-forest-900/85">
                      Zero polling overhead. Approvers receive live push notifications the moment a claim is filed.
                    </p>
                  </div>
                  <div className="pt-3">
                    <div className="relative rounded-xl overflow-hidden border border-[#E2DAD0] shadow-sm mb-3">
                      <img
                        src="/assets/screenshots/manager-approval-queue.png"
                        alt="Manager Queue Preview"
                        className="w-full h-28 object-cover object-top"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-forest-700">
                      <span>Hover or tap to inspect card</span>
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    </div>
                  </div>
                </div>
              }
              back={
                <div className="h-full flex flex-col justify-between text-left">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                        Socket.io Push Engine
                      </span>
                      <Radio className="w-4 h-4 text-emerald-500" />
                    </div>
                    <h4 className="font-manrope text-xl font-extrabold text-forest-950">
                      Instant Queue Refresh
                    </h4>
                    <p className="text-xs leading-relaxed text-forest-900/90">
                      Approvers and employees receive instant real-time status updates without refreshing their page.
                    </p>
                    <ul className="space-y-2 pt-1 text-xs font-medium">
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Live Notification Badge Indicator
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Interactive Toast Notification Stack
                      </li>
                      <li className="flex items-center gap-2 text-forest-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        Zero Page Reload Latency
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalImage("/assets/screenshots/manager-approval-queue.png");
                    }}
                    className="w-full py-2.5 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all mt-4"
                  >
                    Expand Full Screenshot
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ROLE OS WORKSPACE SWITCHER WITH PILL SEGMENT TABS */}
      <section
        id="roles"
        className="py-20 border-t bg-[#F7F4EF] border-[#E2DAD0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="font-manrope text-3xl font-extrabold text-forest-950">
              Explore Role Workspaces
            </h2>
          </div>

          {/* REFINED ROLE SWITCHER PILL CONTAINER */}
          <div className="flex justify-center mb-10">
            <div className="p-1.5 rounded-full border flex flex-wrap items-center justify-center gap-1.5 bg-[#EAE4DA] border-[#DCD3C5]">
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
                      : "text-forest-900 hover:text-black font-semibold"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE ROLE SCREENSHOT DISPLAY */}
          <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-2xl border bg-white border-[#E2DAD0] shadow-md">
            <div className="text-xs text-forest-700 font-bold uppercase tracking-wider mb-1.5">
              Active Workspace: {activeRoleTab.toUpperCase()}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5">
                <h3 className="font-manrope text-2xl font-bold mb-3 text-forest-950">
                  {activeRoleTab === "employee" &&
                    "Employee Receipt Upload & Claim Verification"}
                  {activeRoleTab === "manager" &&
                    "Manager Queue & Side-by-Side Verification"}
                  {activeRoleTab === "analytics" &&
                    "Spend Velocity & Turnaround Visual Analytics"}
                  {activeRoleTab === "admin" &&
                    "System Permission Rules & Threshold Setup"}
                </h3>
                <p className="text-sm leading-relaxed mb-4 text-forest-900/85">
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
                  className="relative rounded-xl overflow-hidden border border-[#E2DAD0] group cursor-pointer shadow-lg"
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
                  <div className="absolute inset-0 bg-forest-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold tracking-wider uppercase">
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
        className="py-20 border-t bg-white border-[#E2DAD0]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-forest-600/10 text-forest-700 border border-forest-600/20 inline-block mb-3">
              Automated Process
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-forest-950">
              Three Simple Steps to Reimbursement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* STEP 1 */}
            <div className="p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md">
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-forest-700 text-white shadow-xs">
                    Step 01
                  </span>
                  <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                    AI OCR Scan
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div className="my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors bg-white border-[#E2DAD0] shadow-xs">
                  <img
                    src="/assets/landing/hero-ocr-visual.png"
                    alt="Snap & OCR Scan"
                    className="h-32 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3 className="font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 text-forest-950">
                  Snap & OCR Scan
                </h3>
                <p className="text-sm leading-relaxed text-forest-900/85">
                  Drop receipt photo or PDF. Gemini vision auto-extracts
                  merchant, date, total amount, and GST split in under 2
                  seconds.
                </p>
              </div>
            </div>

            {/* STEP 2 */}
            <div className="p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md">
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-forest-700 text-white shadow-xs">
                    Step 02
                  </span>
                  <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                    Smart Routing
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div className="my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors bg-white border-[#E2DAD0] shadow-xs">
                  <img
                    src="/assets/landing/workflow-step2-approval.png"
                    alt="Smart Approval Routing"
                    className="h-36 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3 className="font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 text-forest-950">
                  Smart Approval Routing
                </h3>
                <p className="text-sm leading-relaxed text-forest-900/85">
                  Claim routes automatically to direct manager or director based
                  on configured organizational threshold rules.
                </p>
              </div>
            </div>

            {/* STEP 3 */}
            <div className="p-6 sm:p-7 rounded-2xl border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 group bg-[#FAF8F5] border-[#E2DAD0] shadow-sm hover:shadow-md">
              <div>
                {/* STEP CARD HEADER */}
                <div className="flex items-center justify-between">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-forest-700 text-white shadow-xs">
                    Step 03
                  </span>
                  <span className="text-[11px] font-bold text-forest-700 uppercase tracking-wider">
                    Direct Payout
                  </span>
                </div>

                {/* GRAPHIC CONTAINER */}
                <div className="my-5 h-44 sm:h-48 w-full rounded-2xl border flex items-center justify-center p-4 overflow-hidden relative transition-colors bg-white border-[#E2DAD0] shadow-xs">
                  <img
                    src="/assets/landing/workflow-step3-payout.png"
                    alt="Finance Audit & Payout"
                    className="h-32 w-auto object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* CONTENT */}
                <h3 className="font-manrope text-xl sm:text-2xl font-extrabold mb-2.5 text-forest-950">
                  Finance Audit & Payout
                </h3>
                <p className="text-sm leading-relaxed text-forest-900/85">
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
      <section className="py-16 border-t bg-[#F3EEE6] border-[#E2DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl border shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 bg-white border-[#E2DAD0]">
            <div className="space-y-4 max-w-xl text-left z-10">
              <span className="text-xs font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#E8F4EC] text-[#0F5A33] border border-[#C2E2CE] inline-block">
                Instant Employee Satisfaction
              </span>
              <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold tracking-tight text-forest-950">
                Transform corporate reimbursements from hours to seconds
              </h2>
              <p className="text-sm leading-relaxed text-forest-900/85 font-medium">
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
        className="py-20 border-t bg-[#F7F4EF] border-[#E2DAD0]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full bg-[#E8F4EC] text-[#0F5A33] border border-[#C2E2CE] inline-block mb-3">
              Frequently Asked Questions
            </span>
            <h2 className="font-manrope text-3xl sm:text-4xl font-extrabold text-forest-950">
              Everything you need to know about FlowClaim
            </h2>
            <p className="mt-3 text-sm font-medium text-forest-900/80">
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
                  className="rounded-2xl border transition-all overflow-hidden bg-white border-[#E2DAD0] shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-manrope font-bold text-base sm:text-lg focus:outline-none"
                  >
                    <span className="text-forest-950">
                      {faq.q}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-transform duration-300 bg-[#E8F4EC] text-[#0F5A33] border border-[#C2E2CE] ${isOpen ? "rotate-180" : ""}`}
                    >
                      ↓
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm leading-relaxed border-t pt-4 text-forest-900/85 border-[#EFEBE4]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CLOSING CTA SECTION WITH HIGH-ENERGY SPOTLIGHT SHADER */}
      <section
        id="closing-cta"
        className="py-20 sm:py-24 relative overflow-hidden border-t transition-colors bg-[#FAF7F2] border-[#E5DDD2] text-forest-950"
      >
        {/* Spotlight Shader Background (Swappable to 'lines' via prop) */}
        <ClosingCtaShader variant={ctaShaderVariant} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* MAIN CTA CONTENT */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider inline-block border shadow-xs bg-forest-600/10 text-forest-700 border-forest-600/20">
              Get Started Free
            </span>
            <h2 className="font-manrope text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-forest-950">
              Ready to eliminate expense friction?
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto font-inter leading-relaxed text-forest-900/85 font-medium">
              Empower your enterprise with AI receipt OCR, 5-level RBAC security, automated threshold approval routing, and instant payout dispatch.
            </p>
          </div>

          {/* CTA BUTTONS */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-forest-700 hover:bg-forest-800 text-white font-extrabold text-sm shadow-xl shadow-forest-950/20 border border-forest-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-sm border transition-all flex items-center justify-center gap-2 border-forest-900/20 text-forest-900 hover:bg-forest-900/5"
            >
              Log In to Workspace
              <ChevronRight className="w-4 h-4" />
            </Link>
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
              className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-black/80 text-white text-xs font-semibold tracking-wide hover:bg-black border border-white/20"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}

      {/* ENTERPRISE SAAS MULTI-COLUMN FOOTER */}
      <footer className="pt-16 pb-12 border-t transition-colors bg-white border-[#E2DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* MAIN 4-COLUMN FOOTER GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#EFEBE4]">
            {/* COL 1: BRAND & LIVE STATUS */}
            <div className="sm:col-span-2 lg:col-span-4 space-y-4">
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
                <span className="font-manrope text-xl font-extrabold tracking-tight text-forest-950">
                  FlowClaim
                </span>
              </div>

              <p className="text-xs leading-relaxed max-w-sm text-forest-900/80 font-medium">
                Enterprise expense reimbursement platform engineered with AI
                receipt intelligence, 5-tier role access controls, multi-tier
                approval routing, and instant real-time status sync.
              </p>

              {/* LIVE SYSTEM STATUS BADGE */}
              <div className="pt-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider border transition-colors bg-forest-600/10 text-forest-700 border-forest-600/20 shadow-xs">
                  System Operational • v2.0 Production
                </div>
              </div>
            </div>

            {/* COL 2: PLATFORM FEATURES */}
            <div className="sm:col-span-1 lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Platform Core
              </h4>
              <ul className="space-y-2 text-xs font-medium text-forest-900/80">
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  AI Vision OCR Extraction
                </li>
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  5-Level Granular RBAC Matrix
                </li>
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  Configurable Threshold Rules
                </li>
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  Socket.io Real-Time Push
                </li>
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  Spend Velocity & Analytics
                </li>
                <li className="hover:text-forest-600 transition-colors cursor-pointer hover:underline font-medium">
                  Finance GST Audit & Payout
                </li>
              </ul>
            </div>

            {/* COL 3: ROLE PORTALS */}
            <div className="sm:col-span-1 lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Role Portals
              </h4>
              <ul className="space-y-2 text-xs font-medium text-forest-900/80">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 transition-colors hover:underline font-medium"
                  >
                    Employee Portal
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 transition-colors hover:underline font-medium"
                  >
                    Manager Queue
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 transition-colors hover:underline font-medium"
                  >
                    Director Clearance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 transition-colors hover:underline font-medium"
                  >
                    Finance Audit
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-forest-600 transition-colors hover:underline font-medium"
                  >
                    Admin Governance
                  </Link>
                </li>
              </ul>
            </div>

            {/* COL 4: ARCHITECTURE & GITHUB */}
            <div className="sm:col-span-2 lg:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Architecture & Code
              </h4>
              <p className="text-xs text-forest-900/80">
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
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-center md:text-left">
            <div className="text-forest-900/90">
              © 2026{" "}
              <strong className="text-forest-950 font-extrabold">
                FlowClaim
              </strong>
              .{" "}
              <span className="text-forest-800/80 font-medium">
                Designed & Developed by{" "}
              </span>
              <strong className="text-forest-900 font-extrabold">
                Aditya Valsangkar
              </strong>
              .
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 text-xs font-semibold">
              <span className="transition-colors cursor-pointer hover:underline text-forest-700 hover:text-forest-950">
                Security Protocol
              </span>
              <span className="transition-colors cursor-pointer hover:underline text-forest-700 hover:text-forest-950">
                Audit Logging
              </span>
              <span className="transition-colors cursor-pointer hover:underline text-forest-700 hover:text-forest-950">
                Enterprise Compliance
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
