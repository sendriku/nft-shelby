"use client";

import { CheckCircle2, ExternalLink, Copy, RotateCcw, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { getExplorerTxUrl, getExplorerAccountUrl } from "@/lib/aptos";
import { formatFileSize } from "@/types";
import { toast } from "sonner";
import type { UploadedNFT } from "@/types";

interface UploadSuccessProps {
  nft: UploadedNFT;
  onUploadAnother: () => void;
}

export function UploadSuccess({ nft, onUploadAnother }: UploadSuccessProps) {
  const [copiedTx, setCopiedTx] = useState(false);
  const [copiedIpfs, setCopiedIpfs] = useState(false);

  const handleCopyTx = async () => {
    if (!nft.txHash) return;
    await navigator.clipboard.writeText(nft.txHash);
    setCopiedTx(true);
    toast.success("Transaction hash copied!");
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const handleCopyIpfs = async () => {
    if (!nft.ipfsHash) return;
    await navigator.clipboard.writeText(nft.ipfsHash);
    setCopiedIpfs(true);
    toast.success("IPFS hash copied!");
    setTimeout(() => setCopiedIpfs(false), 2000);
  };

  const isImage = nft.mimeType?.startsWith("image/");
  const isVideo = nft.mimeType?.startsWith("video/");
  const isAudio = nft.mimeType?.startsWith("audio/");

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <div className="absolute inset-0 rounded-full animate-ping bg-emerald-500/20" />
        </div>
        <div>
          <h3 className="text-xl font-display font-semibold text-frost">
            NFT Minted Successfully!
          </h3>
          <p className="text-sm text-frost/50 mt-1">
            Your file has been uploaded to Shelby and minted on Aptos
          </p>
        </div>
      </div>

      {/* Preview */}
      {nft.previewUrl && (
        <div className="glass-card rounded-xl overflow-hidden aspect-video flex items-center justify-center bg-void/50">
          {isImage && (
            <img
              src={nft.previewUrl}
              alt={nft.name}
              className="max-h-full max-w-full object-contain"
            />
          )}
          {isVideo && (
            <video
              src={nft.previewUrl}
              controls
              className="max-h-full max-w-full"
            />
          )}
          {isAudio && (
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center">
                <span className="text-3xl">🎵</span>
              </div>
              <audio src={nft.previewUrl} controls className="w-full" />
            </div>
          )}
        </div>
      )}

      {/* NFT Details */}
      <div className="glass-card rounded-xl divide-y divide-slate/30">
        <DetailRow label="Name" value={nft.name} />
        {nft.description && (
          <DetailRow label="Description" value={nft.description} />
        )}
        <DetailRow
          label="File Type"
          value={nft.fileType ?? nft.mimeType ?? "Unknown"}
        />
        {nft.fileSize !== undefined && (
          <DetailRow label="File Size" value={formatFileSize(nft.fileSize)} />
        )}
        {nft.tokenId && (
          <DetailRow label="Token ID" value={`#${nft.tokenId}`} />
        )}
        {nft.accountAddress && (
          <DetailRow
            label="Owner"
            value={`${nft.accountAddress.slice(0, 8)}...${nft.accountAddress.slice(-6)}`}
            href={getExplorerAccountUrl(nft.accountAddress)}
          />
        )}
      </div>

      {/* Transaction & IPFS */}
      <div className="space-y-3">
        {nft.txHash && (
          <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-frost/40 mb-1">Transaction Hash</p>
              <p className="text-sm text-frost/80 font-mono truncate">
                {nft.txHash}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleCopyTx}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copiedTx
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-slate/30 text-frost/50 hover:text-frost"
                )}
              >
                {copiedTx ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={getExplorerTxUrl(nft.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate/30 text-frost/50 hover:text-frost transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {nft.ipfsHash && (
          <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-frost/40 mb-1">IPFS Hash</p>
              <p className="text-sm text-frost/80 font-mono truncate">
                {nft.ipfsHash}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={handleCopyIpfs}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  copiedIpfs
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "hover:bg-slate/30 text-frost/50 hover:text-frost"
                )}
              >
                {copiedIpfs ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              {nft.shelbyUrl && (
                <a
                  href={nft.shelbyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-slate/30 text-frost/50 hover:text-frost transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onUploadAnother}
        className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate/30 hover:border-violet-500/50 hover:bg-violet-500/5 text-frost/60 hover:text-frost transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Mint Another NFT</span>
      </button>
    </div>
  );
}

function DetailRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 gap-4">
      <span className="text-sm text-frost/40 flex-shrink-0">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-violet-400 hover:text-violet-300 font-mono truncate flex items-center gap-1"
        >
          {value}
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
        </a>
      ) : (
        <span className="text-sm text-frost/80 truncate text-right">
          {value}
        </span>
      )}
    </div>
  );
}
