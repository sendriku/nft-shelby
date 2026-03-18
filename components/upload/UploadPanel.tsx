"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { uploadToShelby, UploadResult, UploadProgress } from "@/lib/shelby";
import { saveNFT } from "@/lib/storage";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/types";
import FileDropzone from "./FileDropzone";
import UploadProgressStepper from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";

const INITIAL_PROGRESS: UploadProgress = {
  step: "encoding",
  message: "Preparing...",
};

export default function UploadPanel() {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>(INITIAL_PROGRESS);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 50MB.");
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("File type not supported.");
      return;
    }
    setSelectedFile(file);
    setResult(null);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !account || !connected) return;

    setUploading(true);
    setProgress({ ...INITIAL_PROGRESS, step: "encoding" });

    try {
      const uploadResult = await uploadToShelby(
        selectedFile,
        account.address.toString(),
        signAndSubmitTransaction as never,
        (p) => setProgress(p)
      );

      saveNFT({
        id: crypto.randomUUID(),
        blobName: uploadResult.blobName,
        shelbyUrl: uploadResult.shelbyUrl,
        txHash: uploadResult.txHash,
        fileSize: uploadResult.fileSize,
        mimeType: uploadResult.mimeType,
        expiresAt: uploadResult.expiresAt,
        uploadedAt: Date.now(),
        ownerAddress: account.address.toString(),
      });

      setResult(uploadResult);
      toast.success("Upload successful!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setProgress(INITIAL_PROGRESS);
  };

  if (!connected) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="font-display text-xl text-frost mb-2">Connect Wallet</h3>
        <p className="text-muted text-sm">
          Connect your Aptos wallet to start uploading NFT media to Shelby.
        </p>
      </div>
    );
  }

  if (result) {
    return <UploadSuccess result={result} onReset={handleReset} />;
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div>
        <h2 className="font-display text-xl text-frost mb-1">Upload NFT Media</h2>
        <p className="text-muted text-sm">
          Store your NFT assets on Shelby — decentralized, fast, and permanent.
        </p>
      </div>

      <div className="h-px bg-border" />

      {uploading ? (
        <UploadProgressStepper progress={progress} />
      ) : (
        <>
          <FileDropzone
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />

          {selectedFile && (
            <button
              onClick={handleUpload}
              className="w-full py-3 px-6 rounded-xl bg-accent hover:bg-accent-bright text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.98]"
            >
              Upload to Shelby
            </button>
          )}
        </>
      )}
    </div>
  );
}
