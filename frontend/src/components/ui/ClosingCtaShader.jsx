import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function ClosingCtaShader({
  variant = "spotlight", // "spotlight" | "lines"
  className = "",
}) {
  const containerRef = useRef(null);

  // Damped spring mouse values for subtle ambient parallax (max ±30px)
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const parallaxX = useSpring(rawMouseX, { stiffness: 45, damping: 22 });
  const parallaxY = useSpring(rawMouseY, { stiffness: 45, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rawMouseX.set(px * 32);
        rawMouseY.set(py * 24);
      } else {
        rawMouseX.set(0);
        rawMouseY.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rawMouseX, rawMouseY]);

  if (variant === "lines") {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`.trim()}
      >
        {/* Dynamic Multi-Color Diagonal Ribbon Gradient Lines */}
        <div className="absolute -right-12 -bottom-20 w-[650px] sm:w-[850px] h-[500px] sm:h-[650px] origin-bottom-right rotate-[-32deg] flex flex-col justify-center space-y-1.5 opacity-90 sm:opacity-95">
          <motion.div
            className="w-full h-8 sm:h-12 rounded-full shadow-lg"
            style={{
              background: "linear-gradient(90deg, #143E23 0%, #1A4D2E 50%, #10B981 100%)",
            }}
            animate={{ x: [-40, 40, -40] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-full h-10 sm:h-14 rounded-full shadow-xl"
            style={{
              background: "linear-gradient(90deg, #1A4D2E 0%, #10B981 50%, #34D399 100%)",
            }}
            animate={{ x: [30, -30, 30] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-full h-12 sm:h-16 rounded-full shadow-2xl"
            style={{
              background: "linear-gradient(90deg, #10B981 0%, #22C55E 50%, #4ADE80 100%)",
            }}
            animate={{ x: [-50, 50, -50] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-full h-8 sm:h-12 rounded-full shadow-lg"
            style={{
              background: "linear-gradient(90deg, #22C55E 0%, #84CC16 50%, #A3E635 100%)",
            }}
            animate={{ x: [40, -40, 40] }}
            transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="w-full h-7 sm:h-10 rounded-full shadow-md"
            style={{
              background: "linear-gradient(90deg, #EAB308 0%, #F59E0B 50%, #FDE047 100%)",
            }}
            animate={{ x: [-30, 30, -30] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Ambient Warm Gradient Wash */}
        <div className="absolute inset-0 pointer-events-none transition-colors bg-[radial-gradient(ellipse_at_top_left,rgba(26,77,46,0.10),transparent_65%)]" />
      </div>
    );
  }

  // DEFAULT: REFINED OFF-CENTER SPOTLIGHT WITH BREATHING PULSE, NOISE TEXTURE & PARALLAX
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`.trim()}
    >
      {/* Off-Center Directional Overhead Spotlight Beam Cone */}
      <motion.div
        className="absolute -top-36 left-[38%] -translate-x-1/2 w-[750px] sm:w-[1000px] h-[600px] sm:h-[750px] rounded-full blur-3xl transition-colors bg-[radial-gradient(ellipse_at_top,rgba(26,77,46,0.32)_0%,rgba(34,197,94,0.24)_38%,rgba(245,158,11,0.16)_62%,transparent_85%)]"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.85, 0.98, 0.85],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Left Directional Accent Glow */}
      <motion.div
        className="absolute top-1/4 -left-16 w-[480px] h-[480px] rounded-full blur-3xl opacity-80 bg-[radial-gradient(circle,rgba(16,185,129,0.28)_0%,rgba(254,240,138,0.32)_60%,transparent_80%)]"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
        animate={{
          y: [-20, 20, -20],
          x: [-15, 15, -15],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Secondary Right Ambient Accent Glow */}
      <motion.div
        className="absolute top-1/3 -right-16 w-[480px] h-[480px] rounded-full blur-3xl opacity-80 bg-[radial-gradient(circle,rgba(34,197,94,0.28)_0%,transparent_70%)]"
        style={{
          x: parallaxX,
          y: parallaxY,
        }}
        animate={{
          y: [20, -20, 20],
          x: [15, -15, 15],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grain/Noise Texture Overlay - High-end Tactile Grain */}
      <div className="absolute inset-0 opacity-[0.16] mix-blend-overlay pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="ctaNoiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.75"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#ctaNoiseFilter)" />
        </svg>
      </div>

      {/* Section Soft Edge Vignette Overlay */}
      <div className="absolute inset-0 transition-colors bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(247,244,239,0.55)_100%)]" />
    </div>
  );
}
