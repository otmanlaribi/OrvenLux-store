"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  ClipboardList,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Audit Log",
    href: "/admin/audit-logs",
    icon: ClipboardList,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      dir="ltr"
      className="
        flex h-screen w-16 shrink-0 flex-col
        border-r border-[#3A3835]
        bg-[#2A2825]
        text-stone-200
        transition-all duration-300
        xl:w-64
      "
    >
      {/* Logo */}
      <div
        className="
          relative flex h-[64px] shrink-0
          items-center justify-center
          border-b border-[#3A3835]
          xl:justify-start xl:px-6
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute bottom-0 left-0
            h-0.5 w-full
            bg-[#D4AF37]
          "
        />

        <Link
          href="/admin"
          aria-label="ORVEN LUX Dashboard"
          className="
            rounded-lg
            outline-none
            transition-transform duration-200
            hover:scale-[1.02]
            focus-visible:ring-2
            focus-visible:ring-[#D4AF37]
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#2A2825]
          "
        >
          <span className="font-serif text-xl font-bold tracking-[0.18em] text-[#D4AF37]">
            <span className="xl:hidden">OL</span>
            <span className="hidden xl:inline">ORVENLUX</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Admin navigation"
        className="
          flex flex-1 flex-col
          gap-2
          overflow-y-auto
          px-2 py-6
          xl:px-4
        "
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;

          return (
            <Tooltip key={item.name}>
              <TooltipTrigger>
                <Link
                  href={item.href}
                  aria-current={
                    isActive ? "page" : undefined
                  }
                  className={`
                    group relative
                    flex w-full items-center
                    gap-3
                    rounded-xl
                    border
                    px-3 py-3
                    outline-none
                    transition-all duration-200

                    ${
                      isActive
                        ? `
                          border-[#D4AF37]/20
                          bg-[#3A3835]
                          text-white
                          shadow-sm
                        `
                        : `
                          border-transparent
                          text-stone-400
                          hover:border-[#3A3835]
                          hover:bg-[#32302D]
                          hover:text-stone-100
                        `
                    }

                    focus-visible:ring-2
                    focus-visible:ring-[#D4AF37]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-[#2A2825]

                    xl:px-3
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        left-0
                        top-1/2
                        h-7
                        w-1
                        -translate-y-1/2
                        rounded-r-full
                        bg-[#D4AF37]
                      "
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                      flex h-9 w-9 shrink-0
                      items-center justify-center
                      rounded-lg
                      transition-all duration-200

                      ${
                        isActive
                          ? "bg-[#D4AF37]/15 text-[#D4AF37]"
                          : "text-stone-400 group-hover:bg-[#3A3835] group-hover:text-[#D4AF37]"
                      }
                    `}
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={2}
                    />
                  </span>

                  {/* Label */}
                  <span
                    className={`
                      hidden
                      truncate
                      text-sm
                      font-semibold
                      xl:block

                      ${
                        isActive
                          ? "text-white"
                          : "text-stone-300"
                      }
                    `}
                  >
                    {item.name}
                  </span>
                </Link>
              </TooltipTrigger>

              <TooltipContent
                side="right"
                className="
                  hidden
                  border-[#4A4743]
                  bg-[#111111]
                  px-3 py-2
                  text-xs
                  font-bold
                  text-white
                  shadow-xl
                  xl:block
                "
              >
                {item.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom branding */}
      <div
        className="
          hidden
          border-t border-[#3A3835]
          px-6 py-4
          xl:block
        "
      >
        <p className="text-[10px] font-bold tracking-[0.2em] text-stone-600">
          ORVEN LUX
        </p>

        <p className="mt-1 text-[11px] text-stone-500">
          Admin Dashboard
        </p>
      </div>
    </aside>
  );
}