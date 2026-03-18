"use client";

import { Network } from "@aptos-labs/ts-sdk";

// Helper to get Shelby SDK dynamically (browser-only)
async function getShelbySDK() {
  const [
    { ShelbyClient },
    { ShelbyBlobClient },
    { createDefaultErasureCodingProvider, generateCommitments, expectedTotalChunksets },
  ] = await Promise.all([
    import("@shelby-protocol/sdk/browser"),
    import("@shelby-protocol/sdk/browser"),
    import("@shelby-protocol/sdk/browser"),
  ]);
  return { ShelbyClient, ShelbyBlobClient, createDefaultErasureCodingProvider, generateCommitments, expectedTotalChunksets };
}

export interface UploadResult {
  blobName: string;
  shelbyUrl: string;
  txHash: string;
  fileSize: number;
  mimeType: string;
  expiresAt: number;
}

export interface UploadProgress {
  step: "encoding" | "registering" | "uploading" | "done";
  message: string;
}

type ProgressCallback = (progress: UploadProgress) => void;

type SignAndSubmitFn = (payload: { data: unknown }) => Promise<{ hash: string }>;

export async function uploadToShelby(
  file: File,
  accountAddress: string,
  signAndSubmitTransaction: SignAndSubmitFn,
  onProgress: ProgressCallback
): Promise<UploadResult> {
  const {
    ShelbyClient,
    ShelbyBlobClient,
    createDefaultErasureCodingProvider,
    generateCommitments,
    expectedTotalChunksets,
  } = await getShelbySDK();

  // Import AccountAddress from ts-sdk to convert string → AccountAddress object
  const { AccountAddress } = await import("@aptos-labs/ts-sdk");
  const accountObj = AccountAddress.from(accountAddress);

  const apiKey = process.env.NEXT_PUBLIC_SHELBY_API_KEY || "";

  const shelbyClient = new ShelbyClient({
    network: Network.TESTNET,
    apiKey,
  });

  // Step 1: Encode
  onProgress({ step: "encoding", message: "Encoding file with erasure coding..." });
  const buffer = await file.arrayBuffer();
  const provider = await createDefaultErasureCodingProvider();
  const commitments = await generateCommitments(provider, buffer);

  // Step 2: Register on-chain
  onProgress({ step: "registering", message: "Registering blob on Aptos..." });
  const expirationMicros = (Date.now() + 30 * 24 * 60 * 60 * 1000) * 1000;

  const payload = ShelbyBlobClient.createRegisterBlobPayload({
    account: accountObj,
    blobName: file.name,
    blobMerkleRoot: commitments.blob_merkle_root,
    numChunksets: expectedTotalChunksets(commitments.raw_data_size),
    expirationMicros,
    blobSize: commitments.raw_data_size,
  });

  const tx = await signAndSubmitTransaction({ data: payload });

  // Step 3: Upload to Shelby RPC
  onProgress({ step: "uploading", message: "Uploading to Shelby network..." });
  await shelbyClient.rpc.putBlob({
    account: accountObj,
    blobName: file.name,
    blobData: new Uint8Array(buffer),
  });

  onProgress({ step: "done", message: "Upload complete!" });

  const shelbyUrl = `https://api.testnet.shelby.xyz/shelby/${accountAddress}/${file.name}`;

  return {
    blobName: file.name,
    shelbyUrl,
    txHash: tx.hash,
    fileSize: file.size,
    mimeType: file.type,
    expiresAt: expirationMicros,
  };
}
