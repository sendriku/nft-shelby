"use client";

import { Network } from "@aptos-labs/ts-sdk";
import { UploadProgress } from "@/types";

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

type SignAndSubmitFn = (payload: { data: unknown }) => Promise<{ hash: string }>;

export async function uploadToShelby(
  file: File,
  accountAddress: string,
  signAndSubmitTransaction: SignAndSubmitFn,
  onProgress: (progress: UploadProgress) => void
): Promise<UploadResult> {
  const {
    ShelbyClient,
    ShelbyBlobClient,
    createDefaultErasureCodingProvider,
    generateCommitments,
    expectedTotalChunksets,
  } = await getShelbySDK();

  const { AccountAddress } = await import("@aptos-labs/ts-sdk");
  const accountObj = AccountAddress.from(accountAddress);

  const apiKey = process.env.NEXT_PUBLIC_SHELBY_API_KEY || "";

  const shelbyClient = new ShelbyClient({
    network: Network.TESTNET,
    apiKey,
  });

  // Step 1: Encode
  onProgress({ step: "encoding", stepIndex: 0, percentage: 10, message: "Encoding file with erasure coding..." });
  const buffer = await file.arrayBuffer();
  const provider = await createDefaultErasureCodingProvider();
  const commitments = await generateCommitments(provider, buffer);

  // Step 2: Register on-chain
  onProgress({ step: "registering", stepIndex: 1, percentage: 40, message: "Registering blob on Aptos..." });
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

  // Step 3: Upload
  onProgress({ step: "uploading", stepIndex: 2, percentage: 70, message: "Uploading to Shelby network..." });
  await shelbyClient.rpc.putBlob({
    account: accountObj,
    blobName: file.name,
    blobData: new Uint8Array(buffer),
  });

  onProgress({ step: "success", stepIndex: 2, percentage: 100, message: "Upload complete!" });

  return {
    blobName: file.name,
    shelbyUrl: `https://api.testnet.shelby.xyz/shelby/${accountAddress}/${file.name}`,
    txHash: tx.hash,
    fileSize: file.size,
    mimeType: file.type,
    expiresAt: expirationMicros,
  };
}
