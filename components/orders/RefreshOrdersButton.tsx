"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RefreshOrdersButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  function handleRefresh() {
    setIsRefreshing(true);

    router.refresh();

    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  }

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <RefreshCw
        size={18}
        className={isRefreshing ? "animate-spin" : ""}
      />

      {isRefreshing ? "جاري التحديث..." : "تحديث"}
    </button>
  );
}