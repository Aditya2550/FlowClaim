import React, { useState } from "react";
import { motion } from "framer-motion";

export default function FlipCard({
  front,
  back,
  className = "",
  perspective = 1000,
  stiffness = 350,
  damping = 25,
  height = "h-72",
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`group relative w-full ${height} cursor-pointer select-none ${className}`.trim()}
      style={{ perspective: `${perspective}px` }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped((prev) => !prev)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped((prev) => !prev);
        }
      }}
      aria-label="Flip card for details"
    >
      <motion.div
        className="w-full h-full relative [transform-style:preserve-3d]"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          type: "spring",
          stiffness,
          damping,
          restDelta: 0.01,
        }}
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl p-8 border flex flex-col justify-between [backface-visibility:hidden] [-webkit-backface-visibility:hidden] shadow-md transition-colors duration-200 bg-white border-[#E5DDD2] text-forest-950 shadow-forest-900/5 group-hover:border-forest-500/40">
          {front}
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 w-full h-full rounded-3xl p-8 border flex flex-col justify-between [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl transition-colors duration-200 bg-[#F5F0E8] border-forest-600/30 text-forest-950 shadow-forest-900/10">
          {back}
        </div>
      </motion.div>
    </div>
  );
}
