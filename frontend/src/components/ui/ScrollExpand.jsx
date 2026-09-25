import React, { useCallback, useEffect, useRef } from 'react';
import { Maximize2 } from 'lucide-react';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const smoothstep = (edge0, edge1, x) => {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1e-6), 0, 1);
  return t * t * (3 - 2 * t);
};

export default function ScrollExpand({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = '',
  title = '',
  scrollHint = '',
  startWidth = 42,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  useWindowScroll = true,
  enabled = true,
  children,
  className = '',
  style,
  ...rest
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mediaRef = useRef(null);
  const titleRef = useRef(null);
  const overlayRef = useRef(null);
  const scrimRef = useRef(null);
  const hintRef = useRef(null);

  const propsRef = useRef({});
  propsRef.current = {
    startWidth,
    startHeight,
    startRadius,
    endRadius,
    mediaZoom,
    scrollDistance,
    holdDistance,
    smoothing,
    overlayScrim,
    useWindowScroll,
    enabled
  };

  const applyProgress = useCallback(p => {
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!frame || !media) return;
    const c = propsRef.current;

    const e = smoothstep(0, 1, p);
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const startW = isMobile ? Math.max(c.startWidth, 88) : c.startWidth;
    const startH = isMobile ? Math.max(c.startHeight, 56) : c.startHeight;

    const w = startW + (100 - startW) * e;
    const h = startH + (100 - startH) * e;
    const ix = Math.max(0, (100 - w) / 2);
    const iy = Math.max(0, (100 - h) / 2);
    const r = c.startRadius + (c.endRadius - c.startRadius) * e;
    frame.style.clipPath = `inset(${iy.toFixed(2)}% ${ix.toFixed(2)}% ${iy.toFixed(2)}% ${ix.toFixed(2)}% round ${r}px)`;

    media.style.transform = `scale(${c.mediaZoom + (1 - c.mediaZoom) * e})`;

    if (scrimRef.current) scrimRef.current.style.opacity = `${c.overlayScrim * e}`;

    if (titleRef.current) {
      const out = smoothstep(0.4, 0.88, p);
      titleRef.current.style.opacity = `${1 - out}`;
      titleRef.current.style.transform = `translate3d(0, ${-28 * out}px, 0) scale(${1 + 0.06 * out})`;
    }

    if (hintRef.current) {
      const gone = smoothstep(0, 0.12, p);
      hintRef.current.style.opacity = `${1 - gone}`;
      hintRef.current.style.transform = `translate3d(0, ${8 * gone}px, 0)`;
    }

    if (overlayRef.current) {
      const inn = smoothstep(0.68, 1, p);
      overlayRef.current.style.opacity = `${inn}`;
      overlayRef.current.style.transform = `translate3d(0, ${18 * (1 - inn)}px, 0)`;
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!root || !track || !stage) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let current = 0;
    let target = 0;
    let stageH = 0;
    let running = false;

    const measure = () => {
      const c = propsRef.current;
      stageH = c.useWindowScroll ? window.innerHeight : root.clientHeight;
      if (stageH <= 0) return;
      stage.style.height = `${stageH}px`;
      track.style.height = `${stageH * (1 + Math.max(0, c.scrollDistance) + Math.max(0, c.holdDistance))}px`;

      const w = root.clientWidth || stageH;
      stage.style.setProperty('--se-title-size', `${clamp(w * 0.075, 20, 84)}px`);
    };

    const readProgress = () => {
      const c = propsRef.current;
      if (!c.enabled) return 1;
      const span = stageH * Math.max(0.01, c.scrollDistance);
      if (c.useWindowScroll) {
        const top = track.getBoundingClientRect().top;
        return clamp(-top / span, 0, 1);
      }
      return clamp(root.scrollTop / span, 0, 1);
    };

    const tick = () => {
      const c = propsRef.current;
      const k = c.smoothing <= 0 ? 1 : 1 - Math.exp(-1 / (60 * c.smoothing));
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.0004) {
        current = target;
        running = false;
      }
      applyProgress(current);
      raf = running ? requestAnimationFrame(tick) : 0;
    };

    const kick = () => {
      if (running) return;
      running = true;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = readProgress();
      if (propsRef.current.smoothing <= 0 || reduceMotion) {
        current = target;
        applyProgress(current);
        return;
      }
      kick();
    };

    const onResize = () => {
      measure();
      target = readProgress();
      current = target;
      applyProgress(current);
    };

    measure();
    target = readProgress();
    current = target;
    applyProgress(current);

    const scroller = useWindowScroll ? window : root;
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(root);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
  }, [applyProgress, useWindowScroll]);

  const media =
    mediaType === 'video' ? (
      <video
        ref={mediaRef}
        className="w-full h-full object-cover object-top sm:object-center origin-center select-none [will-change:transform]"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={mediaRef}
        className="w-full h-full object-cover object-top sm:object-center origin-center select-none [will-change:transform]"
        src={src}
        alt={alt}
        draggable={false}
        onError={(e) => {
          if (!e.currentTarget.src.includes('ocr-receipt-scanner.png')) {
            e.currentTarget.src = '/assets/screenshots/ocr-receipt-scanner.png';
          }
        }}
      />
    );

  return (
    <div
      ref={rootRef}
      className={`relative w-full h-full ${useWindowScroll ? '' : 'overflow-y-auto overflow-x-hidden overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden'} ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={trackRef} className="relative w-full">
        <div ref={stageRef} className="sticky top-0 w-full overflow-hidden flex items-center justify-center [--se-title-size:4rem]">
          <div
            ref={frameRef}
            className="absolute inset-0 [will-change:clip-path] shadow-2xl"
          >
            {/* MAC BROWSER WINDOW CHROME HEADER */}
            <div className="absolute top-0 inset-x-0 h-9 sm:h-10 px-3 sm:px-4 z-30 flex items-center justify-between pointer-events-none backdrop-blur-md border-b transition-colors bg-white/95 border-[#E2DAD0] text-forest-900">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FF5F56] inline-block shadow-xs" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FFBD2E] inline-block shadow-xs" />
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27C93F] inline-block shadow-xs" />
              </div>
              <div className="hidden sm:block px-3.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wide border shadow-xs bg-[#F7F4EF] border-[#E2DAD0] text-forest-800">
                flowclaim.app/employee/expenses
              </div>
              <div className="w-6 sm:w-12" />
            </div>

            <div className="absolute inset-0 top-9 sm:top-10 overflow-hidden flex items-center justify-center">
              {media}
            </div>

            <div
              ref={scrimRef}
              className="absolute inset-0 opacity-0 pointer-events-none transition-colors bg-[linear-gradient(to_top,rgba(247,244,239,0.92),rgba(247,244,239,0.35)_45%,rgba(247,244,239,0.55))]"
            />
            {children ? (
              <div
                ref={overlayRef}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-[6%] opacity-0 [will-change:opacity,transform]"
              >
                {children}
              </div>
            ) : null}
          </div>
          {title ? (
            <div
              ref={titleRef}
              className="absolute inset-0 flex items-center justify-center m-0 px-6 text-center pointer-events-none z-20 [will-change:opacity,transform]"
            >
              <div className="px-5 py-2.5 rounded-full backdrop-blur-xl border shadow-xl flex items-center gap-2.5 font-manrope font-extrabold text-sm sm:text-base tracking-tight transition-all duration-300 bg-white/95 border-[#E2DAD0] text-forest-950 shadow-forest-900/10">
                <Maximize2 className="w-4 h-4 text-forest-700 stroke-[2.2]" />
                <span>{title}</span>
              </div>
            </div>
          ) : null}
          {scrollHint ? (
            <div
              ref={hintRef}
              className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none z-20 [will-change:opacity,transform]"
            >
              <div className="px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs font-mono font-bold tracking-wider flex items-center gap-1.5 shadow-sm bg-white/90 border-[#E2DAD0] text-forest-800">
                <span>↓</span>
                <span>{scrollHint}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
