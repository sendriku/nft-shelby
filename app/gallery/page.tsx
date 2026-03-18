"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { NFTCard } from "@/components/ui/NFTCard";
import { getUploadedNFTs, deleteUploadedNFT } from "@/lib/storage";
import type { UploadedNFT } from "@/types";
import {
  LayoutGrid,
  Upload,
  ImageIcon,
  Video,
  Music,
  Filter,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FilterType = "all" | "image" | "video" | "audio";

const FILTER_OPTIONS: { value: FilterType; label: string; icon: typeof ImageIcon }[] = [
  { value: "all", label: "All", icon: LayoutGrid },
  { value: "image", label: "Images", icon: ImageIcon },
  { value: "video", label: "Videos", icon: Video },
  { value: "audio", label: "Audio", icon: Music },
];

export default function GalleryPage() {
  const { connected } = useWallet();
  const [nfts, setNfts] = useState<UploadedNFT[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setNfts(getUploadedNFTs());
  }, []);

  function handleDelete(id: string) {
    deleteUploadedNFT(id);
    setNfts((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered =
    filter === "all"
      ? nfts
      : nfts.filter((n) => (n.mimeType ?? "").startsWith(filter));

  return (
    <div className="min-h-screen bg-void bg-grid">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {/* Page header */}
        <div className="pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="absolute -z-10 w-64 h-24 bg-frost/5 blur-3xl rounded-full -mt-4 -ml-4" />
              <h1 className="font-display text-5xl sm:text-6xl tracking-wider text-ash-100">
                MY GALLERY
              </h1>
              <p className="text-ash-200 text-sm mt-2 font-mono">
                {mounted ? nfts.length : "—"} file{nfts.length !== 1 ? "s" : ""} stored on Shelby
              </p>
            </div>

            <Link
              href="/"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-frost text-void font-semibold text-sm hover:shadow-glow-frost transition-all self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              Upload New
            </Link>
          </div>

          <div className="frost-line mt-8" />
        </div>

        {/* Filter bar */}
        {nfts.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            <Filter className="w-3.5 h-3.5 text-ash-300 shrink-0" />
            <div className="flex items-center gap-1.5 flex-wrap">
              {FILTER_OPTIONS.map(({ value, label, icon: Icon }) => {
                const count =
                  value === "all"
                    ? nfts.length
                    : nfts.filter((n) => (n.mimeType ?? "").startsWith(value)).length;
                return (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      filter === value
                        ? "bg-frost/10 text-frost border border-frost/25"
                        : "text-ash-200 border border-ash-400 hover:text-ash-100 hover:border-ash-300"
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-mono",
                        filter === value ? "bg-frost/20" : "bg-carbon"
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content states */}
        {!mounted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden animate-pulse">
                <div className="h-44 bg-slate" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-slate rounded w-3/4" />
                  <div className="h-3 bg-slate rounded w-1/2" />
                  <div className="h-8 bg-slate rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !connected ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-frost/5 border border-frost/10 flex items-center justify-center">
              <Wallet className="w-9 h-9 text-ash-300" />
            </div>
            <div>
              <h3 className="font-display text-2xl tracking-wider text-ash-200">
                WALLET NOT CONNECTED
              </h3>
              <p className="text-ash-300 text-sm mt-2">
                Connect your Aptos wallet to view your gallery
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-frost/10 blur-2xl rounded-full" />
              <div className="relative w-24 h-24 rounded-2xl bg-frost/5 border border-frost/10 flex items-center justify-center">
                <LayoutGrid className="w-10 h-10 text-frost/30" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-2xl tracking-wider text-ash-200">
                {filter !== "all" ? "NO MATCHES" : "GALLERY EMPTY"}
              </h3>
              <p className="text-ash-300 text-sm mt-2">
                {filter !== "all"
                  ? `No ${filter} files found. Try a different filter.`
                  : "Upload your first NFT media to get started."}
              </p>
            </div>
            {filter === "all" && (
              <Link
                href="/"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-frost text-void font-semibold text-sm hover:shadow-glow-frost transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload First File
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((nft) => (
              <NFTCard key={nft.id} nft={nft} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
