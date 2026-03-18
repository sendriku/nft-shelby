import type { UploadedNFT } from "@/types";

const STORAGE_KEY = "shelby_nft_uploads";

export function saveUploadedNFT(nft: UploadedNFT): void {
  try {
    const existing = getUploadedNFTs();
    const updated = [nft, ...existing].slice(0, 50); // max 50 entries
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.warn("Failed to save NFT to localStorage");
  }
}

export function getUploadedNFTs(): UploadedNFT[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Rehydrate dates
    return parsed.map((nft: UploadedNFT) => ({
      ...nft,
      uploadedAt: new Date(nft.uploadedAt),
      expiresAt: new Date(nft.expiresAt),
    }));
  } catch {
    return [];
  }
}

export function deleteUploadedNFT(id: string): void {
  try {
    const existing = getUploadedNFTs();
    const updated = existing.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    console.warn("Failed to delete NFT from localStorage");
  }
}

export function generateNFTId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
