import Hero from "@/components/store/Hero";
import Categories from "@/components/store/Categories";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import OrvenEditorialCarousel from "@/components/store/OrvenEditorialCarousel";
import Features from "@/components/store/Features";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";
import Navbar from "@/components/store/Navbar";
import { getStoreProducts } from "@/lib/services/store";

export default async function HomePage() {
  const products = await getStoreProducts({
    active: true,
    limit: 8,
  });

  return (
    <main className="bg-[#F7F5F0] text-[#111111]">
      <Navbar />

      <Hero />

      <Categories />

      <FeaturedProducts products={products} />

      <OrvenEditorialCarousel products={products} />

      <Features />

      <Newsletter />

      <Footer />
    </main>
  );
}