import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/security";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!(await getAdminUser())) redirect("/login");
  return children;
}
