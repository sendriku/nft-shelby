import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void bg-grid">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="font-display text-[8rem] leading-none text-frost/10 select-none">
          404
        </h1>
        <h2 className="font-display text-3xl tracking-wider text-ash-200 -mt-4">
          PAGE NOT FOUND
        </h2>
        <p className="text-ash-300 text-sm mt-3 mb-8">
          This blob doesn't exist on the network.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-frost text-void font-semibold text-sm hover:shadow-glow-frost transition-all"
        >
          Back to Upload
        </Link>
      </div>
    </div>
  );
}
