import { redirect } from "next/navigation";
import Sidebar from "@/components/admin/layout/sidebar";
import Header from "@/components/admin/layout/header";
import { getAdminUser } from "@/lib/security";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[#f5f3f0] dark:bg-stone-900">
      <Sidebar />
      <div className="min-w-0 flex-1"><Header /><main className="mx-auto w-full max-w-[1600px] p-5 lg:p-8">{children}</main></div>
    </div>
  );
}
