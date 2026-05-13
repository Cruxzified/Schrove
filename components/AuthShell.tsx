'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { usePathname } from 'next/navigation';

type AuthShellProps = {
  children: ReactNode;
};

const particles = [
  'left-[10%] top-[15%] h-1 w-1 opacity-40',
  'left-[25%] top-[70%] h-1.5 w-1.5 opacity-25',
  'left-[35%] top-[25%] h-1 w-1 opacity-35',
  'left-[60%] top-[12%] h-1.5 w-1.5 opacity-20',
  'left-[75%] top-[65%] h-1 w-1 opacity-30',
  'left-[90%] top-[40%] h-1 w-1 opacity-25',
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

const BUS_WIDTH = 180;

function PremiumSchoolBus({ rotationY = 0 }: { rotationY?: number }) {
  return (
    <div className="relative h-20 w-[180px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]">
      <svg className="block h-full w-full overflow-visible" viewBox="0 0 180 84" fill="none">
        <defs>
          <linearGradient id="busBodyMain" x1="10" y1="15" x2="160" y2="75" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD862" />
            <stop offset="0.4" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="busRoofHighlight" x1="20" y1="15" x2="160" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0.4" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="windowGlass" x1="30" y1="25" x2="120" y2="45" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0F172A" />
            <stop offset="1" stopColor="#1E293B" />
          </linearGradient>
          <radialGradient id="headlightBeam" cx="0" cy="0" r="1" gradientTransform="matrix(30 0 0 18 170 52)" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF9C3" stopOpacity="0.8" />
            <stop offset="1" stopColor="#FEF9C3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Headlight Glow */}
        <motion.path 
          d="M165 52C185 53 205 60 215 75C200 80 180 82 165 80L165 52Z" 
          fill="url(#headlightBeam)" 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Main Body with Depth */}
        <path d="M15 35C15 25 25 18 35 17L150 14C162 13.5 172 22 174 34L178 50C180 58 174 65 166 65H25C19 65 15 60 15 54V35Z" fill="url(#busBodyMain)" />
        
        {/* Upper Highlight for 3D feel */}
        <path d="M22 38C22 28 30 22 40 21L150 18C160 17.5 168 23 170 32L174 48H22V38Z" fill="white" opacity="0.15" />
        
        {/* Windows - Premium Tinted */}
        <rect x="32" y="24" width="25" height="18" rx="4" fill="url(#windowGlass)" stroke="white" strokeOpacity="0.1" />
        <rect x="65" y="24" width="25" height="18" rx="4" fill="url(#windowGlass)" stroke="white" strokeOpacity="0.1" />
        <path d="M98 24H145C152 24 158 28 160 35L163 42H98V24Z" fill="url(#windowGlass)" stroke="white" strokeOpacity="0.1" />
        
        {/* Window Reflection */}
        <path d="M35 28L55 32" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 28L88 32" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
        <path d="M101 28L140 32" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />

        {/* Side Detail Lines */}
        <path d="M18 46H176" stroke="#92400E" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M18 52H176" stroke="#92400E" strokeOpacity="0.4" strokeWidth="1" />
        
        {/* Wheels with Rotation Animation */}
        <g className="wheels">
          <circle cx="45" cy="65" r="14" fill="#020617" />
          <circle cx="45" cy="65" r="7" fill="#1E293B" />
          <motion.circle 
            cx="45" cy="65" r="4" fill="#64748B" 
            animate={{ rotate: 360 }} 
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} 
          />
          
          <circle cx="135" cy="65" r="14" fill="#020617" />
          <circle cx="135" cy="65" r="7" fill="#1E293B" />
          <motion.circle 
            cx="135" cy="65" r="4" fill="#64748B" 
            animate={{ rotate: 360 }} 
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }} 
          />
        </g>

        {/* Front Grill/Bumper */}
        <path d="M172 45H179V58H172V45Z" fill="#1E293B" rx="1" />
        <circle cx="175" cy="50" r="2.5" fill="#FEF9C3" />
      </svg>
    </div>
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

  const travelDistance = Math.max(trackWidth - BUS_WIDTH - 40, 0);

  // Advanced Cinematic Animation Sequence
  // 0% - 30%: Acceleration + Travel Right
  // 30%: Smooth deceleration + Impact
  // 30% - 35%: Micro-rebound
  // 35% - 45%: Pivot/Turn (Rotation)
  // 45% - 90%: Travel Left (Slow, steady)
  // 90% - 100%: Reset/Pause
  
  const busX = [0, travelDistance, travelDistance - 8, travelDistance, 0, 0];
  const busRotateY = [0, 0, 0, 180, 180, 0];
  const busTilt = [0.5, -1, 2, 0, -1, 0]; // Subtle body tilt
  const busBounce = [0, -1, 0, -1, 0, 0]; // Suspension micro-bounce
  
  const motionTimes = [0, 0.28, 0.32, 0.42, 0.92, 1];

  const travelTransition = {
    duration: 14,
    repeat: Infinity,
    ease: [0.4, 0, 0.2, 1] as any,
    times: motionTimes,
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[15%] z-10 h-32 lg:bottom-[18%]" aria-hidden="true">
      {/* Telemetry Route Line */}
      <div className="absolute inset-x-[5%] top-1/2 h-1 w-[90%] -translate-y-1/2 overflow-visible">
        {/* Base Track */}
        <div className="absolute inset-0 h-full w-full rounded-full bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
        
        {/* Glowing telemetry lane */}
        <motion.div 
          className="absolute inset-0 h-full rounded-full bg-gradient-to-r from-violet-500/0 via-violet-500/40 to-cyan-400/0"
          animate={{ opacity: [0.2, 0.5, 0.2], x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Refined Lane Markings */}
        <div className="absolute inset-x-0 top-1/2 h-[2px] w-full -translate-y-1/2 border-t border-dashed border-white/10 opacity-40" />
      </div>

      <div ref={trackRef} className="absolute inset-x-[8%] top-1/2 h-20 -translate-y-1/2 overflow-visible">
        <motion.div
          className="absolute top-0 will-change-transform"
          animate={shouldReduceMotion ? { x: travelDistance * 0.5 } : { 
            x: busX,
            y: busBounce,
          }}
          transition={travelTransition}
        >
          <motion.div
            className="origin-center"
            animate={shouldReduceMotion ? undefined : {
              rotate: busTilt,
              rotateY: busRotateY,
            }}
            transition={travelTransition}
            style={{ perspective: 1000 }}
          >
            <PremiumSchoolBus />
            
            {/* Ambient Underglow */}
            <motion.div 
              className="absolute bottom-[-10px] left-[15%] right-[15%] h-4 bg-amber-400/20 blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Impact Reaction at Right Divider */}
      <motion.div 
        className="absolute right-0 top-1/2 h-24 w-1 -translate-y-1/2 rounded-full bg-violet-400/40 blur-sm"
        animate={{ 
          scaleY: [0.8, 1.2, 1],
          opacity: [0, 0.8, 0],
          x: [0, 4, 0]
        }}
        transition={{ 
          duration: 14, 
          repeat: Infinity, 
          times: [0, 0.28, 0.35],
          ease: "easeOut"
        }}
      />
    </div>
  );
}

function SignupHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section 
      className="relative flex min-h-[420px] flex-col overflow-hidden bg-[#010409] !px-6 !py-8 text-white sm:!px-10 lg:min-h-screen lg:w-[52%] lg:!px-12 xl:!px-16"
    >
      {/* Cinematic Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#1e1b4b_0%,transparent_50%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#0f172a_0%,transparent_50%)] opacity-60" />
      
      {/* Grid Texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

      {/* Atmospheric Glows */}
      <div className="absolute inset-x-[5%] top-[10%] h-[600px] w-[600px] rounded-full bg-indigo-500/5 blur-[140px]" />
      <div className="absolute bottom-[-5%] left-[10%] h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]" />

      {particles.map((className, index) => (
        <motion.span
          key={className}
          className={`absolute rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] ${className}`}
          animate={shouldReduceMotion ? undefined : { opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.2, 0.8], y: [0, -20, 0] }}
          transition={shouldReduceMotion ? undefined : { duration: 5 + index * 0.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
          aria-hidden="true"
        />
      ))}

      <div className="relative z-20 flex items-center">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <div className="h-4 w-4 bg-white/20 rounded-sm rotate-45" />
          </div>
          <div className="text-2xl font-black tracking-tighter text-white">Schrove<span className="text-violet-500">.</span></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center !py-12">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="!mb-6 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 !px-4 !py-1.5 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Operational Intelligence</span>
          </div>
          
          <h1 className="text-balance text-6xl font-black leading-[1.05] tracking-tight text-white sm:text-7xl xl:text-8xl">
            Modern Transport
            <span className="block bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-100 bg-clip-text text-transparent opacity-90">Intelligence</span>
          </h1>
          
          <p className="mx-auto !mt-8 max-w-lg text-lg font-medium leading-relaxed text-slate-400/80">
            Provisioning the next generation of multi-tenant school transport infrastructure. Intelligent, automated, and secure.
          </p>

          <div className="!mt-12 flex items-center justify-center gap-8 opacity-40">
            {['Fleet AI', 'Live Telemetry', 'Secure SSN'].map((tech) => (
              <span key={tech} className="text-[10px] font-bold uppercase tracking-[0.25em] text-white whitespace-nowrap">{tech}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatedBus />
    </motion.section>
  );
}

function SignupAuthShell({ children }: AuthShellProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#010409] text-slate-900 lg:flex lg:overflow-hidden">
      <SignupHero />
      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden bg-[#010409] !px-5 !py-10 sm:!px-8 lg:h-screen lg:w-[48%] lg:overflow-y-auto lg:!px-10 xl:!px-14">
        {/* Soft edge spill from hero */}
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-64 bg-gradient-to-r from-violet-600/5 via-transparent to-transparent lg:block" />
        
        {/* Cinematic Ambient Glows */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,#1e1b4b_0%,transparent_60%)] opacity-20" />
        
        <div className="relative z-10 w-full max-w-[480px] transform-gpu">
          {/* Premium Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]"
          >
            {/* Subtle inner highlight */}
            <div className="absolute inset-0 pointer-events-none rounded-[40px] border border-white/20 opacity-50" />
            
            <div className="relative !p-10 sm:!p-12">
              {children}
            </div>
          </motion.div>
          
          {/* Subtle reflection below card */}
          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
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
