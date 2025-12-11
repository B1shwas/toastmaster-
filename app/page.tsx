import FeaturedSection from "@/components/FeaturedSection";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navbar />
      <Hero />
      <FeaturedSection />
    </div>
  );
}
