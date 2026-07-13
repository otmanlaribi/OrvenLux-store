"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Truck,
    Users,
    BarChart3,
    Settings
} from "lucide-react";

const menu = [
    {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        title: "Orders",
        href: "/admin/orders",
        icon: Package,
    },
    {
        title: "Products",
        href: "/admin/products",
        icon: ShoppingBag,
    },
    {
        title: "Customers",
        href: "/admin/customers",
        icon: Users,
    },
    {
        title: "Shipping",
        href: "/admin/shipping",
        icon: Truck,
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
    },
];

export default function Sidebar() {

    const pathname = usePathname();

    return (

        <aside className="w-72 bg-black text-white min-h-screen border-r border-zinc-800">

            <div className="h-20 flex items-center px-8 border-b border-zinc-800">

                <h1 className="text-2xl font-bold tracking-wide">
                    ORVEN LUX
                </h1>

            </div>

            <nav className="p-5 space-y-2">

                {menu.map((item) => {

                    const Icon = item.icon;

                    const active = pathname === item.href;

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
                            ${
                                active
                                    ? "bg-white text-black"
                                    : "hover:bg-zinc-900"
                            }`}
                        >

                            <Icon size={20} />

                            {item.title}

                        </Link>

                    );

                })}

            </nav>

        </aside>

    );

}