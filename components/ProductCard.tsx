import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Product = { id: number; name: string; price: number; image: string; description: string };

export default function ProductCard({ product }: { product: Product }) {
  return <article className="group overflow-hidden rounded-[1.75rem] border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/70"><Link href={`/product/${product.id}`} className="block"><div className="relative aspect-[4/5] overflow-hidden bg-stone-100">{product.image ? <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-sm text-stone-400">Image coming soon</div>}<span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 backdrop-blur">New arrival</span></div><div className="p-5"><div className="flex items-start justify-between gap-4"><div><h3 className="text-lg font-semibold text-stone-950">{product.name}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">{product.description || "A refined ORVEN LUX essential."}</p></div><ArrowUpRight className="mt-1 shrink-0 text-stone-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={20} /></div><div className="mt-5 flex items-center justify-between"><p className="text-base font-bold text-stone-950">{product.price.toLocaleString()} DA</p><span className="text-sm font-semibold text-stone-700">View product</span></div></div></Link></article>;
}
