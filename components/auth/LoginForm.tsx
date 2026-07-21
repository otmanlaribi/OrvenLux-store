"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <input
        type="password"
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
        placeholder="Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in…" : "Login"}
      </button>
    </form>
  );
}
