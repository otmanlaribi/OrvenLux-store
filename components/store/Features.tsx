import {
  ArrowUpRight,
  Headphones,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Authenticity",
    description:
      "Every timepiece is carefully verified to ensure genuine quality and confidence with every purchase.",
    icon: ShieldCheck,
    label: "Verified timepieces",
  },
  {
    number: "02",
    title: "Secure Delivery",
    description:
      "Your watch is carefully prepared and securely delivered across all Algerian states.",
    icon: Truck,
    label: "Delivered with care",
  },
  {
    number: "03",
    title: "Easy Returns",
    description:
      "A simple and transparent return experience designed to make every purchase worry-free.",
    icon: RotateCcw,
    label: "Simple & transparent",
  },
  {
    number: "04",
    title: "Concierge",
    description:
      "Our team is available before and after your purchase to provide a truly personal experience.",
    icon: Headphones,
    label: "Personal assistance",
  },
];

export default function Features() {
  return (
    <section className="relative overflow-hidden bg-[#080808] px-5 py-24 text-white sm:px-8 sm:py-28 lg:px-12 lg:py-36">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-[-120px] h-[520px] w-[520px] rounded-full bg-[#C8A45D]/[0.07] blur-[150px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-[-160px] h-[480px] w-[480px] rounded-full bg-[#C8A45D]/[0.045] blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.012] blur-[120px]"
      />

      <div className="relative mx-auto max-w-[1500px]">
        {/* Section introduction */}
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-[#C8A45D]" />

              <p className="text-[9px] font-semibold uppercase tracking-[0.34em] text-[#C8A45D]">
                The ORVEN LUX Standard
              </p>
            </div>

            <h2 className="mt-6 max-w-4xl text-[42px] font-normal leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl lg:text-[78px]">
              Confidence in
              <br />
              <span className="text-[#C8A45D]">every detail.</span>
            </h2>
          </div>

          <div className="lg:justify-self-end">
            <p className="max-w-lg text-sm leading-7 text-white/45 sm:text-base sm:leading-8">
              From the moment you discover your watch to the moment it arrives
              at your door, every part of the ORVEN LUX experience is designed
              with care.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-px w-8 bg-[#C8A45D]/60" />

              <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-white/30">
                Precision · Trust · Service
              </span>
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-16 grid border-l border-t border-white/[0.09] md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group relative min-h-[390px] overflow-hidden border-b border-r border-white/[0.09] bg-white/[0.012] p-7 transition-all duration-700 hover:bg-white/[0.035] sm:p-8 lg:p-9"
              >
                {/* Large background number */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 top-[-25px] select-none text-[150px] font-normal leading-none tracking-[-0.08em] text-white/[0.025] transition-all duration-700 group-hover:text-[#C8A45D]/[0.07] group-hover:translate-x-2"
                >
                  {feature.number}
                </span>

                {/* Gold hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#C8A45D]/[0.12] opacity-0 blur-[70px] transition-opacity duration-700 group-hover:opacity-100"
                />

                {/* Top row */}
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#C8A45D]/75">
                      {feature.number}
                    </span>

                    <div className="mt-5 h-px w-7 bg-white/15 transition-all duration-500 group-hover:w-12 group-hover:bg-[#C8A45D]/70" />
                  </div>

                  <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden border border-[#C8A45D]/25 bg-[#C8A45D]/[0.035] text-[#C8A45D] transition-all duration-500 group-hover:border-[#C8A45D] group-hover:bg-[#C8A45D] group-hover:text-[#090909]">
                    <Icon
                      size={20}
                      strokeWidth={1.4}
                      className="relative z-10 transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  </div>
                </div>

                {/* Content */}
                <div className="absolute inset-x-7 bottom-8 z-10 sm:inset-x-8 sm:bottom-9 lg:inset-x-9">
                  <p className="mb-3 text-[9px] font-medium uppercase tracking-[0.24em] text-[#C8A45D]/55">
                    {feature.label}
                  </p>

                  <h3 className="text-[30px] font-normal tracking-[-0.04em] text-white transition-colors duration-500 group-hover:text-[#F4E8C8] sm:text-[34px]">
                    {feature.title}
                  </h3>

                  <p className="mt-4 max-w-[290px] text-[13px] leading-6 text-white/38 transition-colors duration-500 group-hover:text-white/55">
                    {feature.description}
                  </p>

                  <div className="mt-7 flex items-center gap-3 text-[#C8A45D]">
                    <span className="h-px w-8 bg-[#C8A45D]/50 transition-all duration-500 group-hover:w-14 group-hover:bg-[#C8A45D]" />

                    <ArrowUpRight
                      size={13}
                      strokeWidth={1.5}
                      className="opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100"
                    />
                  </div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#C8A45D] transition-all duration-700 group-hover:w-full" />

                {/* Corner detail */}
                <div className="absolute bottom-0 right-0 h-12 w-12 border-l border-t border-white/[0.04] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            );
          })}
        </div>

        {/* Closing statement */}
        <div className="mt-16 grid gap-6 border-t border-white/[0.09] pt-7 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="flex items-center gap-4">
            <span className="h-px w-8 bg-[#C8A45D]/50" />

            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/25">
              Designed around your confidence
            </p>
          </div>

          <div className="flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.26em] text-[#C8A45D]/70">
            <span className="hidden h-px w-8 bg-[#C8A45D]/30 sm:block" />

            ORVEN LUX

            <span className="h-px w-8 bg-[#C8A45D]/30" />
          </div>
        </div>
      </div>
    </section>
  );
}