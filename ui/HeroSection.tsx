"use client";

import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 text-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-frost/5 rounded-full blur-[80px]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-frost/8 rounded-full blur-[40px]" />
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-frost/20 bg-frost/5 mb-8 animate-fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-frost animate-pulse-slow" />
        <span className="text-xs font-mono text-frost tracking-widest uppercase">
          Built on Aptos · Powered by Shelby Protocol
        </span>
      </div>

      {/* Heading */}
      <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider text-ash-100 leading-none animate-slide-up">
        STORE YOUR
        <br />
        <span className="text-frost">NFT MEDIA</span>
        <br />
        ON-CHAIN
      </h1>

      {/* Subheading */}
      <p className="mt-6 text-ash-200 text-base sm:text-lg max-w-xl mx-auto leading-relaxed animate-fade-in">
        Upload images, videos, and audio to{" "}
        <span className="text-ash-100 font-medium">Shelby</span> — the
        high-performance decentralized blob storage built on Aptos.
        Permanent, verifiable, and blazing fast.
      </p>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-8 animate-fade-in">
        {[
          "Erasure Coded",
          "Cryptographic Proofs",
          "APT Settlement",
          "30-day Storage",
          "100MB per file",
        ].map((feat) => (
          <span
            key={feat}
            className="text-xs px-3 py-1 rounded-full bg-carbon border border-ash-400 text-ash-200 font-mono"
          >
            {feat}
          </span>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="mt-14 flex justify-center animate-float">
        <ArrowDown className="w-5 h-5 text-ash-300" />
      </div>
    </section>
  );
}
