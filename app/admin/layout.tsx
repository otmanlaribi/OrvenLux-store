"use client";

import {
  ClipboardList,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Truck,
  Users,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";

type AdminLayoutProps = {
  children: ReactNode;
};

const navigation = [
  {
    label: "Command Center",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingBag,
      },
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
      {
        label: "Shipping",
        href: "/admin/shipping",
        icon: Truck,
      },
      {
        label: "Audit Log",
        href: "/admin/audit-log",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
          "border-r border-white/[0.07] bg-[#0A0A0A]",
          "transition-transform duration-300",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-white/[0.06] px-7">
          <a
            href="/admin"
            className="block"
            onClick={onClose}
            aria-label="ORVEN LUX Dashboard"
          >
            <div className="font-serif text-xl tracking-[0.22em] text-[#F7F5F0]">
              ORVEN
            </div>

            <div className="mt-0.5 text-[8px] font-semibold tracking-[0.42em] text-[#C8A45D]">
              LUX
            </div>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition hover:bg-white/[0.05] hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={17} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-8">
          {navigation.map((section) => (
            <div key={section.label} className="mb-8">
              <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/25">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActivePath(pathname, item.href);

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "group relative flex h-11 items-center gap-3 rounded-xl px-3",
                        "text-sm transition-all duration-200",
                        active
                          ? "bg-white/[0.055] text-[#F7F5F0]"
                          : "text-white/45 hover:bg-white/[0.035] hover:text-white/80",
                      ].join(" ")}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-full bg-[#C8A45D]" />
                      )}

                      <Icon
                        size={17}
                        strokeWidth={active ? 1.8 : 1.5}
                        className={
                          active
                            ? "text-[#C8A45D]"
                            : "text-white/35 group-hover:text-white/60"
                        }
                      />

                      <span className="font-medium">
                        {item.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Administrator */}
        <div className="shrink-0 border-t border-white/[0.06] p-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C8A45D]/10 text-xs font-semibold text-[#C8A45D]">
                O

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111111] bg-emerald-400" />
              </span>

              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white/80">
                  Othman
                </p>

                <p className="mt-0.5 text-[9px] uppercase tracking-[0.12em] text-white/30">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F7F5F0]">
      {/* ONE and ONLY Admin Sidebar */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="min-h-screen lg:pl-[270px]">
        {/* Mobile menu button */}
        <div className="fixed left-4 top-4 z-30 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-[#111111]/95 text-white/60 shadow-xl backdrop-blur-xl transition hover:border-white/15 hover:text-white"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}