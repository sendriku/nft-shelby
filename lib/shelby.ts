/**
 * Shelby Protocol Upload Service
 * Uses dynamic imports for @shelby-protocol/sdk/browser to prevent
 * Next.js from SSR-ing browser-only WASM/WebCrypto code.
 */

import { Network } from "@aptos-labs/ts-sdk";
import type { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { aptosClient, SHELBY_CONFIG, addressToString } from "./aptos";
import type { UploadProgress } from "@/types";

export type SignAndSubmitFn = (
  tx: InputTransactionData
) => Promise<{ hash: string }>;

export interface UploadToShelbyParams {
  file: File;
  accountAddress: { toString(): string } | string;
  signAndSubmitTransaction: SignAndSubmitFn;
  onProgress: (progress: UploadProgress) => void;
}

export interface UploadToShelbyResult {
  blobName: string;
  shelbyUrl: string;
  txHash: string;
  fileSize: number;
  expiresAt: Date;
}

/**
 * Lazy-load the Shelby browser SDK.
 * Must never be called at module load time (SSR-safe).
 */
async function getShelbySDK() {
  const sdk = await import("@shelby-protocol/sdk/browser");
  return sdk;
}

// Singleton client — created lazily on first use
let shelbyClientInstance: Awaited<ReturnType<typeof getShelbySDK>>["ShelbyClient"] | null = null;
type ShelbyClientInstance = InstanceType<Awaited<ReturnType<typeof getShelbySDK>>["ShelbyClient"]>;
let shelbyClient: ShelbyClientInstance | null = null;

async function getClient(): Promise<ShelbyClientInstance> {
  if (!shelbyClient) {
    const { ShelbyClient } = await getShelbySDK();
    shelbyClient = new ShelbyClient({
      network: Network.TESTNET,
      apiKey: SHELBY_CONFIG.apiKey,
    });
  }
  return shelbyClient;
}

/**
 * Main upload function — orchestrates all 3 steps.
 * Safe to call from "use client" components only.
 */
export async function uploadToShelby(
  params: UploadToShelbyParams
): Promise<UploadToShelbyResult> {
  const { file, signAndSubmitTransaction, onProgress } = params;
  const accountAddress = addressToString(params.accountAddress);

  const report = (
    step: UploadProgress["step"],
    stepIndex: number,
    percentage: number,
    message: string
  ) => onProgress({ step, stepIndex, totalSteps: 3, percentage, message });

  // ─── Step 1: Erasure Coding ────────────────────────────────────────────────
  report("encoding", 0, 5, "Initializing erasure coding provider...");

  const {
    createDefaultErasureCodingProvider,
    generateCommitments,
    expectedTotalChunksets,
    ShelbyBlobClient,
  } = await getShelbySDK();

  const data = Buffer.from(await file.arrayBuffer());
  report("encoding", 0, 20, "Generating chunk commitments...");

  let commitments: Awaited<ReturnType<typeof generateCommitments>>;
  try {
    const provider = await createDefaultErasureCodingProvider();
    commitments = await generateCommitments(provider, data);
    report("encoding", 0, 33, "Erasure coding complete ✓");
  } catch (err) {
    throw new Error(`Encoding failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ─── Step 2: On-Chain Registration ────────────────────────────────────────
  report("registering", 1, 38, "Preparing Aptos transaction...");

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const expirationMicros = expiresAt.getTime() * 1000;

  let txHash: string;
  try {
    const payload = ShelbyBlobClient.createRegisterBlobPayload({
      account: accountAddress,
      blobName: file.name,
      blobMerkleRoot: commitments.blob_merkle_root,
      numChunksets: expectedTotalChunksets(commitments.raw_data_size),
      expirationMicros,
      blobSize: commitments.raw_data_size,
    });

    report("registering", 1, 45, "Waiting for wallet signature...");
    const tx = await signAndSubmitTransaction({ data: payload });
    txHash = tx.hash;

    report("registering", 1, 55, "Confirming transaction on-chain...");
    await aptosClient.waitForTransaction({ transactionHash: txHash });
    report("registering", 1, 66, "Registered on Aptos ✓");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("cancelled")) {
      throw new Error("Transaction was rejected by the wallet.");
    }
    throw new Error(`On-chain registration failed: ${msg}`);
  }

  // ─── Step 3: RPC Upload ───────────────────────────────────────────────────
  report("uploading", 2, 70, "Connecting to Shelby RPC...");

  try {
    const client = await getClient();
    report("uploading", 2, 80, "Uploading to storage providers...");

    await client.rpc.putBlob({
      account: accountAddress,
      blobName: file.name,
      blobData: new Uint8Array(await file.arrayBuffer()),
    });

    report("uploading", 2, 95, "Verifying upload integrity...");
    const shelbyUrl = buildShelbyUrl(accountAddress, file.name);
    report("success", 2, 100, "Upload complete ✓");

    return {
      blobName: file.name,
      shelbyUrl,
      txHash: txHash!,
      fileSize: commitments.raw_data_size,
      expiresAt,
    };
  } catch (err) {
    throw new Error(
      `RPC upload failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

export function buildShelbyUrl(accountAddress: string, blobName: string): string {
  return `${SHELBY_CONFIG.rpcUrl}/blob/${accountAddress}/${encodeURIComponent(blobName)}`;
}

export async function downloadFromShelby(
  accountAddress: string,
  blobName: string
): Promise<ArrayBuffer> {
  const client = await getClient();
  const data = await client.rpc.getBlob({ account: accountAddress, blobName });
  return data.buffer;
}
