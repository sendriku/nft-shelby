import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

// Aptos Testnet configuration
export const APTOS_NETWORK = Network.TESTNET;

export const aptosConfig = new AptosConfig({
  network: APTOS_NETWORK,
  clientConfig: {
    API_KEY: process.env.NEXT_PUBLIC_APTOS_API_KEY,
  },
});

export const aptosClient = new Aptos(aptosConfig);

// Shelby Testnet configuration
export const SHELBY_CONFIG = {
  network: APTOS_NETWORK,
  apiKey: process.env.NEXT_PUBLIC_SHELBY_API_KEY ?? "",
  rpcUrl: "https://api.testnet.shelby.xyz/shelby",
  aptosFullNodeUrl: "https://api.testnet.aptoslabs.com/v1",
  indexerUrl: "https://api.testnet.aptoslabs.com/v1/graphql",
  // Shelby smart contract address on testnet
  contractAddress:
    "0xc63d6a5efb0080a6029403131715bd4971e1149f7cc099aac69bb0069b3ddbf5",
};

/**
 * Normalize account address to string.
 * ts-sdk v2: account.address is AccountAddress object, needs .toString()
 */
export function addressToString(address: { toString(): string } | string): string {
  return typeof address === "string" ? address : address.toString();
}

/**
 * Wait for Aptos transaction with timeout
 */
export async function waitForTransaction(
  txHash: string,
  timeoutMs = 30000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await aptosClient.waitForTransaction({ transactionHash: txHash });
      return;
    } catch {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error(`Transaction ${txHash} timed out after ${timeoutMs}ms`);
}

/**
 * Get Aptos Explorer URL for a transaction
 */
export function getExplorerTxUrl(txHash: string): string {
  return `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`;
}

/**
 * Get Aptos Explorer URL for an account
 */
export function getExplorerAccountUrl(address: string): string {
  return `https://explorer.aptoslabs.com/account/${address}?network=testnet`;
}

/**
 * Truncate an Aptos address for display
 */
export function truncateAddress(address: string, chars = 6): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-4)}`;
}
