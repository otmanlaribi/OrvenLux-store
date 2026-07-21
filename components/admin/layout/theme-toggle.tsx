"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);
  function toggle() { const next = !dark; setDark(next); document.documentElement.classList.toggle("dark", next); localStorage.setItem("orven-admin-theme", next ? "dark" : "light"); }
  return <button type="button" aria-label="Toggle dark mode" onClick={toggle} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 transition hover:bg-stone-100 dark:border-white/10 dark:bg-stone-900 dark:text-stone-200">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>;
}
