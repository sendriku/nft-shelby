export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/flac",
];

export const ALL_SUPPORTED_TYPES = ACCEPTED_FILE_TYPES;

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export type MediaCategory = "image" | "video" | "audio" | "other";

export function getMediaCategory(mimeType: string): MediaCategory {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "other";
}

export interface NFTItem {
  id: string;
  blobName: string;
  shelbyUrl: string;
  txHash: string;
  fileSize: number;
  mimeType: string;
  expiresAt: number;
  uploadedAt: number;
  ownerAddress: string;
}

// Used by UploadSuccess and Gallery
export interface UploadedNFT {
  id: string;
  fileName: string;
  fileSize: number;
  shelbyUrl: string;
  txHash?: string;
  expiresAt: Date;
  mimeType?: string;
}

export interface UploadProgress {
  step: "encoding" | "registering" | "uploading" | "done" | "error" | "success";
  stepIndex: number;
  message: string;
  percentage: number;
  error?: string;
}

export interface UploadStep {
  id: string;
  label: string;
  desc: string;
}

export const UPLOAD_STEPS: UploadStep[] = [
  { id: "encoding", label: "Encode", desc: "Erasure coding the file" },
  { id: "registering", label: "Register", desc: "On-chain via Aptos" },
  { id: "uploading", label: "Upload", desc: "Storing to Shelby RPC" },
];

export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatExpiry(micros: number): string {
  const date = new Date(micros / 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
