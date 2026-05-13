'use client';

import { useState } from 'react';
import { loginAdmin } from '@/lib/actions/auth';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);

    if (res?.error) {
      toast.error(res.error);
    }
    
    setLoading(false);
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
      <p className="text-slate-500 mb-8 text-sm">Enter your credentials and secure school code to access your command center.</p>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">School Code</label>
          <input type="text" name="schoolCode" required className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-bold placeholder:font-normal placeholder:text-slate-400 shadow-sm tracking-widest" placeholder="ABCDEF" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</label>
          <input type="email" name="email" required className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium placeholder:font-normal placeholder:text-slate-400 shadow-sm" placeholder="admin@school.edu" />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Password</label>
            <Link href="#" className="text-xs font-medium text-violet-600 hover:underline">Forgot password?</Link>
          </div>
          <input type="password" name="password" required className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all font-medium placeholder:font-normal placeholder:text-slate-400 shadow-sm" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} className="w-full btn-dark mt-4">
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        Don't have a workspace? <Link href="/signup" className="text-violet-600 font-semibold hover:underline">Register your school</Link>
      </div>
    </div>
  );
}
