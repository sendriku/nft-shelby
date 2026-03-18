# SHELBY NFT — Decentralized Media Storage

> Upload, store, and retrieve NFT media assets on the **Shelby Protocol** — the high-performance decentralized blob storage network built on **Aptos** blockchain.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square)
![Aptos](https://img.shields.io/badge/Aptos-Testnet-00C2FF?style=flat-square)
![Shelby](https://img.shields.io/badge/Shelby-Testnet-4DF0FF?style=flat-square)

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Custom CSS Variables |
| Blockchain | Aptos Testnet |
| Storage | Shelby Protocol Testnet |
| Wallet | `@aptos-labs/wallet-adapter-react` |
| SDK | `@shelby-protocol/sdk` (browser client) |
| Notifications | Sonner |
| Icons | Lucide React |
| Animations | Framer Motion + CSS |

---

## 📁 Project Structure

```
nft-shelby/
├── app/
│   ├── layout.tsx           # Root layout + font + metadata
│   ├── page.tsx             # Homepage: Hero + Upload + HowItWorks
│   ├── gallery/page.tsx     # Gallery page: NFT grid + filters
│   ├── not-found.tsx        # 404 page
│   ├── providers.tsx        # AptosWalletAdapterProvider
│   └── globals.css          # Design system, CSS vars, animations
│
├── components/
│   ├── wallet/
│   │   └── WalletButton.tsx       # Connect/disconnect wallet dropdown
│   ├── upload/
│   │   ├── UploadPanel.tsx        # Main upload orchestrator
│   │   ├── FileDropzone.tsx       # Drag & drop file selector
│   │   ├── UploadProgress.tsx     # 3-step progress UI
│   │   └── UploadSuccess.tsx      # Success state + copy URLs
│   └── ui/
│       ├── Navbar.tsx             # Fixed nav with mobile menu
│       ├── Footer.tsx             # Footer with links
│       ├── HeroSection.tsx        # Landing hero
│       ├── HowItWorks.tsx         # 3-step explanation
│       ├── StatsBar.tsx           # Network stats row
│       └── NFTCard.tsx            # Gallery card component
│
├── lib/
│   ├── shelby.ts            # Upload service (3-step logic)
│   ├── aptos.ts             # Aptos client + explorer URLs
│   ├── storage.ts           # LocalStorage for NFT history
│   └── utils.ts             # cn() utility
│
└── types/
    └── index.ts             # All TypeScript types + constants
```

---

## 🚀 Setup

### 1. Clone & Install

```bash
git clone <your-repo>
cd nft-shelby
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your API keys:
- **Aptos API Key** → [developers.aptoslabs.com](https://developers.aptoslabs.com/)
- **Shelby API Key** → [developers.shelby.xyz](https://developers.shelby.xyz/)

### 3. Run

```bash
npm run dev
# open http://localhost:3000
```

---

## 🔄 Upload Flow (3 Steps)

The upload process follows the official Shelby Protocol specification:

```
File Selected
     │
     ▼
┌─────────────────────────────────────┐
│  STEP 1: Erasure Coding             │
│  createDefaultErasureCodingProvider │
│  generateCommitments(provider, buf) │
│  → blob_merkle_root + raw_data_size │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  STEP 2: On-Chain Registration      │
│  ShelbyBlobClient.createRegister    │
│    BlobPayload(...)                 │
│  signAndSubmitTransaction(payload)  │
│  aptosClient.waitForTransaction()   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  STEP 3: RPC Upload                 │
│  shelbyClient.rpc.putBlob({        │
│    account, blobName, blobData      │
│  })                                 │
└─────────────────────────────────────┘
                  │
                  ▼
              ✅ Done!
```

---

## 🌐 Network Reference

| Component | URL |
|-----------|-----|
| Shelby RPC | `https://api.testnet.shelby.xyz/shelby` |
| Aptos Full Node | `https://api.testnet.aptoslabs.com/v1` |
| Aptos Indexer | `https://api.testnet.aptoslabs.com/v1/graphql` |
| Smart Contract | `0xc63d6a5e...ddbf5` |

---

## 💰 Requirements

- **APT tokens** — for Aptos gas fees ([Faucet](https://aptos.dev/network/faucet))
- **ShelbyUSD** — 1 ShelbyUSD per upload ([Discord](https://discord.gg/shelbyprotocol))

---

## 🎨 Design System

Custom dark aesthetic built with:
- **Colors**: `void` → `obsidian` → `carbon` → `slate` depth scale
- **Accent**: `frost` (#4DF0FF) — Shelby brand cyan
- **Secondary**: `gold` (#E8B84B) — highlights
- **Fonts**: Bebas Neue (display), DM Sans (body), JetBrains Mono (code)

---

## 📦 Key Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript validation
npm run lint         # ESLint
```
