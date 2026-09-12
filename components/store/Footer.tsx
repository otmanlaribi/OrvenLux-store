import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Watches" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

const socialLinks = [
  {
    href: "https://www.facebook.com/share/1Jzi8L6HNF/",
    label: "ORVEN LUX on Facebook",
    icon: FaFacebookF,
  },
  {
    href: "https://www.instagram.com/orven_lux?igsi=ZDI5Yzdkejd4OXNr",
    label: "ORVEN LUX on Instagram",
    icon: FaInstagram,
  },
  {
    href: "https://wa.me/213781915229",
    label: "Contact ORVEN LUX on WhatsApp",
    icon: FaWhatsapp,
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-[#090909] text-white">
      {/* Ambient gold atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-0 h-[420px] w-[420px] rounded-full bg-[#C8A45D]/[0.07] blur-[140px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-48 bottom-0 h-[380px] w-[380px] rounded-full bg-[#C8A45D]/[0.045] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C8A45D]/30 to-transparent"
      />

      <div className="relative mx-auto max-w-[1500px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        {/* Main footer */}
        <div className="grid gap-14 lg:grid-cols-[1.35fr_0.8fr_1fr_0.9fr] lg:gap-10">
          {/* Brand */}
          <div className="max-w-md">
            <Link
              href="/"
              className="group inline-flex items-center"
              aria-label="ORVEN LUX Home"
            >
              <span className="text-[28px] font-normal tracking-[-0.045em] text-white transition-colors duration-300 sm:text-[32px]">
                ORVEN
                <span className="text-[#C8A45D]"> LUX</span>
              </span>
            </Link>

            <div className="mt-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#C8A45D]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#C8A45D]">
                The Art of Time
              </span>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/45">
              Luxury watches selected with exceptional care, combining
              timeless elegance, refined craftsmanship, and a remarkable
              shopping experience.
            </p>

            <Link
              href="/products"
              className="group mt-8 inline-flex items-center gap-3 border-b border-white/15 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#C8A45D] hover:text-[#C8A45D]"
            >
              <span>Explore Collection</span>

              <ArrowUpRight
                size={14}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Navigation */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C8A45D]/60" />

              <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A45D]">
                Navigation
              </h3>
            </div>

            <nav className="mt-6">
              <ul className="space-y-4">
                {navigationLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-white/45 transition-colors duration-300 hover:text-white"
                    >
                      <span>{link.label}</span>

                      <ArrowUpRight
                        size={12}
                        className="translate-y-0 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C8A45D]/60" />

              <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A45D]">
                Get in Touch
              </h3>
            </div>

            <div className="mt-6 space-y-5">
              {/* Phone */}
              <a
                href="tel:+213781915229"
                className="group flex items-center gap-3 text-sm text-white/45 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#C8A45D] transition-all duration-300 group-hover:border-[#C8A45D]/50 group-hover:bg-[#C8A45D]/10">
                  <Phone size={15} strokeWidth={1.6} />
                </span>

                <span>0781915229</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/213781915229"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-sm text-white/45 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#C8A45D] transition-all duration-300 group-hover:border-[#C8A45D]/50 group-hover:bg-[#C8A45D]/10">
                  <FaWhatsapp size={16} />
                </span>

                <span>WhatsApp</span>
              </a>

              {/* Email */}
              <a
                href="mailto:otmanlaribi25@gmail.com"
                className="group flex items-center gap-3 text-sm text-white/45 transition-colors duration-300 hover:text-white"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#C8A45D] transition-all duration-300 group-hover:border-[#C8A45D]/50 group-hover:bg-[#C8A45D]/10">
                  <Mail size={15} strokeWidth={1.6} />
                </span>

                <span className="break-all">
                  otmanlaribi25@gmail.com
                </span>
              </a>

              {/* Location */}
              <div className="flex items-center gap-3 text-sm text-white/45">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-[#C8A45D]">
                  <MapPin size={15} strokeWidth={1.6} />
                </span>

                <span>Algeria</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C8A45D]/60" />

              <h3 className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#C8A45D]">
                Follow ORVEN
              </h3>
            </div>

            <div className="mt-6 flex gap-2.5">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="group flex h-11 w-11 items-center justify-center border border-white/10 bg-white/[0.03] text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-[#C8A45D]/60 hover:bg-[#C8A45D] hover:text-[#090909]"
                  >
                    <Icon
                      size={16}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  </a>
                );
              })}
            </div>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/35">
              Follow our latest collections, stories, and timepiece
              discoveries.
            </p>

            <div className="mt-8 border-l border-[#C8A45D]/40 pl-4">
              <p className="text-[9px] uppercase leading-5 tracking-[0.2em] text-white/25">
                Precision
                <br />
                Heritage
                <br />
                Confidence
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:mt-20" />

        {/* Bottom */}
        <div className="flex flex-col gap-6 pt-7 text-[10px] uppercase tracking-[0.12em] text-white/25 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} ORVEN LUX. All rights reserved.</p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            {legalLinks.map((link, index) => (
              <div key={link.href} className="flex items-center gap-4 sm:gap-5">
                <Link
                  href={link.href}
                  className="transition-colors duration-300 hover:text-[#C8A45D]"
                >
                  {link.label}
                </Link>

                {index < legalLinks.length - 1 && (
                  <span className="h-3 w-px bg-white/10" />
                )}
              </div>
            ))}

            <span className="h-3 w-px bg-white/10" />

            <span>Algeria</span>
          </div>
        </div>

        {/* Bottom signature */}
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-white/[0.06]" />

          <span className="text-[8px] font-medium uppercase tracking-[0.35em] text-[#C8A45D]/35">
            ORVEN LUX
          </span>

          <span className="h-px flex-1 bg-white/[0.06]" />
        </div>
      </div>
    </footer>
  );
}