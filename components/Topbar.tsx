'use client';
import { useState, useEffect } from 'react';
import { logOut } from '@/lib/actions/auth';

interface TopbarProps {
  title?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  searchPlaceholder?: string;
}

export default function Topbar({ 
  title, 
  actionLabel = "Dispatch Bus", 
  onActionClick, 
  searchPlaceholder = "Search operational data..." 
}: TopbarProps) {
  const [unread] = useState(3);

  return (
    <header className="sticky top-0 z-40 flex h-[64px] w-full max-w-container-max items-center justify-between border-b border-transparent bg-surface/80 px-md py-xs shadow-sm backdrop-blur-md dark:bg-surface-dim/80">
      {/* Left side: Search & Title */}
      <div className="flex flex-1 items-center gap-md">
        {title && <h2 className="font-headline-sm text-on-surface">{title}</h2>}
        <div className="relative flex w-full max-w-md items-center rounded-lg bg-surface-container-low border border-transparent focus-within:border-primary transition-colors dark:bg-surface-container-highest">
          <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant">search</span>
          <input 
            className="w-full rounded-lg bg-transparent py-xs pl-xl pr-sm font-body-base text-body-base text-on-surface outline-none placeholder:text-on-surface-variant focus:ring-0" 
            placeholder={searchPlaceholder} 
            type="text" 
          />
        </div>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center gap-sm">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined">notifications</span>
          {unread > 0 && <span className="absolute top-[8px] right-[8px] h-2 w-2 rounded-full bg-primary animate-pulse"></span>}
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined">contrast</span>
        </button>
        
        <div className="mx-xs h-6 w-[1px] bg-outline-variant"></div>
        
        <button 
          onClick={onActionClick}
          className="ml-sm rounded-lg bg-primary px-sm py-xs font-label-sm font-medium text-on-primary shadow-sm transition-colors hover:bg-on-primary-fixed-variant active:scale-95 duration-150"
        >
          {actionLabel}
        </button>

        {/* User Profile */}
        <div className="ml-sm flex items-center gap-sm">
          <div className="hidden text-right lg:block">
            <div className="font-label-sm font-bold text-on-surface">Admin Administrator</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Chief Controller</div>
          </div>
          <div className="group relative">
            <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest cursor-pointer">
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="h-full w-full object-cover" />
            </div>
            {/* Simple Dropdown for Logout */}
            <div className="absolute right-0 top-full mt-2 hidden w-32 rounded-lg border border-outline-variant bg-white p-1 shadow-lg group-hover:block z-50">
              <button 
                onClick={() => logOut()}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
