'use client';

import { useState } from 'react';
import { signUpAdmin } from '@/lib/actions/auth';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Copy, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';

const inputClassName =
  'w-full h-12 rounded-2xl border border-slate-200 bg-slate-50/50 !px-4 text-sm font-semibold text-slate-950 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),0_1px_2px_rgba(0,0,0,0.05)] outline-none transition-all placeholder:font-medium placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100/50 backdrop-blur-sm';

const labelClassName = 'text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 block ml-1';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as any },
  },
};

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await signUpAdmin(formData);

    if (res?.error) {
      toast.error(res.error);
    } else if (res?.success && res.schoolCode) {
      setSuccessCode(res.schoolCode);
      toast.success('School Workspace created successfully!');
    }

    setLoading(false);
  }

  if (successCode) {
    return (
      <motion.div
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="!mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-[0_16px_40px_rgba(16,185,129,0.16)]">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="!mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 !px-3 !py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">
          <Sparkles className="h-3.5 w-3.5" />
          Provisioned
        </motion.div>
        
        <motion.h2 variants={itemVariants} className="!mb-2 text-3xl font-black tracking-tight text-slate-950">Workspace Ready</motion.h2>
        
        <motion.p variants={itemVariants} className="mx-auto !mb-8 max-w-sm text-sm leading-7 text-slate-500">
          Your school administration panel is provisioned. Save the school code below securely. Your staff will need it to log in.
        </motion.p>

        <motion.button
          variants={itemVariants}
          type="button"
          className="group relative !mb-8 w-full rounded-3xl border border-slate-200 bg-slate-50 !p-7 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-all hover:-translate-y-0.5 hover:border-violet-300 hover:bg-white hover:shadow-[0_18px_40px_rgba(124,58,237,0.12)]"
          onClick={() => { navigator.clipboard.writeText(successCode); toast.success('Copied to clipboard'); }}
        >
          <div className="!mb-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Your School Code</div>
          <div className="text-4xl font-black tracking-[0.2em] text-slate-950 sm:text-5xl">{successCode}</div>
          <div className="absolute right-4 top-4 rounded-full bg-white !p-2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
            <Copy className="h-4 w-4 text-slate-500" />
          </div>
        </motion.button>

        <motion.div variants={itemVariants}>
          <Link
            href="/login"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-violet-600 to-violet-800 text-sm font-bold text-white shadow-[0_16px_34px_rgba(109,40,217,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(109,40,217,0.34),inset_0_1px_0_rgba(255,255,255,0.3)]"
          >
            Continue to Login <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="!mb-7">
        <div className="!mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 !px-3 !py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure onboarding
        </div>
        <h2 className="text-3xl font-black tracking-tight text-slate-950">Setup Workspace</h2>
        <p className="!mt-3 text-sm leading-7 text-slate-500">
          Create a secure multi-tenant environment for school transport operations.
        </p>
      </motion.div>

      <form onSubmit={onSubmit} className="space-y-5">
        <motion.div variants={itemVariants} className="space-y-2">
          <label className={labelClassName}>School Name</label>
          <input type="text" name="schoolName" required className={inputClassName} placeholder="e.g., Delhi Public School" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className={labelClassName}>Admin Full Name</label>
          <input type="text" name="fullName" required className={inputClassName} placeholder="John Doe" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className={labelClassName}>Admin Email</label>
          <input type="email" name="email" required className={inputClassName} placeholder="admin@school.edu" />
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-2">
          <label className={labelClassName}>Password</label>
          <input type="password" name="password" required minLength={6} className={inputClassName} placeholder="Minimum 6 characters" />
        </motion.div>

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={loading}
            className="!mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-b from-violet-600 to-violet-800 text-sm font-bold text-white shadow-[0_16px_34px_rgba(109,40,217,0.28),inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(109,40,217,0.34),inset_0_1px_0_rgba(255,255,255,0.3)] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? 'Provisioning...' : 'Create Workspace'}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>
        </motion.div>
      </form>

      <motion.div variants={itemVariants} className="!mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 !px-4 !py-3 text-xs font-semibold text-slate-500">
        <LockKeyhole className="h-4 w-4 text-violet-500" />
        Your data is secure during workspace creation.
      </motion.div>

      <motion.div variants={itemVariants} className="!mt-7 text-center text-sm text-slate-500">
        Already have a workspace? <Link href="/login" className="font-semibold text-violet-600 hover:underline">Log in</Link>
      </motion.div>
    </motion.div>
  );
}
