"use client";

import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileDropzone } from "./FileDropzone";
import { UploadProgressDisplay } from "./UploadProgress";
import { UploadSuccess } from "./UploadSuccess";
import { uploadToShelby } from "@/lib/shelby";
import { saveUploadedNFT, generateNFTId } from "@/lib/storage";
import { getMediaCategory } from "@/types";
import type { UploadProgress, UploadedNFT } from "@/types";
import { toast } from "sonner";

const INITIAL_PROGRESS: UploadProgress = {
  step: "idle",
  stepIndex: 0,
  totalSteps: 3,
  percentage: 0,
  message: "Ready",
};

export function UploadPanel() {
  const { account, connected, signAndSubmitTransaction } = useWallet();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);
  const [uploadedNFT, setUploadedNFT] = useState<UploadedNFT | null>(null);

  const isUploading = ["encoding", "registering", "uploading"].includes(
    progress.step
  );

  async function handleUpload() {
    if (!selectedFile || !account?.address || !connected) return;

    try {
      setProgress({ ...INITIAL_PROGRESS, step: "encoding" });

      const result = await uploadToShelby({
        file: selectedFile,
        accountAddress: account.address.toString(),
        signAndSubmitTransaction: signAndSubmitTransaction as never,
        onProgress: setProgress,
      });

      // Build NFT record
      const nft: UploadedNFT = {
        id: generateNFTId(),
        fileName: selectedFile.name,
        fileSize: result.fileSize,
        fileType: selectedFile.type,
        shelbyUrl: result.shelbyUrl,
        blobName: result.blobName,
        accountAddress: account.address.toString(),
        uploadedAt: new Date(),
        expiresAt: result.expiresAt,
        txHash: result.txHash,
        previewUrl:
          getMediaCategory(selectedFile.type) === "image"
            ? URL.createObjectURL(selectedFile)
            : undefined,
      };

      saveUploadedNFT(nft);
      setUploadedNFT(nft);
      toast.success("NFT media stored on Shelby! 🎉");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setProgress((prev) => ({
        ...prev,
        step: "error",
        error: message,
      }));
      toast.error(message);
    }
  }

  function handleReset() {
    setSelectedFile(null);
    setProgress(INITIAL_PROGRESS);
    setUploadedNFT(null);
  }

  // ─── Success state ─────────────────────────────────────────────────────────
  if (uploadedNFT) {
    return (
      <div className="glass-card rounded-2xl p-6 shadow-card">
        <UploadSuccess nft={uploadedNFT} onUploadAnother={handleReset} />
      </div>
    );
  }

  // ─── Upload form ───────────────────────────────────────────────────────────
  return (
    <div className="glass-card rounded-2xl p-6 shadow-card space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wider text-ash-100">
            UPLOAD MEDIA
          </h2>
          <p className="text-xs text-ash-200 mt-0.5 font-mono">
            Shelby Testnet · Aptos Testnet
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ash-200 bg-carbon px-3 py-1.5 rounded-lg border border-ash-400">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          Online
        </div>
      </div>

      <div className="frost-line" />

      {/* Not connected warning */}
      {!connected && (
        <div className="flex items-start gap-3 p-4 bg-gold/5 border border-gold/20 rounded-xl">
          <Wallet className="w-4 h-4 text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gold font-semibold">Wallet not connected</p>
            <p className="text-xs text-ash-200 mt-0.5">
              Connect your Aptos wallet to upload media to Shelby.
            </p>
          </div>
        </div>
      )}

      {/* Progress display OR dropzone */}
      {isUploading ? (
        <UploadProgressDisplay progress={progress} />
      ) : (
        <>
          <FileDropzone
            onFileSelected={setSelectedFile}
            disabled={!connected || isUploading}
          />

          {/* Error display */}
          {progress.step === "error" && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-300">{progress.error}</p>
              <button
                onClick={() => setProgress(INITIAL_PROGRESS)}
                className="text-xs text-red-400 underline mt-1"
              >
                Dismiss
              </button>
            </div>
          )}
        </>
      )}

      {/* Upload requirements */}
      {!isUploading && (
        <div className="flex items-start gap-2 text-xs text-ash-300">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p>
            Requires{" "}
            <span className="text-frost">APT</span> for gas +{" "}
            <span className="text-gold">1 ShelbyUSD</span> per upload.
            Files stored for 30 days on testnet.
          </p>
        </div>
      )}

      {/* Upload button */}
      {!isUploading && (
        <button
          onClick={handleUpload}
          disabled={!connected || !selectedFile}
          className={cn(
            "w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200",
            connected && selectedFile
              ? "bg-frost text-void hover:shadow-glow-frost hover:scale-[1.01] active:scale-[0.99]"
              : "bg-ash-400 text-ash-200 cursor-not-allowed opacity-60"
          )}
        >
          {!connected
            ? "Connect Wallet to Upload"
            : !selectedFile
            ? "Select a File First"
            : "Upload to Shelby →"}
        </button>
      )}
    </div>
  );
}
