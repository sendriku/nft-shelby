import Link from "next/link";
import { Database, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[rgba(77,240,255,0.06)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-frost/10 border border-frost/20 flex items-center justify-center">
              <Database className="w-3.5 h-3.5 text-frost" />
            </div>
            <div>
              <span className="font-display tracking-widest text-ash-200 text-sm">
                SHELBY NFT
              </span>
              <p className="text-[10px] text-ash-300 font-mono">
                Decentralized Storage on Aptos
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-ash-300">
            <a
              href="https://docs.shelby.xyz/protocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frost transition-colors flex items-center gap-1"
            >
              Docs <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://explorer.shelby.xyz/testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frost transition-colors flex items-center gap-1"
            >
              Explorer <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://discord.gg/shelbyprotocol"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frost transition-colors flex items-center gap-1"
            >
              Discord <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://aptos.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-frost transition-colors flex items-center gap-1"
            >
              Aptos <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Network badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-ash-300 bg-carbon px-3 py-1.5 rounded-full border border-ash-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Testnet
          </div>
        </div>

        <div className="frost-line mt-8 mb-4" />

        <p className="text-center text-[11px] text-ash-300 font-mono">
          Built on{" "}
          <span className="text-frost">Shelby Protocol</span> ·{" "}
          <span className="text-ash-200">Aptos Testnet</span> ·{" "}
          © {new Date().getFullYear()} — All uploaded data subject to Shelby testnet wipe schedule
        </p>
      </div>
    </footer>
  );
}
