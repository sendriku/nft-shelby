import dynamic from "next/dynamic";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { HeroSection } from "@/components/ui/HeroSection";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { StatsBar } from "@/components/ui/StatsBar";

// UploadPanel uses @shelby-protocol/sdk/browser (browser-only WASM).
// Must be dynamically imported with ssr: false to avoid SSR crash.
const UploadPanel = dynamic(
  () => import("@/components/upload/UploadPanel"),
  {
    ssr: false,
    loading: () => (
      <div className="glass-card rounded-2xl p-6 h-64 animate-pulse">
        <div className="h-6 bg-slate rounded w-1/3 mb-4" />
        <div className="h-px bg-slate mb-6" />
        <div className="h-40 bg-slate rounded-xl" />
      </div>
    ),
  }
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-void bg-grid">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <HeroSection />
        {/* Stats */}
        <StatsBar />
        {/* Upload + Info side by side */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload panel — client-only, no SSR */}
          <div className="lg:sticky lg:top-24">
            <UploadPanel />
          </div>
          {/* How it works */}
          <div>
            <HowItWorks />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
