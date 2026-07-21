import LoginForm from "@/components/auth/LoginForm";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/security";

export default async function LoginPage() {
  if (await getAdminUser()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">ORVEN LUX</h1>
          <p className="mt-2 text-sm text-slate-500">Admin access portal</p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
