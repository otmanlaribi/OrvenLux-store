"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center"><h1 className="text-2xl font-bold">Something went wrong</h1><p className="text-slate-600">Please try again. If the problem persists, contact support.</p><button className="rounded-lg bg-black px-4 py-2 text-white" onClick={reset}>Try again</button></main>;
}
