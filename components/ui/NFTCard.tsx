"use client";

import { useState } from "react";
import {
  Copy,
  ExternalLink,
  Trash2,
  Check,
  ImageIcon,
  Video,
  Music,
  Clock,
  HardDrive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getExplorerTxUrl } from "@/lib/aptos";
import {
  formatFileSize,
  getMediaCategory,
  truncateAddress,
} from "@/types";
import type { UploadedNFT } from "@/types";
import { toast } from "sonner";

interface NFTCardProps {
  nft: UploadedNFT;
  onDelete: (id: string) => void;
}

export function NFTCard({ nft, onDelete }: NFTCardProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const category = getMediaCategory(nft.fileType);

  const isExpired = new Date() > nft.expiresAt;
  const daysLeft = Math.max(
    0,
    Math.ceil((nft.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  async function handleCopyUrl() {
    await navigator.clipboard.writeText(nft.shelbyUrl);
    setCopiedUrl(true);
    toast.success("Shelby URL copied");
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete(nft.id);
    toast.success("Removed from gallery");
  }

  const MediaIcon =
    category === "image"
      ? ImageIcon
      : category === "video"
      ? Video
      : Music;

  return (
    <div
      className={cn(
        "group glass-card rounded-2xl overflow-hidden transition-all duration-300",
        "hover:border-[rgba(77,240,255,0.25)] hover:shadow-glow-frost hover:-translate-y-1",
        isExpired && "opacity-60"
      )}
    >
      {/* Media preview */}
      <div className="relative h-44 bg-gradient-to-br from-slate to-carbon overflow-hidden">
        {nft.previewUrl && category === "image" ? (
          <img
            src={nft.previewUrl}
            alt={nft.fileName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-frost/10 border border-frost/20 flex items-center justify-center">
              <MediaIcon className="w-7 h-7 text-frost/60" />
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon/80 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-full",
              category === "image" && "bg-frost/20 text-frost border border-frost/20",
              category === "video" && "bg-gold/20 text-gold border border-gold/20",
              category === "audio" && "bg-purple-400/20 text-purple-300 border border-purple-400/20"
            )}
          >
            {category}
          </span>
        </div>

        {/* Expiry badge */}
        <div
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-full",
            isExpired
              ? "bg-red-500/20 text-red-300 border border-red-500/20"
              : daysLeft <= 3
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/20"
              : "bg-carbon/80 text-ash-200 border border-ash-400"
          )}
        >
          <Clock className="w-2.5 h-2.5" />
          {isExpired ? "Expired" : `${daysLeft}d left`}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 space-y-3">
        {/* File name */}
        <div>
          <p className="text-sm font-semibold text-ash-100 truncate" title={nft.fileName}>
            {nft.fileName}
          </p>
          <p className="text-xs text-ash-300 font-mono mt-0.5">
            {truncateAddress(nft.accountAddress, 8)}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-ash-200 font-mono">
          <span className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            {formatFileSize(nft.fileSize)}
          </span>
          <span className="w-px h-3 bg-ash-400" />
          <span>
            {nft.uploadedAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Shelby URL */}
        <div className="flex items-center gap-2 p-2.5 bg-carbon rounded-lg border border-ash-400">
          <code className="text-[10px] text-frost/80 flex-1 truncate">
            {nft.shelbyUrl}
          </code>
          <button
            onClick={handleCopyUrl}
            className="shrink-0 p-1 rounded hover:bg-frost/10 transition-colors"
          >
            {copiedUrl ? (
              <Check className="w-3 h-3 text-frost" />
            ) : (
              <Copy className="w-3 h-3 text-ash-200" />
            )}
          </button>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-2 pt-1">
          {nft.txHash && (
            <a
              href={getExplorerTxUrl(nft.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all",
                "border border-[rgba(77,240,255,0.15)] text-ash-200",
                "hover:border-frost/40 hover:text-frost"
              )}
            >
              <ExternalLink className="w-3 h-3" />
              View TX
            </a>
          )}

          <button
            onClick={handleDelete}
            className={cn(
              "flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium transition-all",
              confirmDelete
                ? "bg-red-500/20 border border-red-500/30 text-red-300"
                : "border border-ash-400 text-ash-300 hover:border-red-500/30 hover:text-red-400"
            )}
          >
            <Trash2 className="w-3 h-3" />
            {confirmDelete ? "Confirm" : "Remove"}
          </button>
        </div>
      </div>
    </div>
  );
}
