import { NFTItem, UploadedNFT } from "@/types";

const STORAGE_KEY = "nft-shelby-items";

export function getNFTs(): NFTItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveNFT(item: NFTItem): void {
  if (typeof window === "undefined") return;
  const items = getNFTs();
  items.unshift(item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function deleteNFT(id: string): void {
  if (typeof window === "undefined") return;
  const items = getNFTs().filter((i) => i.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getUploadedNFTs(): UploadedNFT[] {
  return getNFTs().map((item) => ({
    id: item.id,
    fileName: item.blobName,
    fileSize: item.fileSize,
    shelbyUrl: item.shelbyUrl,
    txHash: item.txHash,
    expiresAt: new Date(item.expiresAt / 1000),
    mimeType: item.mimeType,
    uploadedAt: new Date(item.uploadedAt),
    ownerAddress: item.ownerAddress,
  }));
}

export function deleteUploadedNFT(id: string): void {
  deleteNFT(id);
}
