'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

type AuthShellProps = {
  children: ReactNode;
};

const particles = [
  'left-[12%] top-[18%] h-1 w-1 opacity-50',
  'left-[24%] top-[74%] h-1.5 w-1.5 opacity-30',
  'left-[36%] top-[28%] h-1 w-1 opacity-40',
  'left-[58%] top-[16%] h-1.5 w-1.5 opacity-25',
  'left-[72%] top-[66%] h-1 w-1 opacity-45',
  'left-[86%] top-[38%] h-1 w-1 opacity-35',
];

function LegacyAuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex text-slate-900">
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-slate-950 p-12 flex-col justify-between items-start">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/30 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[150px]" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
        </div>

        <div className="z-10 relative">
          <div className="text-white text-3xl font-extrabold tracking-tight">Wizor.</div>
        </div>

        <div className="z-10 relative max-w-lg mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Modern Transport<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Intelligence for Schools</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            A premium, multi-tenant command center to effortlessly manage your entire fleet, routes, and student safety from one unified platform.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-[420px]">
          {children}
        </div>
      </div>
    </div>
  );
}

const BUS_WIDTH = 156;

function PremiumSchoolBus() {
  return (
    <svg className="block h-auto w-[156px]" viewBox="0 0 156 74" fill="none" role="img" aria-label="Animated school bus">
      <defs>
        <linearGradient id="busBody" x1="18" y1="12" x2="122" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE48A" />
          <stop offset="0.46" stopColor="#F8B928" />
          <stop offset="1" stopColor="#D88908" />
        </linearGradient>
        <linearGradient id="busSide" x1="22" y1="23" x2="124" y2="59" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD766" />
          <stop offset="1" stopColor="#E79A12" />
        </linearGradient>
        <linearGradient id="busWindow" x1="34" y1="20" x2="96" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1D3148" />
          <stop offset="1" stopColor="#07111E" />
        </linearGradient>
        <radialGradient id="headlightGlow" cx="0" cy="0" r="1" gradientTransform="matrix(21 0 0 13 134 43)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF2A3" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FCD34D" stopOpacity="0" />
        </radialGradient>
        <filter id="busShadow" x="0" y="0" width="156" height="74" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#020617" floodOpacity="0.32" />
        </filter>
      </defs>

      <ellipse cx="79" cy="63" rx="55" ry="7" fill="#F59E0B" opacity="0.22" />
      <path d="M131 39C139.8 39.6 146.2 43.8 149 50.7C143.7 53.6 137.5 54.4 130.7 52.8L131 39Z" fill="url(#headlightGlow)" />
      <g filter="url(#busShadow)">
        <path d="M19 31.6C19 23.8 25.1 17.3 32.9 16.8L108.7 12.4C117.8 11.9 126.2 17.4 129.1 26L134.8 42.6C136.9 48.8 132.3 55.2 125.7 55.2H29.2C23.6 55.2 19 50.6 19 45V31.6Z" fill="url(#busBody)" />
        <path d="M23.5 34C23.5 28.1 28.1 23.1 34 22.6L108.9 17.2C114.8 16.8 120.4 20.1 122.9 25.5L129.8 40.1H23.5V34Z" fill="#FFE39B" opacity="0.36" />
        <path d="M23 37.2H132.8L134 43.7H22.8L23 37.2Z" fill="url(#busSide)" />
        <path d="M32 24.5H52.7C55.1 24.5 57 26.4 57 28.8V36H30.8V25.8C30.8 25.1 31.3 24.5 32 24.5Z" fill="url(#busWindow)" />
        <path d="M63 24.5H82.8C85.2 24.5 87.1 26.4 87.1 28.8V36H63V24.5Z" fill="url(#busWindow)" />
        <path d="M93.2 24.5H107.1C111.9 24.5 116.2 27.2 118.4 31.4L120.8 36H93.2V24.5Z" fill="url(#busWindow)" />
        <path d="M31.5 27.5H117.6" stroke="white" strokeOpacity="0.18" strokeWidth="2" strokeLinecap="round" />
        <path d="M31 44.8H113" stroke="#4A2B07" strokeOpacity="0.36" strokeWidth="3" strokeLinecap="round" />
        <path d="M121.5 43.2H134.8" stroke="#4A2B07" strokeOpacity="0.3" strokeWidth="3" strokeLinecap="round" />
        <rect x="132" y="41.2" width="5.8" height="4.8" rx="2.4" fill="#FFF1A9" />
        <rect x="20.5" y="42.8" width="4.8" height="4.2" rx="2" fill="#F97316" opacity="0.9" />
        <circle cx="44.5" cy="55.2" r="10.8" fill="#08111F" />
        <circle cx="44.5" cy="55.2" r="5.6" fill="#56657A" />
        <circle cx="44.5" cy="55.2" r="2.5" fill="#D7DEE9" />
        <circle cx="113.5" cy="55.2" r="10.8" fill="#08111F" />
        <circle cx="113.5" cy="55.2" r="5.6" fill="#56657A" />
        <circle cx="113.5" cy="55.2" r="2.5" fill="#D7DEE9" />
        <path d="M23.4 31.4C25.3 24.5 30.7 20.2 38.9 19.7L107.8 15.5C115.4 15 121.6 18 125.1 24.2" stroke="white" strokeOpacity="0.32" strokeWidth="1.4" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function AnimatedBus() {
  const shouldReduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const updateTrackWidth = () => setTrackWidth(track.offsetWidth);
    updateTrackWidth();
    const observer = new ResizeObserver(updateTrackWidth);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const travelDistance = Math.max(trackWidth - BUS_WIDTH, 0);

  // Animation Timings (12s total loop)
  // 0% - 25% (0-3s): Drive Right
  // 25% (3s): IMPACT
  // 25% - 28% (3-3.36s): Rebound/Shake
  // 28% - 35% (3.36-4.2s): Turn 180
  // 35% - 85% (4.2-10.2s): Drive Left (Slow)
  // 85% - 92% (10.2-11.04s): Turn 0
  // 92% - 100%: Idle

  const busX = shouldReduceMotion
    ? travelDistance * 0.48
    : [0, travelDistance, travelDistance - 12, travelDistance - 12, 0, 0];
  
  const motionTimes = [0, 0.25, 0.27, 0.35, 0.85, 1];

  const travelTransition = {
    duration: 12,
    repeat: Infinity,
    ease: [0.45, 0, 0.55, 1] as any,
    times: motionTimes,
  };

  const pulseTransition = {
    duration: 12,
    repeat: Infinity,
    ease: 'easeInOut',
    times: [0, 0.23, 0.25, 0.3, 0.85, 0.9, 1],
  } as any;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-[82%] z-0 h-36 -translate-y-1/2 lg:top-[73%]" aria-hidden="true">
      {/* Dynamic Glows */}
      <motion.div
        className="absolute right-[-72px] top-1/2 h-44 w-28 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-2xl"
        animate={shouldReduceMotion ? undefined : { opacity: [0.04, 0.08, 0.6, 0.12, 0.04], scale: [0.9, 0.95, 1.25, 0.98, 0.9] }}
        transition={pulseTransition}
      />
      
      <div ref={trackRef} className="absolute left-[6%] right-0 top-1/2 h-24 -translate-y-1/2">
        <motion.div
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-200/0 via-cyan-200/35 to-amber-200/45 shadow-[0_0_44px_rgba(56,189,248,0.22)]"
          animate={shouldReduceMotion ? undefined : { opacity: [0.42, 0.74, 0.42], scaleX: [0.985, 1, 0.985] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Shadow Trail */}
        <motion.div
          className="absolute top-1/2 h-16 w-36 -translate-y-1/2 rounded-full bg-amber-300/14 blur-2xl"
          animate={shouldReduceMotion ? { x: travelDistance * 0.48 } : { x: busX }}
          transition={travelTransition}
        />

        <motion.div
          className="absolute top-1/2 w-[156px] -translate-y-1/2 will-change-transform"
          animate={shouldReduceMotion ? { x: travelDistance * 0.48 } : { x: busX }}
          transition={travelTransition}
        >
          <motion.div
            className="origin-center will-change-transform [transform-style:preserve-3d]"
            animate={
              shouldReduceMotion
                ? undefined
                : {
                    rotate: [0, -1.2, 3.5, -0.8, 0.5, 0],
                    rotateY: [0, 0, 0, 180, 180, 0],
                    scaleX: [1, 1, 0.92, 1, 1, 1],
                    scaleY: [1, 1, 1.08, 1, 1, 1],
                    x: [0, 0, -6, 0, 0, 0],
                  }
            }
            transition={travelTransition}
            style={{ transformPerspective: 900 }}
          >
            <PremiumSchoolBus />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function SignupHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section 
      className="relative flex min-h-[420px] flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(124,58,237,0.32),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.16),transparent_28%),linear-gradient(145deg,#030712_0%,#09111f_44%,#111141_100%)] !px-6 !py-8 text-white sm:!px-10 lg:min-h-screen lg:w-[52%] lg:!px-12 xl:!px-16"
      animate={shouldReduceMotion ? undefined : {
        x: [0, 0, 4, -3, 2, -1, 0, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        times: [0, 0.245, 0.25, 0.26, 0.27, 0.28, 0.29, 1],
        ease: "easeInOut"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
      <div className="absolute inset-x-[14%] top-[18%] h-72 rounded-full bg-violet-500/20 blur-[110px]" />
      <div className="absolute bottom-[-18%] left-[12%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="absolute right-[-18%] top-[12%] h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />

      {particles.map((className, index) => (
        <motion.span
          key={className}
          className={`absolute rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.55)] ${className}`}
          animate={shouldReduceMotion ? undefined : { opacity: [0.15, 0.65, 0.15], scale: [0.9, 1.25, 0.9] }}
          transition={shouldReduceMotion ? undefined : { duration: 3.8 + index * 0.3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-20 flex items-center justify-between">
        <div className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Schrove.</div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center !py-12 lg:!py-10">
        <motion.div
          className="mx-auto max-w-xl text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as any }}
        >
          <h1 className="text-balance text-4xl font-black leading-[0.96] tracking-tight text-white sm:text-5xl xl:text-6xl">
            Modern Transport
            <span className="block">Intelligence for</span>
            <span className="block bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-300 bg-clip-text text-transparent">Schools</span>
          </h1>
          <p className="mx-auto !mt-6 max-w-[280px] text-sm font-medium leading-relaxed text-slate-400 sm:max-w-md sm:text-base">
            The next generation of fleet management. Secure, automated, and built for the most complex school operations.
          </p>
        </motion.div>
      </div>

      <AnimatedBus />

      {/* Feature Highlights - Moved below bus */}
      <div className="relative z-20 !mb-8 flex flex-wrap justify-center gap-6">
        {[
          { label: 'Real-time GPS', icon: '📡' },
          { label: 'AI Routes', icon: '🤖' },
          { label: 'Secure SSN', icon: '🔒' }
        ].map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 !px-4 !py-2 backdrop-blur-md"
          >
            <span className="text-sm">{feat.icon}</span>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">{feat.label}</span>
          </motion.div>
        ))}
      </div>
      
      {/* Smooth Transition Overlay */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-64 bg-gradient-to-l from-slate-900 via-slate-900/40 to-transparent lg:block" />
    </motion.section>
  );
}

function SignupAuthShell({ children }: AuthShellProps) {
  return (
    <div className="h-screen overflow-y-auto bg-slate-950 text-slate-900 lg:flex lg:overflow-hidden">
      <SignupHero />
      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#0a0f1c] !px-5 !py-10 sm:!px-8 lg:h-screen lg:w-[48%] lg:overflow-y-auto lg:!px-10 xl:!px-14">
        {/* Unified Background Gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_2%_50%,rgba(124,58,237,0.12),transparent_40%),radial-gradient(circle_at_98%_10%,rgba(59,130,246,0.08),transparent_30%)]" />
        
        {/* Mirrored Transition Glow */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-violet-300/30 to-transparent lg:block" />
        <div className="pointer-events-none absolute left-0 inset-y-0 hidden w-48 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent lg:block" />
        
        <div className="pointer-events-none absolute left-[-15%] top-[22%] h-[500px] w-96 rounded-full bg-violet-600/10 blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-[440px] rounded-[32px] border border-white/5 bg-white !p-6 shadow-[0_32px_120px_-20px_rgba(0,0,0,0.5)] sm:!p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AuthShell({ children }: AuthShellProps) {
  const pathname = usePathname();

  if (pathname === '/signup' || pathname?.startsWith('/signup/')) {
    return <SignupAuthShell>{children}</SignupAuthShell>;
  }

  return <LegacyAuthShell>{children}</LegacyAuthShell>;
}
