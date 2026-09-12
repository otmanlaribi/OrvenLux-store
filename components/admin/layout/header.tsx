'use client';

import React from 'react';
import ThemeToggle from './theme-toggle'; // تم التعديل إلى استيراد افتراضي (Default Import)

export function Header() {
  return (
    <header className="h-[56px] flex items-center justify-between px-6 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-colors shrink-0">
      {/* مسار التنقل (Breadcrumb) */}
      <div className="flex items-center text-sm font-serif text-stone-500 dark:text-stone-400">
        <span className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer">Admin</span>
        <span className="mx-2 text-stone-300 dark:text-stone-700">/</span>
        <span className="text-stone-900 dark:text-stone-100 font-medium">Overview</span>
      </div>

      {/* أدوات التحكم العلوية */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}