"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  X,
  Heart,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent,
} from "react";

const links = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/products",
    label: "Watches",
  },
  {
    href: "/collections",
    label: "Collections",
  },
  {
    href: "/about",
    label: "About",
  },
  {
    href: "/contact",
    label: "Contact",
  },
];

function isActivePath(
  pathname: string,
  href: string,
) {
  if (href === "/") {
    return pathname === "/";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

type ActionButtonProps = {
  href: string;
  label: string;
  children: ReactNode;
  badge?: string;
};

function ActionButton({
  href,
  label,
  children,
  badge,
}: ActionButtonProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="
        nav-action
        group/action
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        overflow-visible
        rounded-full
        border
        border-white/[0.08]
        bg-white/[0.025]
        text-white/55
        backdrop-blur-xl
        transition-all
        duration-500
        hover:border-[#C9A227]/35
        hover:bg-[#C9A227]/[0.055]
        hover:text-[#C9A227]
        hover:shadow-[0_8px_28px_rgba(0,0,0,0.18)]
      "
    >
      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          rounded-full
          bg-[#C9A227]/0
          transition-all
          duration-500
          group-hover/action:bg-[#C9A227]/[0.045]
        "
      />

      <span
        className="
          relative
          z-10
          transition-all
          duration-500
          group-hover/action:scale-110
          group-hover/action:-translate-y-[1px]
        "
      >
        {children}
      </span>

      <span
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-[1px]
          top-[7px]
          h-[3px]
          w-[3px]
          rounded-full
          bg-[#C9A227]/0
          transition-all
          duration-500
          group-hover/action:bg-[#C9A227]
          group-hover/action:shadow-[0_0_8px_rgba(201,162,39,0.7)]
        "
      />

      {badge && (
        <span
          className="
            absolute
            -right-1.5
            -top-1.5
            z-20
            flex
            h-[17px]
            min-w-[17px]
            items-center
            justify-center
            rounded-full
            border-2
            border-[#090909]
            bg-[#C9A227]
            px-1
            text-[7px]
            font-bold
            leading-none
            text-[#090909]
            shadow-[0_3px_12px_rgba(201,162,39,0.18)]
            transition-transform
            duration-300
            group-hover/action:scale-110
          "
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  const navRef =
    useRef<HTMLElement | null>(null);

  /* =========================================================
     SCROLL STATE
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 24,
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  /* =========================================================
     LOCK PAGE WHILE MOBILE MENU IS OPEN
  ========================================================= */

  useEffect(() => {
    if (!open) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [open]);

  /* =========================================================
     NAV POINTER DEPTH
  ========================================================= */

  const handlePointerMove = (
    event: PointerEvent<HTMLElement>,
  ) => {
    if (
      event.pointerType ===
        "touch" ||
      window.innerWidth < 900
    ) {
      return;
    }

    const nav =
      navRef.current;

    if (!nav) {
      return;
    }

    const rect =
      nav.getBoundingClientRect();

    if (
      !rect.width ||
      !rect.height
    ) {
      return;
    }

    const x =
      ((event.clientX -
        rect.left) /
        rect.width -
        0.5) *
      2;

    const y =
      ((event.clientY -
        rect.top) /
        rect.height -
        0.5) *
      2;

    nav.style.setProperty(
      "--nav-x",
      String(x),
    );

    nav.style.setProperty(
      "--nav-y",
      String(y),
    );

    nav.style.setProperty(
      "--nav-light-x",
      `${((x / 2) + 0.5) * 100}%`,
    );

    nav.style.setProperty(
      "--nav-light-y",
      `${((y / 2) + 0.5) * 100}%`,
    );
  };

  const handlePointerLeave = () => {
    const nav =
      navRef.current;

    if (!nav) {
      return;
    }

    nav.style.setProperty(
      "--nav-x",
      "0",
    );

    nav.style.setProperty(
      "--nav-y",
      "0",
    );

    nav.style.setProperty(
      "--nav-light-x",
      "50%",
    );

    nav.style.setProperty(
      "--nav-light-y",
      "50%",
    );
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE BACKDROP
      ====================================================== */}

      <div
        aria-hidden={!open}
        className={`
          fixed
          inset-0
          z-40
          bg-black/60
          backdrop-blur-[3px]
          transition-all
          duration-500
          lg:hidden
          ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }
        `}
        onClick={closeMenu}
      />

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        ref={navRef}
        onPointerMove={
          handlePointerMove
        }
        onPointerLeave={
          handlePointerLeave
        }
        className="
          sticky
          top-0
          z-50
          w-full
          px-3
          pt-3
          sm:px-5
          lg:px-7
          [--nav-x:0]
          [--nav-y:0]
          [--nav-light-x:50%]
          [--nav-light-y:50%]
        "
      >
        <div
          className={`
            nav-shell
            group/nav
            relative
            mx-auto
            max-w-[1480px]
            overflow-visible
            rounded-[24px]
            border
            ${
              scrolled
                ? "border-white/[0.13] bg-[#090909]/95 shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
                : "border-white/[0.075] bg-[#090909]/78"
            }
            backdrop-blur-2xl
            transition-all
            duration-700
          `}
        >
          {/* =================================================
              NAV SPOTLIGHT
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              rounded-[24px]
              opacity-0
              transition-opacity
              duration-700
              group-hover/nav:opacity-100
            "
            style={{
              background:
                "radial-gradient(circle 220px at var(--nav-light-x) var(--nav-light-y), rgba(201,162,39,0.045), transparent 72%)",
            }}
          />

          {/* =================================================
              TOP GOLD HAIRLINE
          ================================================== */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[8%]
              right-[8%]
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#C9A227]/0
              to-transparent
              transition-all
              duration-700
              group-hover/nav:via-[#C9A227]/45
            "
          />

          {/* =================================================
              INNER GRID
          ================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              z-0
              rounded-[24px]
              opacity-[0.012]
              [background-image:
                linear-gradient(
                  rgba(255,255,255,.8) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(255,255,255,.8) 1px,
                  transparent 1px
                )
              ]
              [background-size:72px_72px]
            "
          />

          {/* =================================================
              MAIN BAR
          ================================================== */}

          <div
            className="
              nav-main
              relative
              z-10
              flex
              h-[66px]
              items-center
              justify-between
              px-4
              sm:h-[70px]
              sm:px-6
              lg:h-[74px]
              lg:px-7
            "
            style={{
              transform:
                "translate3d(calc(var(--nav-x) * 1.2px), calc(var(--nav-y) * 0.8px), 0)",
              transition:
                "transform 900ms cubic-bezier(.16,1,.3,1)",
            }}
          >
            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              href="/"
              aria-label="ORVEN LUX Home"
              onClick={closeMenu}
              className="
                group/logo
                relative
                flex
                items-center
                outline-none
              "
            >
              <span
                className="
                  relative
                  text-[24px]
                  font-normal
                  leading-none
                  tracking-[-0.055em]
                  text-[#F7F5F0]
                  sm:text-[27px]
                "
              >
                ORVEN
                <span
                  className="
                    text-[#C9A227]/90
                    transition-colors
                    duration-500
                    group-hover/logo:text-[#E2C76D]
                  "
                >
                  {" "}
                  LUX
                </span>

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-2
                    left-0
                    h-px
                    w-0
                    bg-gradient-to-r
                    from-[#C9A227]
                    to-transparent
                    transition-all
                    duration-700
                    group-hover/logo:w-full
                  "
                />

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -right-3
                    -top-1
                    h-[3px]
                    w-[3px]
                    rounded-full
                    bg-[#C9A227]/0
                    transition-all
                    duration-500
                    group-hover/logo:bg-[#C9A227]
                    group-hover/logo:shadow-[0_0_8px_rgba(201,162,39,.65)]
                  "
                />
              </span>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <nav
              aria-label="Main navigation"
              className="
                absolute
                left-1/2
                hidden
                -translate-x-1/2
                items-center
                rounded-full
                border
                border-white/[0.055]
                bg-white/[0.018]
                p-1
                shadow-[inset_0_1px_0_rgba(255,255,255,.025)]
                lg:flex
              "
            >
              {links.map(
                (link) => {
                  const active =
                    isActivePath(
                      pathname,
                      link.href,
                    );

                  return (
                    <Link
                      key={
                        link.href
                      }
                      href={
                        link.href
                      }
                      className={`
                        nav-link
                        group/link
                        relative
                        rounded-full
                        px-4
                        py-2.5
                        text-[10px]
                        font-medium
                        tracking-[0.08em]
                        transition-all
                        duration-500
                        xl:px-5
                        ${
                          active
                            ? "text-[#F7F5F0]"
                            : "text-white/40 hover:text-white/85"
                        }
                      `}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-[#C9A227]/20
                            bg-[#C9A227]/[0.055]
                            shadow-[inset_0_1px_0_rgba(255,255,255,.025)]
                          "
                        />
                      )}

                      <span
                        className="
                          relative
                          z-10
                        "
                      >
                        {
                          link.label
                        }
                      </span>

                      <span
                        aria-hidden="true"
                        className={`
                          absolute
                          bottom-[4px]
                          left-1/2
                          h-px
                          -translate-x-1/2
                          bg-[#C9A227]
                          transition-all
                          duration-500
                          ${
                            active
                              ? "w-5 opacity-100"
                              : "w-0 opacity-0 group-hover/link:w-5 group-hover/link:opacity-100"
                          }
                        `}
                      />

                      <ChevronRight
                        size={9}
                        strokeWidth={1.4}
                        className="
                          absolute
                          right-2
                          top-1/2
                          -translate-y-1/2
                          translate-x-2
                          text-[#C9A227]
                          opacity-0
                          transition-all
                          duration-300
                          group-hover/link:translate-x-0
                          group-hover/link:opacity-80
                        "
                      />
                    </Link>
                  );
                },
              )}
            </nav>

            {/* =================================================
                DESKTOP ACTIONS
                CUSTOMER-FACING ONLY
            ================================================== */}

            <div
              className="
                hidden
                items-center
                gap-2
                lg:flex
              "
            >
              <ActionButton
                href="/search"
                label="Search"
              >
                <Search
                  size={16}
                  strokeWidth={1.45}
                />
              </ActionButton>

              <ActionButton
                href="/wishlist"
                label="Wishlist"
              >
                <Heart
                  size={16}
                  strokeWidth={1.45}
                />
              </ActionButton>

              <ActionButton
                href="/cart"
                label="Shopping bag"
                badge="0"
              >
                <ShoppingBag
                  size={16}
                  strokeWidth={1.45}
                />
              </ActionButton>
            </div>

            {/* =================================================
                MOBILE ACTIONS
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-2
                lg:hidden
              "
            >
              <Link
                href="/search"
                aria-label="Search"
                onClick={closeMenu}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/[0.08]
                  bg-white/[0.025]
                  text-white/60
                  transition-all
                  duration-500
                  hover:border-[#C9A227]/35
                  hover:text-[#C9A227]
                "
              >
                <Search
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>

              <button
                type="button"
                onClick={() =>
                  setOpen(
                    (value) =>
                      !value,
                  )
                }
                aria-label={
                  open
                    ? "Close menu"
                    : "Open menu"
                }
                aria-expanded={
                  open
                }
                className={`
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  transition-all
                  duration-500
                  ${
                    open
                      ? "border-[#C9A227]/45 bg-[#C9A227]/[0.06] text-[#C9A227]"
                      : "border-white/[0.08] bg-white/[0.025] text-white/65 hover:border-[#C9A227]/35 hover:text-[#C9A227]"
                  }
                `}
              >
                {open ? (
                  <X
                    size={18}
                    strokeWidth={1.4}
                  />
                ) : (
                  <Menu
                    size={18}
                    strokeWidth={1.4}
                  />
                )}
              </button>
            </div>
          </div>

          {/* =====================================================
              MOBILE MENU PANEL
          ====================================================== */}

          <div
            className={`
              relative
              z-10
              overflow-hidden
              lg:hidden
              transition-all
              duration-700
              ease-[cubic-bezier(.16,1,.3,1)]
              ${
                open
                  ? "max-h-[720px] opacity-100"
                  : "max-h-0 opacity-0"
              }
            `}
          >
            <div
              className="
                border-t
                border-white/[0.07]
                px-4
                pb-5
                pt-3
                sm:px-6
              "
            >
              {/* =================================================
                  MOBILE IDENTITY
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  py-3
                "
              >
                <div className="flex items-center gap-3">
                  <span
                    className="
                      h-[4px]
                      w-[4px]
                      rounded-full
                      bg-[#C9A227]
                      shadow-[0_0_8px_rgba(201,162,39,.5)]
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      uppercase
                      tracking-[0.30em]
                      text-[#C9A227]/65
                    "
                  >
                    ORVEN LUX
                  </span>
                </div>

                <span
                  className="
                    font-mono
                    text-[7px]
                    tracking-[0.22em]
                    text-white/18
                  "
                >
                  COLLECTION 01
                </span>
              </div>

              {/* =================================================
                  MOBILE LINKS
              ================================================== */}

              <nav
                aria-label="Mobile navigation"
                className="
                  flex
                  flex-col
                "
              >
                {links.map(
                  (
                    link,
                    index,
                  ) => {
                    const active =
                      isActivePath(
                        pathname,
                        link.href,
                      );

                    return (
                      <Link
                        key={
                          link.href
                        }
                        href={
                          link.href
                        }
                        onClick={
                          closeMenu
                        }
                        className={`
                          group/mobile
                          relative
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/[0.06]
                          py-4
                          transition-all
                          duration-500
                          ${
                            active
                              ? "text-[#C9A227]"
                              : "text-white/55 hover:text-white"
                          }
                        `}
                      >
                        <span
                          className={`
                            absolute
                            left-[-16px]
                            h-5
                            w-px
                            bg-[#C9A227]
                            transition-opacity
                            duration-300
                            ${
                              active
                                ? "opacity-100"
                                : "opacity-0"
                            }
                          `}
                        />

                        <div className="flex items-center gap-4">
                          <span
                            className="
                              font-mono
                              text-[8px]
                              tracking-[0.20em]
                              text-white/18
                              transition-colors
                              duration-500
                              group-hover/mobile:text-[#C9A227]/50
                            "
                          >
                            {String(
                              index +
                                1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span
                            className="
                              text-sm
                              font-medium
                              tracking-[0.03em]
                            "
                          >
                            {
                              link.label
                            }
                          </span>
                        </div>

                        <ArrowUpRight
                          size={14}
                          strokeWidth={1.3}
                          className="
                            text-white/20
                            transition-all
                            duration-500
                            group-hover/mobile:-translate-y-0.5
                            group-hover/mobile:translate-x-0.5
                            group-hover/mobile:text-[#C9A227]/75
                          "
                        />
                      </Link>
                    );
                  },
                )}
              </nav>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================== */}

              <div
                className="
                  mt-5
                  grid
                  grid-cols-2
                  gap-2
                "
              >
                <Link
                  href="/wishlist"
                  onClick={
                    closeMenu
                  }
                  className="
                    group/mobile-action
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    border
                    border-white/[0.07]
                    bg-white/[0.018]
                    py-4
                    text-[8px]
                    uppercase
                    tracking-[0.13em]
                    text-white/45
                    transition-all
                    duration-500
                    hover:border-[#C9A227]/30
                    hover:bg-[#C9A227]/[0.035]
                    hover:text-[#C9A227]
                  "
                >
                  <Heart
                    size={16}
                    strokeWidth={1.4}
                    className="
                      transition-transform
                      duration-500
                      group-hover/mobile-action:scale-110
                    "
                  />

                  Wishlist
                </Link>

                <Link
                  href="/cart"
                  onClick={
                    closeMenu
                  }
                  className="
                    group/mobile-action
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    border
                    border-white/[0.07]
                    bg-white/[0.018]
                    py-4
                    text-[8px]
                    uppercase
                    tracking-[0.13em]
                    text-white/45
                    transition-all
                    duration-500
                    hover:border-[#C9A227]/30
                    hover:bg-[#C9A227]/[0.035]
                    hover:text-[#C9A227]
                  "
                >
                  <ShoppingBag
                    size={16}
                    strokeWidth={1.4}
                    className="
                      transition-transform
                      duration-500
                      group-hover/mobile-action:scale-110
                    "
                  />

                  Bag

                  <span
                    className="
                      absolute
                      right-3
                      top-2
                      flex
                      h-4
                      min-w-4
                      items-center
                      justify-center
                      rounded-full
                      bg-[#C9A227]
                      px-1
                      text-[6px]
                      font-bold
                      text-[#090909]
                    "
                  >
                    0
                  </span>
                </Link>
              </div>

              {/* =================================================
                  MOBILE SIGNATURE
              ================================================== */}

              <div
                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-3
                  pb-1
                  text-[7px]
                  uppercase
                  tracking-[0.30em]
                  text-white/18
                "
              >
                <span className="h-px w-6 bg-white/[0.08]" />

                Precision

                <span className="text-[#C9A227]/35">
                  ·
                </span>

                Heritage

                <span className="text-[#C9A227]/35">
                  ·
                </span>

                Time

                <span className="h-px w-6 bg-white/[0.08]" />
              </div>
            </div>
          </div>

          {/* ===================================================
              BOTTOM EDGE
          ==================================================== */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              h-px
              w-0
              bg-gradient-to-r
              from-[#C9A227]
              via-[#E2C76D]
              to-transparent
              shadow-[0_0_12px_rgba(201,162,39,.14)]
              transition-all
              duration-[1000ms]
              ease-[cubic-bezier(.16,1,.3,1)]
              group-hover/nav:w-full
            "
          />
        </div>
      </header>

      {/* =====================================================
          LOCAL MOTION
      ====================================================== */}

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 767px) {
          .nav-shell {
            border-radius: 20px;
          }
        }
      `}</style>
    </>
  );
}