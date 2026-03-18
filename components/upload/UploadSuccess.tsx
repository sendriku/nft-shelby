"use client";

import { CheckCircle2, ExternalLink, Copy, RotateCcw, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getExplorerTxUrl } from "@/lib/aptos";
import { formatFileSize } from "@/types";
import { toast } from "sonner";
import type { UploadedNFT } from "@/types";

interface UploadSuccessProps {
  nft: UploadedNFT;
  onUploadAnother: () => void;
}

export function UploadSuccess({ nft, onUploadAnother }: UploadSuccessProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  async function copyToClipboard(text: string, type: "url" | "hash") {
    await navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      toast.success("Shelby URL copied");
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedHash(true);
      toast.success("TX hash copied");
      setTimeout(() => setCopiedHash(false), 2000);
    }
  }

  return (
    <div className="animate-slide-up space-y-6">
      {/* Success header */}
      <div className="text-center space-y-3">
        <div className="relative inline-flex">
          <div className="absolute inset-0 rounded-full bg-frost/20 blur-xl animate-pulse-slow" />
          <CheckCircle2 className="relative w-16 h-16 text-frost" />
        </div>
        <div>
          <h3 className="font-display text-3xl text-frost tracking-wider">
            STORED ON SHELBY
          </h3>
          <p className="text-ash-200 text-sm mt-1">
            Your NFT media is now decentralized
          </p>
        </div>
      </div>

      {/* File info */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-ash-200 font-mono">
            File
          </span>
          <span className="text-sm text-ash-100 font-medium truncate ml-4 max-w-[200px]">
            {nft.fileName}
          </span>
        </div>
        <div className="frost-line" />
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-ash-200 font-mono">
            Size
          </span>
          <span className="text-sm font-mono text-ash-100">
            {formatFileSize(nft.fileSize)}
          </span>
        </div>
        <div className="frost-line" />
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-ash-200 font-mono">
            Expires
          </span>
          <span className="text-sm font-mono text-ash-100">
            {nft.expiresAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Shelby URL */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-ash-200 font-mono">
          Shelby Storage URL
        </p>
        <div className="flex items-center gap-2 p-3 bg-carbon rounded-lg border border-[rgba(77,240,255,0.1)]">
          <code className="text-xs text-frost flex-1 truncate">
            {nft.shelbyUrl}
          </code>
          <button
            onClick={() => copyToClipboard(nft.shelbyUrl, "url")}
            className="shrink-0 p-1.5 rounded hover:bg-[rgba(77,240,255,0.1)] transition-colors"
          >
            {copiedUrl ? (
              <Check className="w-3.5 h-3.5 text-frost" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-ash-200" />
            )}
          </button>
        </div>
      </div>

      {/* TX Hash */}
      {nft.txHash && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-ash-200 font-mono">
            Aptos Transaction
          </p>
          <div className="flex items-center gap-2 p-3 bg-carbon rounded-lg border border-[rgba(77,240,255,0.1)]">
            <code className="text-xs text-ash-200 flex-1 truncate font-mono">
              {nft.txHash.slice(0, 20)}...{nft.txHash.slice(-8)}
            </code>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => copyToClipboard(nft.txHash!, "hash")}
                className="p-1.5 rounded hover:bg-[rgba(77,240,255,0.1)] transition-colors"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-frost" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-ash-200" />
                )}
              </button>
              <a
                href={getExplorerTxUrl(nft.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded hover:bg-[rgba(77,240,255,0.1)] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-ash-200" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={onUploadAnother}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-lg",
          "border border-[rgba(77,240,255,0.2)] text-frost text-sm font-semibold",
          "hover:bg-[rgba(77,240,255,0.05)] hover:border-[rgba(77,240,255,0.4)] transition-all"
        )}
      >
        <RotateCcw className="w-4 h-4" />
        Upload Another
      </button>
    </div>
  );
}
