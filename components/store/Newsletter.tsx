import { ArrowUpRight, Mail, Sparkles } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
      {/* Ambient light */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[#C8A45D]/10 blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 bottom-[-120px] h-[480px] w-[480px] rounded-full bg-[#C8A45D]/10 blur-[140px]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        <div className="relative overflow-hidden border border-black/[0.08] bg-[#0A0A0A] shadow-[0_35px_100px_rgba(0,0,0,0.18)]">
          {/* Editorial frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 border border-white/[0.055] sm:inset-6 lg:inset-8"
          />

          {/* Decorative circles */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full border border-[#C8A45D]/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-28 -top-28 h-[360px] w-[360px] rounded-full border border-[#C8A45D]/[0.07]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-44 -left-44 h-[520px] w-[520px] rounded-full bg-[#C8A45D]/[0.07] blur-[110px]"
          />

          {/* Top label */}
          <div className="absolute left-7 top-7 hidden items-center gap-3 sm:flex lg:left-10 lg:top-10">
            <span className="h-px w-8 bg-[#C8A45D]/60" />

            <span className="text-[8px] font-medium uppercase tracking-[0.32em] text-white/30">
              ORVEN LUX
            </span>
          </div>

          {/* Corner number */}
          <span
            aria-hidden="true"
            className="absolute right-8 top-7 select-none text-[9px] font-medium tracking-[0.3em] text-white/20 lg:right-10 lg:top-10"
          >
            05
          </span>

          {/* Main content */}
          <div className="relative z-10 mx-auto max-w-4xl px-7 py-16 text-center sm:px-12 sm:py-20 lg:px-20 lg:py-24">
            {/* Icon */}
            <div className="group relative mx-auto flex h-16 w-16 items-center justify-center border border-[#C8A45D]/35 bg-[#C8A45D]/[0.06] text-[#C8A45D] transition-all duration-500 hover:border-[#C8A45D] hover:bg-[#C8A45D] hover:text-[#090909]">
              <Sparkles
                size={20}
                strokeWidth={1.4}
                className="transition-transform duration-500 group-hover:rotate-12"
              />

              <span className="absolute inset-[-6px] border border-[#C8A45D]/10" />
            </div>

            {/* Eyebrow */}
            <div className="mt-8 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#C8A45D]/70" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#C8A45D]">
                The ORVEN Journal
              </p>

              <span className="h-px w-10 bg-[#C8A45D]/70" />
            </div>

            {/* Heading */}
            <h2 className="mt-6 text-[42px] font-normal leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-[76px]">
              Stay close to
              <br />
              <span className="text-[#C8A45D]">the world of time.</span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
              Receive new arrivals, private offers, collector stories, and
              carefully selected timepieces directly from ORVEN LUX.
            </p>

            {/* Newsletter form */}
            <form className="mx-auto mt-10 max-w-2xl">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="group relative flex flex-col gap-2 rounded-2xl border border-white/[0.09] bg-white/[0.035] p-2 backdrop-blur-xl transition-all duration-500 focus-within:border-[#C8A45D]/50 focus-within:bg-white/[0.05] sm:flex-row sm:rounded-full">
                {/* Email field */}
                <div className="relative flex min-h-12 flex-1 items-center">
                  <Mail
                    size={16}
                    strokeWidth={1.5}
                    className="pointer-events-none absolute left-5 text-white/30 transition-colors duration-300 group-focus-within:text-[#C8A45D]/70"
                  />

                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="Enter your email address"
                    required
                    className="h-12 w-full bg-transparent pl-12 pr-5 text-sm text-white outline-none placeholder:text-white/25"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group/button inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#C8A45D] px-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#090909] transition-all duration-300 hover:bg-[#D5B76F] hover:shadow-[0_12px_35px_rgba(200,164,93,0.18)] sm:rounded-full"
                >
                  <span>Subscribe</span>

                  <ArrowUpRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                  />
                </button>
              </div>
            </form>

            {/* Trust note */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[8px] font-medium uppercase tracking-[0.2em] text-white/20">
              <span>No spam</span>

              <span className="h-1 w-1 rounded-full bg-[#C8A45D]/50" />

              <span>Private collector updates</span>

              <span className="h-1 w-1 rounded-full bg-[#C8A45D]/50" />

              <span>Unsubscribe anytime</span>
            </div>
          </div>

          {/* Bottom signature */}
          <div className="absolute bottom-7 left-7 hidden items-center gap-3 sm:flex lg:bottom-10 lg:left-10">
            <span className="text-[8px] uppercase tracking-[0.28em] text-white/20">
              Precision
            </span>

            <span className="h-px w-5 bg-white/10" />

            <span className="text-[8px] uppercase tracking-[0.28em] text-white/20">
              Heritage
            </span>
          </div>

          <div className="absolute bottom-7 right-7 hidden items-center gap-3 sm:flex lg:bottom-10 lg:right-10">
            <span className="text-[8px] uppercase tracking-[0.28em] text-white/20">
              Collectors
            </span>

            <span className="h-px w-5 bg-[#C8A45D]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}