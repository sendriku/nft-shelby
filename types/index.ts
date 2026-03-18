// Upload states
export type UploadStep = "idle" | "encoding" | "registering" | "uploading" | "success" | "error";

export interface UploadProgress {
  step: UploadStep;
  stepIndex: number;
  totalSteps: number;
  percentage: number;
  message: string;
  error?: string;
}

export interface UploadedNFT {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  shelbyUrl: string;
  blobName: string;
  accountAddress: string;
  uploadedAt: Date;
  previewUrl?: string;
  txHash?: string;
  expiresAt: Date;
}

export interface ShelbyConfig {
  network: string;
  apiKey: string;
  rpcUrl: string;
  aptosFullNodeUrl: string;
}

export interface EncodeResult {
  blob_merkle_root: Uint8Array;
  raw_data_size: number;
  commitments: unknown;
}

// File validation
export const SUPPORTED_MEDIA_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac"],
} as const;

export const ALL_SUPPORTED_TYPES = [
  ...SUPPORTED_MEDIA_TYPES.image,
  ...SUPPORTED_MEDIA_TYPES.video,
  ...SUPPORTED_MEDIA_TYPES.audio,
];

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function getMediaCategory(type: string): "image" | "video" | "audio" | "unknown" {
  if (SUPPORTED_MEDIA_TYPES.image.includes(type as never)) return "image";
  if (SUPPORTED_MEDIA_TYPES.video.includes(type as never)) return "video";
  if (SUPPORTED_MEDIA_TYPES.audio.includes(type as never)) return "audio";
  return "unknown";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}

export const UPLOAD_STEPS = [
  { index: 0, id: "encoding", label: "Encoding", desc: "Generating erasure coding & commitments" },
  { index: 1, id: "registering", label: "Registering", desc: "Submitting transaction on Aptos" },
  { index: 2, id: "uploading", label: "Uploading", desc: "Sending data to Shelby RPC" },
] as const;
