"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-[10px] border-0 bg-[#111] px-[30px] py-[14px] text-lg text-white"
    >
      🖨️ استخدم Ctrl + P للطباعة
    </button>
  );
}
