import Link from "next/link";

export default function NotFound() {
  return <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-4 p-6 text-center"><h1 className="text-2xl font-bold">Page not found</h1><Link className="rounded-lg bg-black px-4 py-2 text-white" href="/">Return home</Link></main>;
}
