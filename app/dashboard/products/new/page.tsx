import { redirect } from "next/navigation";

export default function DashboardNewProductPage() {
  redirect("/admin/products/new");
}
